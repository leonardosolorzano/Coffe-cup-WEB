import type { CategoryType } from "@/types/category";

export type ProductImageType = {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
};

export type ProductType = {
  id: number;
  documentId: string;
  productName: string;
  slug: string;
  description: string | null;
  active: boolean;
  isFeatured: boolean;
  taste: string | null;
  origin: string | null;
  price: number;
  images: ProductImageType[] | null;
  category: CategoryType | null;
};
