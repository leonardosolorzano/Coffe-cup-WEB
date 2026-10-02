"use client";

import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

/**
 * El catalogo de Strapi solo tiene el content-type `product` (cafe), asi que
 * no hay forma de filtrar "accesorios". Antes el menu mandaba esta seccion a
 * la home, lo que hacia que el usuario cayera en una pagina que no tenia nada
 * que ver con lo que habia tocado.
 *
 * La pagina es explicita sobre eso y lleva a donde si hay productos. Cuando se
 * agregue el tipo de producto al backend, se reemplaza el cuerpo por el
 * listado real.
 */
const AccesoriosView = () => (
  <main className="container-page flex flex-1 flex-col items-center justify-center gap-5 py-24 text-center">
    <PackageOpen className="size-10 text-muted-foreground" />

    <h1 className="text-2xl font-bold">Accesorios</h1>

    <p className="max-w-md text-muted-foreground">
      Todavía no tenemos una sección de accesorios. Estamos preparando tazas,
      molinillos y prensas; por ahora el catálogo es solo café.
    </p>

    <div className="flex flex-wrap justify-center gap-3">
      <Button
        render={<Link href={routes.shop} />}
        nativeButton={false}
        className="bg-amber-600 text-white hover:bg-amber-500"
      >
        Ver el café disponible
      </Button>
      <Button
        render={<Link href={routes.contact} />}
        nativeButton={false}
        variant="outline"
      >
        Pedir un accesorio
      </Button>
    </div>
  </main>
);

export default AccesoriosView;
