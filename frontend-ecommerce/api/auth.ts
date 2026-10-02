import type { ResponseType } from "@/types/response";

/**
 * Cliente de autenticacion contra el plugin users-permissions de Strapi.
 *
 * El backend corre con `jwtManagement: 'refresh'`, asi que no es un JWT de
 * 30 dias como antes: el access token dura 10 minutos
 * (`DEFAULT_ACCESS_TOKEN_LIFESPAN`) y el refresh token va en una cookie
 * httpOnly. Por eso:
 *
 * - el access token se guarda en memoria + localStorage y se manda como
 *   `Authorization: Bearer`;
 * - para renovar hay que llamar a `/api/auth/refresh` con `credentials:
 *   "include"` para que el navegador adjunte la cookie;
 * - el access token se renueva proactivamente (ver `isAccessTokenExpiring`)
 *   para que /users/me no falle a mitad de la sesion.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  confirmed?: boolean;
  blocked?: boolean;
};

export type AuthSession = {
  jwt: string;
  user: AuthUser;
};

export const ACCESS_TOKEN_STORAGE_KEY = "entretazas-auth";

type StoredSession = {
  jwt: string;
  user: AuthUser;
};

/**
 * Strapi responde con errores utiles en algunos casos y genericos en otros
 * (`Invalid identifier or password`, `Email or Username are already taken`).
 * Se devuelve el mensaje tal cual para poder mostrarlo en el formulario.
 */
async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const json = await res.json();
    const message = json?.error?.message ?? json?.message;

    if (typeof message === "string" && message.length > 0) return message;
  } catch {
    // Respuesta sin JSON (por ejemplo un 502 de un backend caido).
  }

  return fallback;
}

const store = (session: StoredSession) => {
  try {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Modo privado o cuota llena: la sesion sigue viva en memoria.
  }
};

export const readStoredSession = (): StoredSession | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredSession;

    if (typeof parsed?.jwt !== "string" || !parsed?.user?.id) return null;

    return parsed;
  } catch {
    return null;
  }
};

export const clearStoredSession = () => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    // Sin localStorage no hay nada que limpiar.
  }
};

/**
 * Lee el `exp` del JWT sin verificar la firma: aqui solo se usa para decidir
 * cuando renovar, la validacion real la hace el backend en cada request.
 */
export const getTokenExpiry = (jwt: string): number | null => {
  const payload = jwt.split(".")[1];
  if (!payload) return null;

  try {
    const decoded = JSON.parse(atob(payload)) as { exp?: number };
    return typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

/** Margen de 60s para que el token no expire en pleno vuelo. */
export const TOKEN_EXPIRY_MARGIN_MS = 60_000;

export const isAccessTokenExpiring = (
  jwt: string | null,
  now = Date.now(),
): boolean => {
  if (!jwt) return true;

  const expiresAt = getTokenExpiry(jwt);
  if (expiresAt === null) return true;

  return expiresAt - now <= TOKEN_EXPIRY_MARGIN_MS;
};

const setAuthHeader = (headers: Headers, jwt: string | null) => {
  if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
  return headers;
};

export const login = async (identifier: string, password: string) => {
  const res = await fetch(`${BACKEND_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    throw new Error(await readError(res, "No pudimos iniciar sesión."));
  }

  const session = (await res.json()) as AuthSession;
  store(session);

  return session;
};

export type RegisterResult =
  | { status: "ok"; session: AuthSession }
  /**
   * El panel puede tener activada la "confirmación por email": en ese caso
   * Strapi responde `{ user }` sin token. La cuenta quedó creada pero no hay
   * sesión hasta confirmar, asi que la UI lo dice en vez de fingir un login.
   */
  | { status: "pending-confirmation" };

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<RegisterResult> => {
  const res = await fetch(`${BACKEND_URL}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    throw new Error(
      await readError(res, "No pudimos crear la cuenta. Inténtalo de nuevo."),
    );
  }

  const session = (await res.json()) as Partial<AuthSession>;

  if (!session.jwt || !session.user) {
    return { status: "pending-confirmation" };
  }

  store({ jwt: session.jwt, user: session.user });

  return { status: "ok", session: { jwt: session.jwt, user: session.user } };
};

/**
 * Canjea la cookie httpOnly por un access token nuevo. Si la cookie ya no
 * esta (o expiro) devuelve `null`, que es la señal de que hay que limpiar la
 * sesion local.
 */
export const refreshSession = async (): Promise<AuthSession | null> => {
  const stored = readStoredSession();

  const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: setAuthHeader(new Headers(), stored?.jwt ?? null),
  });

  if (!res.ok) {
    clearStoredSession();
    return null;
  }

  const { jwt } = (await res.json()) as { jwt: string };
  const user = stored?.user;

  // Sin usuario guardado no hay sesion que renovar: el refresh solo existe
  // mientras haya un login hecho en este navegador.
  if (!jwt || !user) {
    clearStoredSession();
    return null;
  }

  const session: AuthSession = { jwt, user };
  store(session);

  return session;
};

export const logout = async (jwt: string | null) => {
  try {
    await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: setAuthHeader(new Headers(), jwt),
    });
  } catch {
    // Si el backend no responde, la sesion local se limpia igual: el usuario
    // no debe quedar "logueado" solo porque la red fallo.
  }

  clearStoredSession();
};

export const fetchCurrentUser = async (
  jwt: string | null,
): Promise<ResponseType<AuthUser>> => {
  if (!jwt) {
    return { result: null, loading: false, error: "" };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/users/me`, {
      headers: setAuthHeader(new Headers(), jwt),
      credentials: "include",
    });

    if (res.status === 401 || res.status === 403) {
      return {
        result: null,
        loading: false,
        error: "Tu sesión expiró. Volvé a iniciar sesión.",
      };
    }

    if (!res.ok) {
      throw new Error(await readError(res, "No pudimos leer tu perfil."));
    }

    return {
      result: (await res.json()) as AuthUser,
      loading: false,
      error: "",
    };
  } catch (err) {
    return {
      result: null,
      loading: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
};
