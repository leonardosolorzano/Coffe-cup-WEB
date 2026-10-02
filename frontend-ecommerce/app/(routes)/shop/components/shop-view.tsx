"use client";

import { useRouter, useSearchParams } from "next/navigation";
import useGetCategories from "@/api/getProducts";
import useGetProducts from "@/api/useGetProducts";
import FilterOrigin from "../../categories/components/filter-origin";
import ProductGrid from "../../categories/components/product-grid";
import { parseProductOrigin, type ProductOrigin } from "@/lib/product-filters";
import { categoryPath } from "@/lib/routes";

/**
 * `/shop` es el catalogo completo: mismos productos y mismo filtro de origen
 * que `/categories/[categorySlug]`, pero sin restricting por categoria.
 * `useGetProducts` ya acepta `categorySlug: ""` para no filtrar.
 */
const ShopView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const origin = parseProductOrigin(searchParams.get("origin"));

  const { result: categories } = useGetCategories();
  const {
    result: products,
    loading,
    error,
  } = useGetProducts({
    categorySlug: "",
    origin,
  });

  const handleOriginChange = (next: ProductOrigin | null) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (next) {
      nextParams.set("origin", next);
    } else {
      nextParams.delete("origin");
    }

    const query = nextParams.toString();

    router.push(query ? `/shop?${query}` : "/shop");
  };

  return (
    <main className="container-page flex-1 py-8">
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Tienda</h1>
        <p className="text-muted-foreground">
          Todo nuestro café de especialidad: granos, molidos y cápsulas.
        </p>

        {categories && categories.length > 0 && (
          <p className="text-sm text-muted-foreground">
            ¿Buscás algo puntual?{" "}
            <CategoryJumpList slugs={categories.map((c) => c.slug)} />
          </p>
        )}
      </header>

      <div className="flex gap-6">
        <FilterOrigin value={origin} onChange={handleOriginChange} />

        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          isFiltered={origin !== null}
        />
      </div>
    </main>
  );
};

const CategoryJumpList = ({ slugs }: { slugs: string[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const go = (slug: string) => {
    // Se arrastra el filtro de origen: si el usuario eligio Africa, tiene
    // sentido ver solo los cafes africanos tambien en la categoria.
    const query = searchParams.toString();

    router.push(query ? `${categoryPath(slug)}?${query}` : categoryPath(slug));
  };

  return slugs.map((slug) => (
    <button
      key={slug}
      type="button"
      onClick={() => go(slug)}
      className="font-medium text-amber-600 underline-offset-4 hover:underline"
    >
      {slug.replaceAll("-", " ")}
    </button>
  ));
};

export default ShopView;
