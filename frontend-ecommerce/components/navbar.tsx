"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, User } from "lucide-react";
import MenuList from "./menu-list";
import ItemsMenuMobile from "./items-menu-mobile";
import ToogleTheme from "./toggle-theme";
import entreTazas from "@/public/entretazas.png";
import { selectTotalItems, useCartStore } from "@/store/cart-store";
import {
  selectFavoritesCount,
  useFavoritesStore,
} from "@/store/favorites-store";
import { useAuthStore } from "@/store/auth-store";
import { routes } from "@/lib/routes";

const iconClass =
  "transition-colors hover:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-3 focus-visible:outline-none";

/**
 * Los tres iconos de la derecha son enlaces, no botones: el de favoritos
 * usaba `router.push("/loved-products")` (ruta que no existe) y el de cuenta
 * no tenía handler, así que no pasaba nada. Ahora los dos van a páginas reales
 * y los contadores respetan la rehidratación para no romper el SSR.
 */
const Navbar = () => {
  const cartHydrated = useCartStore((state) => state.hydrated);
  const totalItems = useCartStore(selectTotalItems);

  const favoritesHydrated = useFavoritesStore((state) => state.hydrated);
  const favoritesCount = useFavoritesStore(selectFavoritesCount);

  const authHydrated = useAuthStore((state) => state.hydrated);
  const user = useAuthStore((state) => state.user);

  return (
    <header className="container-page flex items-center justify-between border-b border-border py-4">
      <Link href={routes.home} aria-label="Entre Tazas — inicio">
        <Image src={entreTazas} alt="Entre Tazas" width={150} height={150} />
      </Link>

      <div className="hidden items-center sm:flex">
        <MenuList />
      </div>
      <div className="flex sm:hidden">
        <ItemsMenuMobile />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href={routes.cart}
          aria-label="Carrito de compras"
          className={`relative ${iconClass}`}
        >
          <ShoppingCart strokeWidth={1} />
          {cartHydrated && totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-semibold text-white tabular-nums">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Link>

        <Link
          href={routes.favorites}
          aria-label="Mis favoritos"
          className={`relative ${iconClass}`}
        >
          <Heart strokeWidth={1} />
          {favoritesHydrated && favoritesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-semibold text-white tabular-nums">
              {favoritesCount > 99 ? "99+" : favoritesCount}
            </span>
          )}
        </Link>

        <Link
          href={routes.account}
          aria-label={user ? `Mi cuenta (${user.username})` : "Mi cuenta"}
          className={`relative ${iconClass}`}
        >
          <User strokeWidth={1} />
          {authHydrated && user && (
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-amber-600" />
          )}
        </Link>

        <ToogleTheme />
      </div>
    </header>
  );
};

export default Navbar;
