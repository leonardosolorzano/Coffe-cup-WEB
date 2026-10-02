import { Suspense } from "react";
import SkeletonSchema from "@/components/skeletonSchema";
import ShopView from "./components/shop-view";

export const metadata = {
  title: "Tienda | Entre Tazas",
  description:
    "Todo nuestro café: granos, molidos y cápsulas, con filtro por origen.",
};

/**
 * Igual que en `/categories/[categorySlug]`, `ShopView` usa
 * `useSearchParams` para el filtro de origen y eso obliga a un <Suspense/>
 * en el Server Component para que el build de producción no falle con
 * "Missing Suspense boundary with useSearchParams".
 */
const Page = () => {
  return (
    <Suspense fallback={<SkeletonSchema grid={4} />}>
      <ShopView />
    </Suspense>
  );
};

export default Page;
