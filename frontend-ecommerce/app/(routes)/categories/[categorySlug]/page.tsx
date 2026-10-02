import { Suspense } from "react";
import SkeletonSchema from "@/components/skeletonSchema";
import CategoryView from "../components/category-view";

/**
 * `CategoryView` usa `useSearchParams`, y en Next 16 eso obliga a que este
 * Client Component este dentro de un <Suspense/> o el build de produccion
 * falla con "Missing Suspense boundary with useSearchParams".
 *
 * Por eso este page.tsx queda como Server Component y solo envuelve.
 */
const Page = () => {
  return (
    <Suspense fallback={<SkeletonSchema grid={4} />}>
      <CategoryView />
    </Suspense>
  );
};

export default Page;
