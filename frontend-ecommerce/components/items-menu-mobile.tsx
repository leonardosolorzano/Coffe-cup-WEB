import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Link from "next/link";
import { Menu } from "lucide-react";

const ItemsMenuMobile = () => {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Menu />
        </PopoverTrigger>
        <PopoverContent>
          <Link href="/categories/cafe-molido" className="block">
            Café molido
          </Link>
          <Link href="/categories/cafe-grano" className="block">
            Café en grano
          </Link>
          <Link href="/categories/cage-capsula" className="block">
            Café en cápsulas
          </Link>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ItemsMenuMobile;
