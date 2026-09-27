"use client";

import * as React from "react";
import Image from "next/image";
import { CircleAlert, ImageOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useGetFeaturedProducts from "@/api/useGetFeaturedProducts";
import SkeletonSchema from "./skeletonSchema";
import { ProductType } from "@/types/products";

const FeaturedProducts = () => {
  const { result, loading, error } = useGetFeaturedProducts();

  return (
    <section className="container-page py-10 sm:py-16">
      <h2 className="pb-6 text-3xl">Productos Destacados</h2>

      {loading && <SkeletonSchema grid={3} />}

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
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {result.map((product: ProductType) => {
              const { id, productName, images, price } = product;
              const imageUrl = images?.[0]?.url
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${images[0].url}`
                : null;

              return (
                <CarouselItem key={id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center gap-3">
                        <div className="relative aspect-square w-full">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={productName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex size-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
                              <ImageOff className="size-6" />
                              <span className="text-xs">Sin imagen</span>
                            </div>
                          )}
                        </div>

                        <p className="text-center font-semibold">
                          {productName}
                        </p>

                        <p className="text-muted-foreground">${price}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </section>
  );
};

export default FeaturedProducts;
