"use client";

import Image from "next/image";
import Link from "next/link";
import { CircleAlert, Heart, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavoritesStore } from "@/store/favorites-store";
import { productPath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types/products";

type ProductGridProps = {
  products: ProductType[] | null;
  loading: boolean;
  error: string;
  isFiltered: boolean;
};

const ProductCard = ({ product }: { product: ProductType }) => {
  const { productName, slug, images, price, origin, taste, category } = product;
  const image = images?.[0];

  const favorite = useFavoritesStore((state) =>
    state.items.some((line) => line.productId === product.id),
  );
  const toggleItem = useFavoritesStore((state) => state.toggleItem);

  const toggleFavorite = () => {
    toggleItem({
      productId: product.id,
      documentId: product.documentId,
      slug,
      productName,
      price,
      image: image ?? null,
    });
  };

  return (
    // El boton de favorito va fuera del <Link>: un <button> dentro de un
    // enlace es HTML invalido y ademas el click se pelearia con la
    // navegacion al producto.
    <div className="relative">
      <Link
        href={productPath(slug)}
        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
              {image ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.url}`}
                  alt={image.alternativeText ?? productName}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageOff className="size-6" />
                  <span className="text-xs">Sin imagen</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-1.5">
                {category && (
                  <Badge variant="secondary">{category.categoryName}</Badge>
                )}
                {origin && <Badge variant="outline">{origin}</Badge>}
                {taste && <Badge variant="outline">{taste}</Badge>}
              </div>

              <p className="font-semibold capitalize">{productName}</p>
              <p className="text-muted-foreground">${price}</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      <FavoriteButton
        active={favorite}
        onToggle={toggleFavorite}
        productName={productName}
      />
    </div>
  );
};

const FavoriteButton = ({
  active,
  onToggle,
  productName,
}: {
  active: boolean;
  onToggle: () => void;
  productName: string;
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={active}
    aria-label={
      active
        ? `Quitar ${productName} de favoritos`
        : `Agregar ${productName} a favoritos`
    }
    className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
  >
    <Heart
      className={cn("size-4", active && "fill-amber-600 text-amber-600")}
    />
  </button>
);

const ProductGrid = ({
  products,
  loading,
  error,
  isFiltered,
}: ProductGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-2 py-16 text-center"
      >
        <CircleAlert className="size-6 text-muted-foreground" />
        <p className="font-medium">No pudimos cargar los productos</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        {isFiltered
          ? "No hay productos que coincidan con el filtro."
          : "Todavía no hay productos en esta categoría."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
