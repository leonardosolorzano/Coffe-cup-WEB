"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, ImageOff } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import ImageLightbox, { type LightboxImage } from "@/components/image-lightbox";
import { cn } from "@/lib/utils";
import type { ProductImageType } from "@/types/products";

const mediaUrl = (url: string) =>
  `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;

type ProductGalleryProps = {
  images: ProductImageType[] | null;
  productName: string;
};

/** Flechas del slider. Van dentro de <Carousel/> porque usan su contexto. */
const GalleryNav = ({ total }: { total: number }) => {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();

  // Con una sola imagen no hay nada que desplazar.
  if (total < 2) return null;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Imagen anterior"
        className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
      >
        <ChevronLeft />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Imagen siguiente"
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
      >
        <ChevronRight />
      </Button>
    </>
  );
};

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);
  const [lightbox, setLightbox] = React.useState<LightboxImage[] | null>(null);

  // `selectedScrollSnap` no es un valor de React, asi que hay que leerlo
  // imperativamente y copiarlo a estado en cada evento de Embla.
  React.useEffect(() => {
    if (!api) return;

    const sync = () => setSelected(api.selectedScrollSnap());

    sync();
    api.on("select", sync);
    api.on("reInit", sync);

    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl bg-muted text-muted-foreground">
        <ImageOff className="size-8" />
        <span className="text-sm">Sin imagen</span>
      </div>
    );
  }

  const lightboxImages = images.map((image) => ({
    src: mediaUrl(image.url),
    alt: image.alternativeText ?? productName,
  }));

  return (
    <div className="flex flex-col gap-3">
      <Carousel opts={{ align: "start" }} setApi={setApi} className="w-full">
        <div className="relative overflow-hidden rounded-xl bg-muted">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={image.id}>
                <button
                  type="button"
                  onClick={() => setLightbox(lightboxImages)}
                  className="group relative block aspect-square w-full overflow-hidden"
                  aria-label={`Ampliar la imagen ${index + 1} de ${productName}`}
                >
                  <Image
                    src={mediaUrl(image.url)}
                    alt={image.alternativeText ?? `${productName} ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <Expand className="size-4" />
                  </span>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>

          <GalleryNav total={images.length} />

          {images.length > 1 && (
            <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
              {selected + 1} / {images.length}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {images.map((image, index) => (
              <li key={image.id}>
                <button
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Ver la imagen ${index + 1}`}
                  aria-current={selected === index}
                  className={cn(
                    "relative size-16 overflow-hidden rounded-lg border-2 transition-colors",
                    selected === index
                      ? "border-amber-600"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <Image
                    src={mediaUrl(image.url)}
                    alt={
                      image.alternativeText ??
                      `${productName} miniatura ${index + 1}`
                    }
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Carousel>

      {lightbox && (
        <ImageLightbox
          images={lightbox}
          index={selected}
          onIndexChange={setSelected}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

export default ProductGallery;
