import Link from "next/link";
import CoffeImg from "@/public/cofee-section.jpg";
import Image from "next/image";
import { buttonVariants } from "./ui/button";
import { routes } from "@/lib/routes";

const ByCoffe = () => {
  return (
    <div className="relative mt-8 h-[60vh] w-full overflow-hidden">
      <Image
        src={CoffeImg}
        alt="coffe image"
        fill
        className="object-cover object-center"
      />
      {/* dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center text-white">
        <h3 className="text-lg font-light tracking-widest text-amber-300 uppercase">
          Sumérgete en una experiencia única
        </h3>
        <h1 className="text-5xl font-bold drop-shadow-lg">Café Exquisito</h1>
        <p className="max-w-md text-base text-white/80">
          Despierta tus sentidos con cada sorbo
        </p>
        {/* Antes era un <Button> sin onClick: no hacia nada al clickearlo. */}
        <Link
          href={routes.shop}
          className={buttonVariants({
            size: "lg",
            className:
              "mt-2 cursor-pointer bg-amber-700 px-8 py-2 text-white hover:bg-amber-600",
          })}
        >
          Comprar
        </Link>
      </div>
    </div>
  );
};

export default ByCoffe;
