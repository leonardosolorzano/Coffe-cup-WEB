"use client";

import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { routes } from "@/lib/routes";

/**
 * Cada banner llevaba a "#". Ahora cada uno apunta a donde corresponde: el
 * descuento a /offers, el resto a las paginas que explican esa Politica.
 */
const BANNERS: {
  id: number;
  title: string;
  description: string;
  href: string;
}[] = [
  {
    id: 1,
    title: "Envío en 24/48 h",
    description:
      "Como cliente VIP, tus envios en 24/48 horas. Obtén más información y únete",
    href: routes.contact,
  },
  {
    id: 2,
    title: "Consigue hasta un -25% en compras superiores a 40€",
    description:
      "−20 % al gastar 100 € o −25 % al gastar 150 €. Usa el código TARREDEV.",
    href: routes.offers,
  },
  {
    id: 3,
    title: "Devoluciones y entregas gratuitas",
    description:
      "Como cliente, tienes envíos y devoluciones gratis en un plazo de 30 días en todos los pedidos. Obtén más información y únete",
    href: routes.about,
  },
  {
    id: 4,
    title: "Comprar novedades",
    description: "Todas las novedades al 50% de descuento",
    href: routes.shop,
  },
];

const CarouselTextBanner = () => {
  const router = useRouter();

  return (
    <div className="bg-muted">
      <Carousel
        className="container-page"
        plugins={[Autoplay({ delay: 2500 })]}
      >
        <CarouselContent>
          {BANNERS.map((item) => (
            <CarouselItem key={item.id}>
              <button
                type="button"
                onClick={() => router.push(item.href)}
                className="w-full cursor-pointer p-1 text-left"
              >
                <Card className="bg-transparent ring-0">
                  <CardHeader className="text-center">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CarouselTextBanner;
