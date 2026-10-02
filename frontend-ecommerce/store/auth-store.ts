"use client";

import { create } from "zustand";
import {
  clearStoredSession,
  fetchCurrentUser,
  isAccessTokenExpiring,
  login as loginRequest,
  logout as logoutRequest,
  readStoredSession,
  refreshSession,
  register as registerRequest,
  type AuthUser,
} from "@/api/auth";

/**
 * Estado de sesion en el cliente.
 *
 * El access token de Strapi dura 10 minutos, asi que ademas de guardar la
 * sesion hay que renovarla. `ensureFreshSession` centraliza eso: cualquier
 * parte de la app que necesite el token puede pedirlo y renovar si toca.
 */

type AuthState = {
  user: AuthUser | null;
  jwt: string | null;
  /**
   * `false` hasta que se lee localStorage. El navbar y /account lo usan para
   * no pintar "Mi cuenta" en el servidor y luego cambiar a "Hola, ..." en el
   * cliente, que es hydration mismatch.
   */
  hydrated: boolean;
  pending: boolean;
  error: string;
  hydrate: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; pendingConfirmation: boolean }>;
  logout: () => Promise<void>;
  /** Renueva el access token si esta por expirar. Devuelve el token usable. */
  ensureFreshSession: () => Promise<string | null>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  jwt: null,
  hydrated: false,
  pending: false,
  error: "",

  hydrate: async () => {
    const stored = readStoredSession();

    if (!stored) {
      set({ hydrated: true });
      return;
    }

    // Se pinta la sesion guardada de entrada para que el navbar no parpadee
    // mientras se renueva el token.
    set({ user: stored.user, jwt: stored.jwt });

    // El token puede seguir vigente: si no, /users/me lo confirma o lo
    // renueva ahi mismo.
    if (!isAccessTokenExpiring(stored.jwt)) {
      const me = await fetchCurrentUser(stored.jwt);

      if (me.result) {
        set({ user: me.result, hydrated: true });
        return;
      }

      // 401 con un token que parecia vigente: se fuerza el refresh.
    }

    const refreshed = await refreshSession();

    if (!refreshed) {
      set({ user: null, jwt: null, hydrated: true });
      return;
    }

    const me = await fetchCurrentUser(refreshed.jwt);

    set({
      user: me.result ?? refreshed.user,
      jwt: refreshed.jwt,
      hydrated: true,
    });
  },

  login: async (identifier, password) => {
    set({ pending: true, error: "" });

    try {
      const session = await loginRequest(identifier, password);
      set({ user: session.user, jwt: session.jwt, pending: false });
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        pending: false,
      });
      return false;
    }
  },

  register: async (username, email, password) => {
    set({ pending: true, error: "" });

    try {
      const result = await registerRequest(username, email, password);

      if (result.status === "pending-confirmation") {
        set({ pending: false });
        return { ok: false, pendingConfirmation: true };
      }

      set({
        user: result.session.user,
        jwt: result.session.jwt,
        pending: false,
      });

      return { ok: true, pendingConfirmation: false };
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        pending: false,
      });
      return { ok: false, pendingConfirmation: false };
    }
  },

  logout: async () => {
    const { jwt } = get();
    set({ pending: true });

    await logoutRequest(jwt);

    clearStoredSession();
    set({ user: null, jwt: null, pending: false, error: "" });
  },

  ensureFreshSession: async () => {
    const { jwt } = get();

    if (!isAccessTokenExpiring(jwt)) return jwt;

    const refreshed = await refreshSession();

    if (!refreshed) {
      set({ user: null, jwt: null });
      return null;
    }

    set({ user: refreshed.user, jwt: refreshed.jwt });

    return refreshed.jwt;
  },
}));

export const useAuthHydration = () => {
  const hydrated = useAuthStore((state) => state.hydrated);
  const hydrate = useAuthStore((state) => state.hydrate);

  return { hydrated, hydrate };
};
