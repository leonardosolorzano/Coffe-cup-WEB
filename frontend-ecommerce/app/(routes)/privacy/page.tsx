import type { Metadata } from "next";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Política de privacidad | Entre Tazas",
  description: "Qué datos guardamos cuando usás Entre Tazas y para qué.",
};

const Page = () => {
  return (
    <main className="container-page flex-1 py-12">
      <article className="mx-auto flex max-w-2xl flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold">Política de privacidad</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última actualización: enero de 2026.
          </p>
        </header>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Qué guardamos</h2>
          <p className="text-muted-foreground">
            Tu carrito y tus favoritos se guardan en el navegador (localStorage)
            y no se envían a nuestros servidores hasta que iniciás sesión. Tu
            cuenta guarda nombre de usuario y email, y la sesión activa usa un
            token que el servidor valida en cada petición.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Para qué los usamos</h2>
          <p className="text-muted-foreground">
            Solo para gestionar tu cuenta y tus pedidos. No vendemos tus datos
            ni los usamos para publicidad.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Tus derechos</h2>
          <p className="text-muted-foreground">
            Podés pedirnos borrar tu cuenta y todos los datos asociados
            escribiéndonos a hola@entretazas.com. También podés borrar el
            carrito y los favoritos desde tu navegador, borrando los datos del
            sitio.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Cookies</h2>
          <p className="text-muted-foreground">
            Usamos una cookie técnica de sesión para mantener tu cuenta
            iniciada. No usamos cookies de seguimiento ni de terceros.
          </p>
        </section>

        <p className="text-sm text-muted-foreground">
          ¿Te queda alguna duda?{" "}
          <a
            href={routes.contact}
            className="font-medium text-amber-600 underline-offset-4 hover:underline"
          >
            Escribinos
          </a>
          .
        </p>
      </article>
    </main>
  );
};

export default Page;
