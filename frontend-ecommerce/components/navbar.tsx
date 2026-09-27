"use client";

import { ShoppingCart, User, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MenuList from "./menu-list";

import entreTazas from "@/public/entretazas.png";
import Image from "next/image";
import ItemsMenuMobile from "./items-menu-mobile";
import ToogleTheme from "./toggle-theme";

const iconClass =
  "transition-colors hover:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-3 focus-visible:outline-none";

const Navbar = () => {
  const router = useRouter();
  return (
    <header className="container-page flex items-center justify-between border-b border-border py-4">
      <Link href="/" aria-label="Entre Tazas — inicio">
        <Image src={entreTazas} alt="Entre Tazas" width={150} height={150} />
      </Link>
      <div className="hidden items-center sm:flex">
        <MenuList />
      </div>
      <div className="flex sm:hidden">
        <ItemsMenuMobile />
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Carrito de compras"
          onClick={() => router.push("/cart")}
          className={iconClass}
        >
          <ShoppingCart strokeWidth={1} />
        </button>
        <button
          type="button"
          aria-label="Productos favoritos"
          onClick={() => router.push("/loved-products")}
          className={iconClass}
        >
          <Heart strokeWidth={1} />
        </button>
        <button type="button" aria-label="Mi cuenta" className={iconClass}>
          <User strokeWidth={1} />
        </button>
        <ToogleTheme />
      </div>
    </header>
  );
};

export default Navbar;
