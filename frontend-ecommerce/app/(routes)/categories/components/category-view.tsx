"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import useGetProducts from "@/api/useGetProducts";
import useGetCategories from "@/api/getProducts";
import { parseProductOrigin, type ProductOrigin } from "@/lib/product-filters";
import CategorySidebar from "./category-sidebar";
import FilterOrigin from "./filter-origin";
import ProductGrid from "./product-grid";
import { categoryPath } from "@/lib/routes";

const CategoryView = () => {
  const params = useParams<{ categorySlug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categorySlug = params?.categorySlug ?? "";
  const origin = parseProductOrigin(searchParams.get("origin"));

  const { result: categories } = useGetCategories();
  const {
    result: products,
    loading,
    error,
  } = useGetProducts({
    categorySlug,
    origin,
  });

  const currentCategory = categories?.find(
    (category) => category.slug === categorySlug,
  );

  const handleOriginChange = (next: ProductOrigin | null) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (next) {
      nextParams.set("origin", next);
    } else {
      nextParams.delete("origin");
    }

    const query = nextParams.toString();

    router.push(
      query
        ? `${categoryPath(categorySlug)}?${query}`
        : categoryPath(categorySlug),
    );
  };

  return (
    <SidebarProvider>
      <CategorySidebar activeSlug={categorySlug} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold capitalize">
            {currentCategory?.categoryName ?? "Categorías"}
          </h1>
        </header>

        <div className="container-page flex gap-6 px-8 py-8">
          <FilterOrigin value={origin} onChange={handleOriginChange} />

          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            isFiltered={origin !== null}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CategoryView;
