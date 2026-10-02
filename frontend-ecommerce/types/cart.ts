import type { ProductImageType } from "@/types/products";

/**
 * Copia minima de un producto dentro del carrito.
 *
 * Se guarda el snapshot y no solo el `productId` para que el carrito siga
 * siendo legible aunque el producto cambie en el backend. Cuando exista el
 * checkout real habra que revalidar precio y disponibilidad contra Strapi
 * antes de cobrar.
 */
export type CartItem = {
  productId: number;
  documentId: string;
  slug: string;
  productName: string;
  price: number;
  image: ProductImageType | null;
  quantity: number;
};

/** Payload que acepta `addItem`: la cantidad se maneja aparte. */
export type NewCartItem = Omit<CartItem, "quantity">;
