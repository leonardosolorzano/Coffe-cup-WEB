export type CategoryImageType = {
  id: number;
  name: string;
  alternativeText: string | null;
  width: number;
  height: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
  } | null;
};

export type CategoryType = {
  id: number;
  documentId: string;
  categoryName: string;
  slug: string;
  /**
   * Opcional a proposito: cuando la categoria viene anidada dentro de un
   * producto (`populate=*`) Strapi solo la puebla un nivel, por lo que la
   * imagen no viene. En el endpoint `/api/categories` si viene.
   */
  mainimage?: CategoryImageType | null;
};
