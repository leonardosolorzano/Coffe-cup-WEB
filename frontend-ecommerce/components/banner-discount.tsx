import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { routes } from "@/lib/routes";

const BannerDiscount = () => {
  return (
    <div className="p-5 text-center sm:p-20">
      <h2>Consigue hasta un -25%</h2>
      <h3 className="mt-3 font-semibold">
        -20% al gastar 100€ o -25% al gastar 150€. Usa el código de Philes
      </h3>
      <div className="mx-auto mt-5 flex max-w-md justify-center gap-8 sm:flex-none">
        <Link
          href={routes.shop}
          className={buttonVariants({ variant: "default", size: "lg" })}
        >
          Ir a la tienda
        </Link>
        <Link
          href={routes.offers}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Más información
        </Link>
      </div>
    </div>
  );
};

export default BannerDiscount;
