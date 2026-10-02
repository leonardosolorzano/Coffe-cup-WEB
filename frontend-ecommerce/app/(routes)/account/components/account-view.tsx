"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { CircleAlert, CircleCheck, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth-store";
import { routes } from "@/lib/routes";

type Mode = "login" | "register";

const AccountView = () => {
  const router = useRouter();

  const hydrated = useAuthStore((state) => state.hydrated);
  const user = useAuthStore((state) => state.user);
  const pending = useAuthStore((state) => state.pending);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);

  const [mode, setMode] = useState<Mode>("login");
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");

    if (mode === "login") {
      const ok = await login(identifier, password);

      // Tras autenticarse el usuario casi siempre quiere seguir comprando,
      // no quedarse en la pagina de cuenta.
      if (ok) router.push(routes.shop);
      return;
    }

    const result = await register(username, email, password);

    if (result.ok) {
      router.push(routes.shop);
      return;
    }

    // La cuenta quedó creada pero hay que confirmar el email: no hay sesión
    // todavía, así que se avisa en vez de mandar a la tienda como si nada.
    if (result.pendingConfirmation) {
      setNotice(
        "Creamos tu cuenta. Revisá tu correo para confirmarla y después podés iniciar sesión.",
      );
    }
  };

  if (!hydrated) {
    return (
      <main className="container-page flex-1 py-16">
        <h1 className="mb-8 text-3xl font-bold">Mi cuenta</h1>
        <p className="text-muted-foreground">Cargando tu sesión…</p>
      </main>
    );
  }

  if (user) {
    const handleLogout = async () => {
      await logout();
      router.push(routes.home);
    };

    return (
      <main className="container-page flex-1 py-16">
        <h1 className="mb-8 text-3xl font-bold">Mi cuenta</h1>

        <div className="max-w-md rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Sesión iniciada como</p>
          <p className="mt-1 text-xl font-semibold">{user.username}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>

          <Separator className="my-5" />

          <div className="flex flex-col gap-3">
            <Button
              render={<Link href={routes.shop} />}
              nativeButton={false}
              className="bg-amber-600 text-white hover:bg-amber-500"
            >
              Seguir comprando
            </Button>
            <Button
              render={<Link href={routes.favorites} />}
              nativeButton={false}
              variant="outline"
            >
              Ver mis favoritos
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleLogout}
              disabled={pending}
              className="text-muted-foreground hover:text-destructive"
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const isLogin = mode === "login";

  return (
    <main className="container-page flex flex-1 flex-col items-center py-16">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <Coffee className="size-8 text-amber-600" />
        <h1 className="text-3xl font-bold">
          {isLogin ? "Iniciá sesión" : "Creá tu cuenta"}
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {isLogin
            ? "Entrá para ver tus pedidos y tus productos favoritos."
            : "Creá tu cuenta para guardar tus favoritos y seguir tus pedidos."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-border p-6"
      >
        <div className="flex flex-col gap-5">
          {isLogin ? (
            <Field>
              <FieldLabel htmlFor="identifier">
                Email o nombre de usuario
              </FieldLabel>
              <Input
                id="identifier"
                name="identifier"
                autoComplete="username"
                required
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
              />
            </Field>
          ) : (
            <>
              <Field>
                <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  required
                  minLength={3}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>
            </>
          )}

          <Field>
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {!isLogin && (
              <FieldDescription>Mínimo 6 caracteres.</FieldDescription>
            )}
          </Field>

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 text-sm text-destructive"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          )}

          {notice && (
            <p
              role="status"
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-amber-600" />
              {notice}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="bg-amber-600 text-white hover:bg-amber-500"
          >
            {pending
              ? "Un momento…"
              : isLogin
                ? "Iniciar sesión"
                : "Crear cuenta"}
          </Button>
        </div>

        <Separator className="my-5" />

        <button
          type="button"
          onClick={() => {
            setMode(isLogin ? "register" : "login");
            setNotice("");
            useAuthStore.setState({ error: "" });
          }}
          className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {isLogin
            ? "¿No tenés cuenta? Creá una"
            : "¿Ya tenés cuenta? Iniciá sesión"}
        </button>
      </form>
    </main>
  );
};

export default AccountView;
