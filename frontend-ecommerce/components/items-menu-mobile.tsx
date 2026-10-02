"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useGetCategories from "@/api/getProducts";
import type { CategoryType } from "@/types/category";
import { categoryPath, routes } from "@/lib/routes";

/**
 * Menu movil.
 *
 * Los tres links que tenia apuntaban a slugs fijos (`cafe-molido`,
 * `cafe-grano`, `cage-capsula`) que ademas de estar escritos a mano tenian un
 * typo. Si el backend se llama distinto, el menu llevaba a un 404. Ahora se
 * listan las categorias que devuelve Strapi y, cuando no hay ninguna, se
 * ofrece la tienda completa para que nunca quede un menu vacio.
 */
const ItemsMenuMobile = () => {
  const { result: categories, loading } = useGetCategories();

  return (
    <div>
      <Popover>
        <PopoverTrigger aria-label="Abrir menú">
          <Menu />
        </PopoverTrigger>
        <PopoverContent align="start" className="flex w-56 flex-col gap-1">
          {loading && (
            <p className="px-2 py-1 text-sm text-muted-foreground">Cargando…</p>
          )}

          {!loading &&
            (categories?.length ? (
              categories.map((category: CategoryType) => (
                <Link
                  key={category.id}
                  href={categoryPath(category.slug)}
                  className="rounded px-2 py-1 text-sm capitalize hover:bg-muted"
                >
                  {category.categoryName}
                </Link>
              ))
            ) : (
              <Link
                href={routes.shop}
                className="rounded px-2 py-1 text-sm hover:bg-muted"
              >
                Ver la tienda
              </Link>
            ))}

          <Link
            href={routes.shop}
            className="rounded px-2 py-1 text-sm hover:bg-muted"
          >
            Tienda
          </Link>
          <Link
            href={routes.offers}
            className="rounded px-2 py-1 text-sm hover:bg-muted"
          >
            Ofertas
          </Link>
          <Link
            href={routes.about}
            className="rounded px-2 py-1 text-sm hover:bg-muted"
          >
            Sobre nosotros
          </Link>
          <Link
            href={routes.contact}
            className="rounded px-2 py-1 text-sm hover:bg-muted"
          >
            Contacto
          </Link>
          <Link
            href={routes.account}
            className="rounded px-2 py-1 text-sm hover:bg-muted"
          >
            Mi cuenta
          </Link>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ItemsMenuMobile;
