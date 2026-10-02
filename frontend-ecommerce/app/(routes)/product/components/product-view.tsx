"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, CircleAlert, Coffee } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useGetProduct from "@/api/useGetProduct";
import ProductGallery from "./product-gallery";
import ProductInfo from "./product-info";
import { categoryPath, routes } from "@/lib/routes";

const ProductSkeleton = () => (
  <div
    role="status"
    aria-busy="true"
    aria-label="Cargando producto"
    className="grid gap-10 lg:grid-cols-2"
  >
    <Skeleton className="aspect-square w-full" />
    <div className="flex flex-col gap-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

const ProductView = () => {
  const params = useParams<{ productSlug: string }>();
  const productSlug = params?.productSlug ?? "";

  const { result: product, loading, error } = useGetProduct(productSlug);

  const showNotFound = !loading && !error && product === null;

  return (
    <main className="container-page flex-1 py-8">
      <nav aria-label="Miga de pan" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <li>
            <Link
              href={routes.home}
              className="transition-colors hover:text-foreground"
            >
              Inicio
            </Link>
          </li>
          {product?.category && (
            <>
              <li aria-hidden="true">
                <ChevronRight className="size-4" />
              </li>
              <li>
                <Link
                  href={categoryPath(product.category.slug)}
                  className="transition-colors hover:text-foreground"
                >
                  {product.category.categoryName}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page" className="text-foreground">
            {product?.productName ?? "Producto"}
          </li>
        </ol>
      </nav>

      {loading && <ProductSkeleton />}

      {error && (
        <div
          role="alert"
          className="flex flex-col items-center gap-2 py-16 text-center"
        >
          <CircleAlert className="size-6 text-muted-foreground" />
          <p className="font-medium">No pudimos cargar el producto</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {showNotFound && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Coffee className="size-10 text-muted-foreground" />
          <p className="font-medium">No encontramos ese producto</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Puede que se haya agotado o que el enlace haya cambiado. Vuelve al
            inicio para ver nuestro café.
          </p>
          <Link
            href={routes.home}
            className="text-sm font-medium text-amber-600 underline-offset-4 hover:underline"
          >
            Volver al inicio
          </Link>
        </div>
      )}

      {product && (
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            images={product.images}
            productName={product.productName}
          />
          <ProductInfo product={product} />
        </div>
      )}
    </main>
  );
};

export default ProductView;
