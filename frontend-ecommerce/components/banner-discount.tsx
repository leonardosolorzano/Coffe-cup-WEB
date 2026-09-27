import { buttonVariants } from "./ui/button"
import Link from "next/link"


const BannerDiscount = () => {
  return (
    <div className="p-5 sm:p-20 text-center">
        <h2>Consigue hasta un -25%</h2>
        <h3 className="mt-3 font-semibold">-20% al gastar 100€ o -25% al gastar 150€. Usa el código de Philes</h3>
        <div className="max-w-md mx-auto sm:flex justify-center gap-8 mt-5">
            <Link href="/tienda" className={buttonVariants({variant:"default", size:"lg"} )}>
                r a la tienda
            </Link>
            <Link href="/tienda" className={buttonVariants({variant:"outline", size:"lg"} )}>
                Más información
            </Link>
        </div>
    </div>
  )
}

export default BannerDiscount
