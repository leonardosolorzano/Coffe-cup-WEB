"use client";

import Image from "next/image";
import Link from "next/link";
import { CircleAlert, ImageOff } from "lucide-react";
import useGetCategories from "@/api/getProducts";
import { CategoryType } from "@/types/category";
import SkeletonSchema from "./skeletonSchema";
import { categoryPath } from "@/lib/routes";

const ChooseCategory = () => {
  const { result, loading, error } = useGetCategories();

  return (
    <section className="mx-auto max-w-6xl px-6 py-8 sm:px-24 sm:py-16">
      <h3 className="pb-6 text-center text-3xl">Elige tu categoría favorita</h3>

      {loading && <SkeletonSchema grid={4} />}

      {error && (
        <div
          role="alert"
          className="flex flex-col items-center gap-2 py-16 text-center"
        >
          <CircleAlert className="size-6 text-muted-foreground" />
          <p className="font-medium">No pudimos cargar las categorías</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {!loading && !error && result !== null && result.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          No hay categorías disponibles.
        </p>
      )}

      {!loading && !error && result !== null && result.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6">
          {result.map((category: CategoryType) => {
            const { id, categoryName, slug, mainimage } = category;
            const imagePath =
              mainimage?.formats?.small?.url ?? mainimage?.url ?? null;
            const imageUrl = imagePath
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${imagePath}`
              : null;

            return (
              <Link
                href={categoryPath(slug)}
                key={id}
                className="group flex flex-col items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <div className="relative h-80 w-48 overflow-hidden rounded-lg bg-muted">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={mainimage?.alternativeText ?? categoryName}
                      fill
                      sizes="(min-width: 640px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ImageOff className="size-6" />
                      <span className="text-xs">Sin imagen</span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-3 rounded-md border border-white/45 transition-colors duration-300 group-hover:border-white/80 group-focus-visible:border-white/80" />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
                    <span className="max-w-full min-w-[70%] translate-y-2 border border-white/75 bg-black/25 px-4 py-3 text-center text-sm font-semibold wrap-break-word text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      {categoryName}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ChooseCategory;
