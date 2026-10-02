import type { Metadata } from "next";
import Link from "next/link";
import { Coffee } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Sobre nosotros | Entre Tazas",
  description:
    "Quiénes somos y cómo elegimos el café de especialidad que vendemos.",
};

const VALUES = [
  {
    title: "Origen claro",
    description:
      "Cada café indica de dónde viene. Elegimos lotes que se puedan rastrear hasta la finca.",
  },
  {
    title: "Tostado reciente",
    description:
      "Tostamos en cantidades chicas y con frecuencia, para que el café llegue con aroma y no solo con sabor.",
  },
  {
    title: "Precio justo",
    description:
      "Compramos volúmenes por encima del precio de mercado para que el productor sostenga su trabajo.",
  },
];

const Page = () => {
  return (
    <main className="container-page flex-1 py-12">
      <header className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
        <Coffee className="size-9 text-amber-600" />
        <h1 className="text-4xl font-bold tracking-tight">Sobre nosotros</h1>
        <p className="text-lg text-muted-foreground">
          Somos una tienda pequeña obsesionada con una cosa: que el café que
          llevás a la taza sea el mejor que podías haber comprado.
        </p>
      </header>

      <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
        {VALUES.map(({ title, description }) => (
          <div key={title}>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-2xl rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold">¿Tenés dudas?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Escribinos y te ayudamos a elegir el café que va con tu forma de
          prepararlo.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={routes.contact}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Contactanos
          </Link>
          <Link
            href={routes.shop}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Ver el catálogo
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Page;
