"use client";

import * as React from "react";
import { ShoppingCart } from "lucide-react";

type AddToCartToastProps = {
  productName: string;
  onDismiss: () => void;
  /** Ms que permanece en pantalla antes de autogolpearse. */
  duration?: number;
};

/**
 * Aviso de "añadido al carrito" para la pagina de producto.
 *
 * Es autocontenido: solo llama a `onDismiss` cuando pasa el tiempo y el estado
 * vive en el padre, asi que no hace falta un store de toasts.
 */
const AddToCartToast = ({
  productName,
  onDismiss,
  duration = 3000,
}: AddToCartToastProps) => {
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 animate-in items-center gap-2 rounded-xl bg-amber-700 px-4 py-3 text-sm text-white shadow-lg fade-in slide-in-from-bottom-2"
    >
      <ShoppingCart className="size-4 shrink-0" />
      <span>
        <span className="font-semibold">{productName}</span> añadido al carrito
      </span>
    </div>
  );
};

export default AddToCartToast;
