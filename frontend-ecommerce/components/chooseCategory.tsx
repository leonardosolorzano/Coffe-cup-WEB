"use client";

import useGetCategories from "@/api/getProducts";
import { CategoryType } from "@/types/category";
import Link from "next/link";

const ChooseCategory = () => {
  const { result, loading, error } = useGetCategories();

  console.log(result);
  return (
    <section className="mx-auto max-w-6xl px-6 py-8 sm:px-24 sm:py-16">
      <h3>Elige tu categoria favorita</h3>

      {!loading && !error && result !== null && (
        <div>
          {result.map((category: CategoryType) => {

            return (
              <Link href={`/categories/${category.id}`} key={category.id}>
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-lg bg-white p-4 shadow-md hover:shadow-lg">
                 {category.attributes.categoryName}
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
