"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import useGetCategories from "@/api/getProducts";
import type { CategoryType } from "@/types/category";
import { categoryPath, routes } from "@/lib/routes";

/**
 * Menu de escritorio.
 *
 * Antes las categorias estaban escritas a mano con `/category/grano`,
 * `/category/molido` y `/category/capsula`: rutas que no existen (faltaba la
 * "s" en `categories`) y slugs inventados que no tienen por qué coincidir con
 * los que genera Strapi. Ahora salen del backend, asi que el menu no puede
 * quedar desactualizado con el catalogo.
 */
const MenuList = () => {
  const { result: categories } = useGetCategories();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Cafés</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-100 gap-3 p-4 md:w-125 md:grid-cols-2 lg:w-150">
              {categories?.length ? (
                categories.map((category: CategoryType) => (
                  <CategoryListItem key={category.id} category={category} />
                ))
              ) : (
                <ListItem href={routes.shop} title="Tienda">
                  Todavía no hay categorías cargadas. Mirá el catálogo completo.
                </ListItem>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            render={<a href={routes.shop} />}
            className={navigationLinkClass}
          >
            Tienda
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            render={<a href={routes.about} />}
            className={navigationLinkClass}
          >
            Sobre nosotros
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            render={<a href={routes.contact} />}
            className={navigationLinkClass}
          >
            Contacto
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MenuList;

const navigationLinkClass = cn(
  "rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors outline-none hover:bg-muted focus:bg-muted",
);

const CategoryListItem = ({ category }: { category: CategoryType }) => (
  <li>
    <NavigationMenuLink
      render={<a href={categoryPath(category.slug)} />}
      className="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
    >
      <div className="text-sm leading-none font-medium capitalize">
        {category.categoryName}
      </div>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
        Mirá todos los cafés de esta categoría.
      </p>
    </NavigationMenuLink>
  </li>
);

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => (
  <li>
    <NavigationMenuLink
      render={
        <a
          ref={ref}
          className={cn(
            "block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        />
      }
    >
      <div className="text-sm leading-none font-medium">{title}</div>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
        {children}
      </p>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";
