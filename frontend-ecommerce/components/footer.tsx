import Link from "next/link";
import { routes } from "@/lib/routes";

/**
 * Antes los cuatro links apuntaban a "#", asi que no llevaban a ningun lado.
 * Ahora van a paginas reales.
 */
const dataFooter = [
  { id: 1, name: "Sobre nosotros", href: routes.about },
  { id: 2, name: "Tienda", href: routes.shop },
  { id: 3, name: "Ofertas", href: routes.offers },
  { id: 4, name: "Accesorios", href: routes.accesorios },
  { id: 5, name: "Contacto", href: routes.contact },
  { id: 6, name: "Mi cuenta", href: routes.account },
  { id: 7, name: "Política de privacidad", href: routes.privacy },
];

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="container-page flex flex-col gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl font-bold">Entre Tazas</p>
          <p className="mt-2 text-sm text-muted-foreground">
            El mejor café para acompañar tus momentos.
          </p>
        </div>

        <nav aria-label="Enlaces del pie de página">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {dataFooter.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container-page border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Entre Tazas. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
