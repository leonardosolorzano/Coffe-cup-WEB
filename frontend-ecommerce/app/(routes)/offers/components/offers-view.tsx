"use client";

import Link from "next/link";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/lib/routes";

/**
 * El backend no tiene un campo de descuento en el producto, asi que no se
 * puede generar un listado "real" de rebajas. En vez de inventar precios
 * falsos, la pagina explica las promos vigentes (que ya estan en el banner de
 * la home) y manda a la tienda. Cuando exista `isOnSale` en el schema, el
 * listado se puede sumar aca sin tocar nada mas.
 */
const PROMOS = [
  {
    title: "-20% al gastar 100 €",
    description: "Se aplica automáticamente al superar el monto en el carrito.",
  },
  {
    title: "-25% al gastar 150 €",
    description: "El mejor descuento disponible, también automático.",
  },
];

const OffersView = () => (
  <main className="container-page flex-1 py-10">
    <header className="mb-10 flex flex-col items-center gap-3 text-center">
      <Tag className="size-8 text-amber-600" />
      <h1 className="text-3xl font-bold">Ofertas</h1>
      <p className="max-w-md text-muted-foreground">
        Estas son las promociones que tenemos activas. Se aplican solas en el
        carrito cuando tu pedido llega al monto.
      </p>
    </header>

    <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
      {PROMOS.map(({ title, description }) => (
        <Card key={title}>
          <CardContent className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-widest text-amber-600 uppercase">
              Descuento
            </p>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="mt-10 flex justify-center">
      <Button
        render={<Link href={routes.shop} />}
        nativeButton={false}
        size="lg"
        className="bg-amber-600 text-white hover:bg-amber-500"
      >
        Ver el catálogo
      </Button>
    </div>
  </main>
);

export default OffersView;
