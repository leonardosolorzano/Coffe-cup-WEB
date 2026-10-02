import Link from "next/link";
import { Coffee } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <main className="container-page flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <Coffee className="size-10 text-muted-foreground" />

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Error 404</p>
        <h1 className="text-3xl sm:text-4xl">Página no encontrada</h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          La página que buscas no existe o ha cambiado de dirección. Vuelve al
          inicio para seguir explorando nuestro café.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href={routes.home} className={cn(buttonVariants({ size: "lg" }))}>
          Volver al inicio
        </Link>
        <Link
          href={routes.shop}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Ir a la tienda
        </Link>
      </div>
    </main>
  );
}
