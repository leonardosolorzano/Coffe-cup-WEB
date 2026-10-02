"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxImage = {
  src: string;
  alt: string;
};

type ImageLightboxProps = {
  images: LightboxImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/**
 * Modal de imagen ampliada. Comparte el patron que ya usaba
 * `featured-products.tsx` (Escape para cerrar, click fuera para cerrar) y le
 * suma navegacion entre imagenes con las flechas del teclado.
 */
const ImageLightbox = ({
  images,
  index,
  onIndexChange,
  onClose,
}: ImageLightboxProps) => {
  const hasMultiple = images.length > 1;

  const go = React.useCallback(
    (delta: number) => {
      onIndexChange((index + delta + images.length) % images.length);
    },
    [index, images.length, onIndexChange],
  );

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (!hasMultiple) return;

      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, hasMultiple, onClose]);

  // Bloquea el scroll del fondo mientras el modal esta abierto.
  React.useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;

    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, []);

  const current = images[index];
  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Vista ampliada de ${current.alt}`}
    >
      <button
        type="button"
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25"
        onClick={onClose}
        aria-label="Cerrar imagen"
      >
        <X className="size-6" />
      </button>

      {hasMultiple && (
        <>
          <LightboxArrow side="left" onClick={() => go(-1)} />
          <LightboxArrow side="right" onClick={() => go(1)} />
        </>
      )}

      <div
        className="relative max-h-[85vh] max-w-[85vw] overflow-hidden rounded-2xl shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt}
          className="max-h-[85vh] max-w-[85vw] object-contain"
        />
      </div>

      {hasMultiple && (
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {index + 1} / {images.length}
        </span>
      )}
    </div>
  );
};

const LightboxArrow = ({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 ${
      side === "left" ? "left-4" : "right-4"
    }`}
    aria-label={side === "left" ? "Imagen anterior" : "Imagen siguiente"}
  >
    {side === "left" ? (
      <ChevronLeft className="size-6" />
    ) : (
      <ChevronRight className="size-6" />
    )}
  </button>
);

export default ImageLightbox;
