/**
 * Opciones de filtro disponibles.
 *
 * Estas NO se leen del backend a proposito: el endpoint que las expone
 * (`/api/content-type-builder/content-types/api::product.product`) es un API
 * del panel de administracion de Strapi y responde 403 sin token.
 *
 * Si agregas un valor nuevo al enum `origin` en
 * `backend-ecommerce/src/api/product/content-types/product/schema.json`,
 * agregalo tambien aqui.
 */
export const PRODUCT_ORIGINS = [
  "Africa",
  "Asia",
  "America",
  "Europa",
] as const;

export type ProductOrigin = (typeof PRODUCT_ORIGINS)[number];

type ProductQuery = {
  categorySlug?: string | null;
  origin?: ProductOrigin | null;
};

const isProductOrigin = (value: string): value is ProductOrigin =>
  (PRODUCT_ORIGINS as readonly string[]).includes(value);

export const parseProductOrigin = (
  value: string | null | undefined,
): ProductOrigin | null =>
  value && isProductOrigin(value) ? value : null;

/**
 * Arma la query de Strapi para /api/products aplicando los filtros.
 * Devolver solo productos activos.
 */
export const buildProductsQuery = ({
  categorySlug,
  origin,
}: ProductQuery): string => {
  const params = new URLSearchParams();

  params.set("populate", "*");
  params.set("pagination[pageSize]", "50");
  params.set("sort[0]", "productName:asc");
  params.set("filters[active][$eq]", "true");

  if (categorySlug) {
    params.set("filters[category][slug][$eq]", categorySlug);
  }

  if (origin) {
    params.set("filters[origin][$eq]", origin);
  }

  return params.toString();
};
