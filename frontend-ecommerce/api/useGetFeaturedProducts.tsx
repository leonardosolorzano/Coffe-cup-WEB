"use client";

import { useEffect, useState } from "react";
import { ResponseType } from "@/types/response";
import { ProductType } from "@/types/products";

const useGetFeaturedProducts = (): ResponseType<ProductType[]> => {
  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = new URLSearchParams();
  params.set("filters[isFeatured][$eq]", "true");
  params.set("filters[active][$eq]", "true");
  params.set("populate", "*");
  params.set("pagination[pageSize]", "12");

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?${params.toString()}`;

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Error ${res.status} al cargar los productos`);
        }

        const json = await res.json();

        if (!Array.isArray(json?.data)) {
          throw new Error("El servidor no devolvió una lista de productos");
        }

        setResult(json.data);
        setLoading(false);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [url]);

  return { result, loading, error };
};

export default useGetFeaturedProducts;
