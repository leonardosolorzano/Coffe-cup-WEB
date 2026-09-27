import { useState, useEffect } from "react";
import { ResponseType } from "@/types/response";
import { ProductType } from "@/types/products";

const useGetFeaturedProducts = (): ResponseType<ProductType[]> => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[isFeatured][$eq]=true&populate=*`;

  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setResult(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);
  return { result, loading, error };
};

export default useGetFeaturedProducts;
