"use client";

import { useEffect, useState } from "react";
import { ResponseType } from "@/types/response";
import { ProductType } from "@/types/products";

/**
 * Trae un solo producto por su slug.
 *
 * Reusa el mismo contrato que `useGetProducts` (`ResponseType`), asi que
 * "no existe" y "no pudimos cargar" se distinguen por `error` vs
 * `result === null` con `loading === false`.
 */
const useGetProduct = (productSlug: string): ResponseType<ProductType> => {
  const [result, setResult] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = new URLSearchParams();
  params.set("filters[slug][$eq]", productSlug);
  params.set("filters[active][$eq]", "true");
  params.set("populate", "*");

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?${params.toString()}`;

  useEffect(() => {
    // Sin slug no hay nada que pedir: evita que Strapi devuelva el catalogo
    // completo por un filtro vacio.
    if (!productSlug) return;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Error ${res.status} al cargar el producto`);
        }

        const json = await res.json();

        if (!Array.isArray(json?.data)) {
          throw new Error("El servidor no devolvió una lista de productos");
        }

        setResult(json.data[0] ?? null);
        setLoading(false);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [url, productSlug]);

  // El caso "no hay slug" se resuelve aca y no con setState dentro del efecto,
  // porque setState sincrono en un efecto encadena renders.
  if (!productSlug) {
    return { result: null, loading: false, error: "" };
  }

  return { result, loading, error };
};

export default useGetProduct;
