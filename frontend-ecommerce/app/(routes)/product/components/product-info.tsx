"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Undo2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AddToCartToast from "@/components/add-to-cart-toast";
import { MAX_QUANTITY, useCartStore } from "@/store/cart-store";
import type { NewCartItem } from "@/types/cart";
import type { ProductType } from "@/types/products";
import { categoryPath } from "@/lib/routes";

const REASSURANCES = [
  { icon: Truck, label: "Envío gratis desde $50" },
  { icon: Undo2, label: "Devolución en 30 días" },
  { icon: ShieldCheck, label: "Pago seguro" },
];

const QuantityStepper = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (quantity: number) => void;
}) => (
  <div className="flex items-center gap-3">
    <span className="text-sm font-medium">Cantidad</span>
    <div className="flex items-center rounded-lg border border-border">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Quitar una unidad"
      >
        <Minus />
      </Button>
      <span
        className="w-10 text-center text-sm font-semibold tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label="Añadir una unidad"
      >
        <Plus />
      </Button>
    </div>
    {value >= MAX_QUANTITY && (
      <span className="text-xs text-muted-foreground">
        Máximo {MAX_QUANTITY} por compra
      </span>
    )}
  </div>
);

type ProductInfoProps = {
  product: ProductType;
};

const ProductInfo = ({ product }: ProductInfoProps) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = React.useState(1);
  const [toast, setToast] = React.useState<string | null>(null);

  const {
    productName,
    price,
    description,
    origin,
    taste,
    category,
    isFeatured,
  } = product;

  const cartItem: NewCartItem = {
    productId: product.id,
    documentId: product.documentId,
    slug: product.slug,
    productName,
    price,
    image: product.images?.[0] ?? null,
  };

  const handleAddToCart = () => {
    addItem(cartItem, quantity);
    setToast(productName);
  };

  const handleBuyNow = () => {
    addItem(cartItem, quantity);
    router.push("/cart");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {isFeatured && <Badge>Destacado</Badge>}
          {category && (
            <Badge
              variant="secondary"
              render={<Link href={categoryPath(category.slug)} />}
            >
              {category.categoryName}
            </Badge>
          )}
          {origin && <Badge variant="outline">Origen: {origin}</Badge>}
          {taste && <Badge variant="outline">Sabor: {taste}</Badge>}
        </div>

        <h1 className="text-3xl font-bold capitalize sm:text-4xl">
          {productName}
        </h1>

        <p className="text-3xl font-bold text-amber-600">${price}</p>

        {description ? (
          <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
            {description}
          </p>
        ) : (
          <p className="text-muted-foreground">
            Este producto todavía no tiene descripción.
          </p>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <QuantityStepper value={quantity} onChange={setQuantity} />

        {quantity > 1 && (
          <p className="text-sm text-muted-foreground">
            Subtotal:{" "}
            <span className="font-semibold text-foreground">
              ${(price * quantity).toFixed(2)}
            </span>
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleAddToCart}
            className="sm:flex-1"
          >
            <ShoppingCart />
            Añadir al carrito
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={handleBuyNow}
            className="bg-amber-600 text-white hover:bg-amber-500 sm:flex-1"
          >
            Comprar ahora
          </Button>
        </div>

        <ul className="flex flex-col gap-2 pt-2">
          {REASSURANCES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Icon className="size-4 shrink-0 text-amber-600" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      {toast && (
        <AddToCartToast productName={toast} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
};

export default ProductInfo;
