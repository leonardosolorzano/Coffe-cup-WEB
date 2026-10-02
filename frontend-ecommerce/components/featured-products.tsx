"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CircleAlert,
  ImageOff,
  ShoppingCart,
  Expand,
  Star,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useGetFeaturedProducts from "@/api/useGetFeaturedProducts";
import ImageLightbox from "./image-lightbox";
import SkeletonSchema from "./skeletonSchema";
import { useCartStore } from "@/store/cart-store";
import { ProductType } from "@/types/products";
import { productPath } from "@/lib/routes";

/* ─── Toast ──────────────────────────────────────────────────────────────── */
type ToastMsg = { id: number; name: string };

const ToastContainer = ({ toasts }: { toasts: ToastMsg[] }) => (
  <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-2">
    {toasts.map((t) => (
      <div
        key={t.id}
        className="flex animate-in items-center gap-2 rounded-xl bg-amber-700 px-4 py-3 text-sm text-white shadow-lg duration-300 fade-in slide-in-from-bottom-2"
      >
        <ShoppingCart className="size-4 shrink-0" />
        <span>
          <span className="font-semibold">{t.name}</span> añadido al carrito
        </span>
      </div>
    ))}
  </div>
);

/* ─── Product Card ───────────────────────────────────────────────────────── */
type ProductCardProps = {
  product: ProductType;
  onExpand: (src: string, alt: string) => void;
  onAddToCart: (product: ProductType) => void;
};

const ProductCard = ({ product, onExpand, onAddToCart }: ProductCardProps) => {
  const { productName, slug, images, price } = product;
  const imageUrl = images?.[0]?.url
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${images[0].url}`
    : null;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-zinc-900 dark:ring-white/10">
      {/* Featured badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-amber-600 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow">
        <Star className="size-2.5 fill-white" />
        Destacado
      </div>

      {/* Image — compact square */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {imageUrl ? (
          <>
            <Link href={productPath(slug)} className="block size-full">
              <Image
                src={imageUrl}
                alt={productName}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 80vw"
                className="object-cover transition-transform duration-500 group-hover:scale-108"
              />
            </Link>

            {/* dark scrim on hover */}
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />

            {/* action icons — center on hover */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <button
                onClick={() => onExpand(imageUrl, productName)}
                className="flex size-10 items-center justify-center rounded-full bg-white/95 text-zinc-800 shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110 hover:bg-white"
                aria-label={`Ver imagen de ${productName}`}
              >
                <Expand className="size-4" />
              </button>
              <button
                onClick={() => onAddToCart(product)}
                className="flex size-10 items-center justify-center rounded-full bg-amber-600 text-white shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110 hover:bg-amber-500"
                aria-label={`Añadir ${productName} al carrito`}
              >
                <ShoppingCart className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-zinc-400">
            <ImageOff className="size-6" />
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <Link
            href={productPath(slug)}
            className="truncate text-sm leading-snug font-semibold transition-colors hover:text-amber-600"
          >
            {productName}
          </Link>
          <span className="text-base font-bold text-amber-600">${price}</span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white shadow transition-transform duration-200 hover:scale-110 hover:bg-amber-500 active:scale-95"
          aria-label={`Añadir ${productName} al carrito`}
        >
          <ShoppingCart className="size-4" />
        </button>
      </div>

      {/* bottom accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
};

/* ─── Main component ─────────────────────────────────────────────────────── */
const FeaturedProducts = () => {
  const { result, loading, error } = useGetFeaturedProducts();
  const addItem = useCartStore((state) => state.addItem);

  const [lightbox, setLightbox] = React.useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [toasts, setToasts] = React.useState<ToastMsg[]>([]);
  const toastId = React.useRef(0);

  const showToast = (name: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, name }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000,
    );
  };

  const handleAddToCart = (product: ProductType) => {
    addItem({
      productId: product.id,
      documentId: product.documentId,
      slug: product.slug,
      productName: product.productName,
      price: product.price,
      image: product.images?.[0] ?? null,
    });
    showToast(product.productName);
  };

  return (
    <>
      <section className="container-page py-10 sm:py-16">
        {/* ── Header ── */}
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-2 text-xs font-semibold tracking-widest text-amber-600 uppercase">
            Selección especial
          </span>
          <h2 className="text-4xl font-bold tracking-tight">
            Productos Destacados
          </h2>
          <div className="mt-3 h-1 w-16 rounded-full bg-amber-600" />
        </div>

        {loading && <SkeletonSchema grid={4} />}

        {error && (
          <div
            role="alert"
            className="flex flex-col items-center gap-2 py-16 text-center"
          >
            <CircleAlert className="size-6 text-muted-foreground" />
            <p className="font-medium">No pudimos cargar los productos</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && result !== null && result.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">
            Todavía no hay productos destacados.
          </p>
        )}

        {!loading && !error && result !== null && result.length > 0 && (
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {result.map((product: ProductType) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard
                    product={product}
                    onExpand={(src, alt) => setLightbox({ src, alt })}
                    onAddToCart={handleAddToCart}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        )}
      </section>

      {lightbox && (
        <ImageLightbox
          images={[{ src: lightbox.src, alt: lightbox.alt }]}
          index={0}
          onIndexChange={() => {}}
          onClose={() => setLightbox(null)}
        />
      )}

      <ToastContainer toasts={toasts} />
    </>
  );
};

export default FeaturedProducts;
