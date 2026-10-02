import { Suspense } from "react";
import ProductView from "../components/product-view";

/**
 * Igual que en `/categories/[categorySlug]`, este page.tsx queda como Server
 * Component y solo envuelve al Client Component en un <Suspense/>: asi el
 * skeleton de carga se muestra sin bloquear el resto del layout.
 */
const Page = () => {
  return (
    <Suspense fallback={null}>
      <ProductView />
    </Suspense>
  );
};

export default Page;
