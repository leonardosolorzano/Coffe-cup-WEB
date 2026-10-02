"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cart-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { productPath, routes } from "@/lib/routes";

const FavoritesSkeleton = () => (
  <ul role="status" aria-busy="true" className="flex flex-col gap-6">
    {Array.from({ length: 3 }).map((_, index) => (
      <li key={index} className="flex gap-4">
        <Skeleton className="size-24 shrink-0" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-24" />
        </div>
      </li>
    ))}
  </ul>
);

const FavoritesView = () => {
  const hydrated = useFavoritesStore((state) => state.hydrated);
  const items = useFavoritesStore((state) => state.items);
  const removeItem = useFavoritesStore((state) => state.removeItem);
  const clear = useFavoritesStore((state) => state.clear);
  const addItem = useCartStore((state) => state.addItem);

  const moveToCart = (item: (typeof items)[number]) => {
    addItem(item);
    removeItem(item.productId);
  };

  if (!hydrated) {
    return (
      <main className="container-page flex-1 py-10">
        <h1 className="mb-8 text-3xl font-bold">Mis favoritos</h1>
        <FavoritesSkeleton />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container-page flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
        <Heart className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Todavía no tenés favoritos</h1>
        <p className="max-w-sm text-muted-foreground">
          Tocá el corazón en cualquier producto y lo vas a encontrar acá, listo
          para pasarlo al carrito cuando quieras.
        </p>
        <Button
          render={<Link href={routes.shop} />}
          nativeButton={false}
          className="bg-amber-600 text-white hover:bg-amber-500"
        >
          Explorar el catálogo
        </Button>
      </main>
    );
  }

  return (
    <main className="container-page flex-1 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        Mis favoritos{" "}
        <span className="text-base font-normal text-muted-foreground">
          ({items.length} {items.length === 1 ? "producto" : "productos"})
        </span>
      </h1>

      <ul className="flex max-w-3xl flex-col gap-6">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.image && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image.url}`}
                  alt={item.image.alternativeText ?? item.productName}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <Link
                  href={productPath(item.slug)}
                  className="font-medium transition-colors hover:text-amber-600"
                >
                  {item.productName}
                </Link>
                <p className="shrink-0 font-semibold tabular-nums">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="mt-auto flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => moveToCart(item)}
                  className="bg-amber-600 text-white hover:bg-amber-500"
                >
                  <ShoppingCart />
                  Al carrito
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.productId)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 />
                  Quitar
                </Button>
              </div>
            </div>
          </li>
        ))}

        <li>
          <Separator />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clear}
            className="mt-4 text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
            Vaciar favoritos
          </Button>
        </li>
      </ul>
    </main>
  );
};

export default FavoritesView;
