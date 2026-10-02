/**
 * Fuente unica de las rutas del sitio.
 *
 * Antes cada componente escribia su href a mano y se desincronizo: el menu
 * apuntaba a `/shop`, `/offers` y `/category/grano` (rutas que no existen) y
 * el banner a `/tienda`. Centralizarlo aqui hace que anadir una pagina sea
 * tocar un solo lugar y que `next.config.ts` pueda redirigir las URLs viejas
 * a las nuevas sin adivinar strings sueltos por el codigo.
 */
export const routes = {
  home: "/",
  shop: "/shop",
  offers: "/offers",
  accesorios: "/accesorios",
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  cart: "/cart",
  favorites: "/favorites",
  account: "/account",
} as const;

/** Categoria dinamica: el slug lo genera Strapi desde `categoryName`. */
export const categoryPath = (slug: string) => `/categories/${slug}`;

/** Producto dinamico: mismo criterio, el slug viene del backend. */
export const productPath = (slug: string) => `/product/${slug}`;

/**
 * Rutas viejas que se published en el sitio y ya no existen. Se mantienen
 * como redirect en `next.config.ts` para no romper enlaces guardados,
 * bookmarks o publicaciones que apuntaban a ellas.
 */
export const legacyRedirects: {
  source: string;
  destination: string;
  permanent: boolean;
}[] = [
  // El banner y el menu mezclaban "/tienda" y "/shop" para la misma pagina.
  { source: "/tienda", destination: routes.shop, permanent: true },
  // "/category/grano" vs "/categories/[categorySlug]": faltaba la "s".
  {
    source: "/category/:slug",
    destination: "/categories/:slug",
    permanent: true,
  },
  // El icono de favoritos del navbar apuntaba aqui.
  { source: "/loved-products", destination: routes.favorites, permanent: true },
];
