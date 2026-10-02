"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MAX_QUANTITY,
  selectTotalItems,
  selectTotalPrice,
  useCartStore,
} from "@/store/cart-store";
import { productPath, routes } from "@/lib/routes";

const FREE_SHIPPING_THRESHOLD = 50;

const mediaUrl = (url: string) =>
  `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;

const CartSkeleton = () => (
  <div role="status" aria-busy="true" className="flex flex-col gap-6">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex gap-4">
        <Skeleton className="size-24 shrink-0" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    ))}
  </div>
);

const CartLine = ({
  item,
}: {
  item: ReturnType<typeof useCartStore.getState>["items"][number];
}) => {
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <li className="flex gap-4">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
        {item.image && (
          <Image
            src={mediaUrl(item.image.url)}
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
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">${item.price} c/u</p>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex items-center rounded-lg border border-border">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => decrement(item.productId)}
              aria-label={`Quitar una unidad de ${item.productName}`}
            >
              <Minus />
            </Button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => increment(item.productId)}
              disabled={item.quantity >= MAX_QUANTITY}
              aria-label={`Añadir una unidad de ${item.productName}`}
            >
              <Plus />
            </Button>
          </div>

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
  );
};

const CartView = () => {
  const hydrated = useCartStore((state) => state.hydrated);
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);

  // Antes de rehidratar `items` esta vacio en memoria aunque haya cosas en
  // localStorage, asi que pintar aqui mostraria un carrito vacio y luego
  // saltaria el contenido: mismatch de hydration.
  if (!hydrated) {
    return (
      <main className="container-page flex-1 py-10">
        <h1 className="mb-8 text-3xl font-bold">Tu carrito</h1>
        <CartSkeleton />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container-page flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
        <Coffee className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="max-w-sm text-muted-foreground">
          Todavía no agregaste nada. Date una vuelta por el catálogo y encontrá
          tu próximo café.
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

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 5.9;

  return (
    <main className="container-page flex-1 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        Tu carrito{" "}
        <span className="text-base font-normal text-muted-foreground">
          ({totalItems} {totalItems === 1 ? "producto" : "productos"})
        </span>
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <ul className="flex flex-col gap-6">
          {items.map((item) => (
            <CartLine key={item.productId} item={item} />
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
              Vaciar carrito
            </Button>
          </li>
        </ul>

        <aside className="h-fit rounded-xl border border-border p-6">
          <h2 className="mb-4 text-lg font-semibold">Resumen</h2>

          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums">${totalPrice.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Envío</dt>
              <dd className="tabular-nums">
                {shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}
              </dd>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">
                ${(totalPrice + shipping).toFixed(2)}
              </dd>
            </div>
          </dl>

          {shipping > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Te faltan ${(FREE_SHIPPING_THRESHOLD - totalPrice).toFixed(2)}{" "}
              para el envío gratis.
            </p>
          )}

          <Button
            type="button"
            size="lg"
            disabled
            className="mt-6 w-full bg-amber-600 text-white"
          >
            <ShoppingBag />
            Finalizar compra
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            El pago todavía no está disponible.
          </p>
        </aside>
      </div>
    </main>
  );
};

export default CartView;
