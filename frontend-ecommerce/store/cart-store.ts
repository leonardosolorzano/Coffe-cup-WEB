"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, NewCartItem } from "@/types/cart";

/** Tope por linea: evita que un click repetido deje cantidades absurdas. */
export const MAX_QUANTITY = 10;

const clampQuantity = (quantity: number) =>
  Math.min(MAX_QUANTITY, Math.max(1, Math.round(quantity)));

type CartState = {
  items: CartItem[];
  /**
   * `false` hasta que `persist` rehidrata desde localStorage. Sirve para no
   * renderizar un carrito vacio en el servidor y luego "llenarse" en el
   * cliente, que es el error clasico de hydration mismatch.
   */
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  addItem: (item: NewCartItem, quantity?: number) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (line) => line.productId === item.productId,
          );

          if (existing) {
            return {
              items: state.items.map((line) =>
                line.productId === item.productId
                  ? {
                      ...line,
                      quantity: clampQuantity(line.quantity + quantity),
                    }
                  : line,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { ...item, quantity: clampQuantity(quantity) },
            ],
          };
        }),

      increment: (productId) =>
        set((state) => ({
          items: state.items.map((line) =>
            line.productId === productId
              ? { ...line, quantity: clampQuantity(line.quantity + 1) }
              : line,
          ),
        })),

      decrement: (productId) =>
        set((state) => ({
          items: state.items.flatMap((line) => {
            if (line.productId !== productId) return [line];

            // Si la cantidad llega a 0 la linea desaparece del carrito.
            const quantity = line.quantity - 1;
            return quantity < 1 ? [] : [{ ...line, quantity }];
          }),
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((line) => line.productId !== productId),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "entretazas-cart",
      storage: createJSONStorage(() => localStorage),
      // Solo `items` se persiste: las acciones son funciones y `hydrated`
      // debe arrancar en false en cada montaje.
      partialize: (state) => ({ items: state.items }),
      // Ojo: el callback corre durante la creacion del store, asi que
      // `useCartStore` todavia esta en TDZ y llamarla tira ReferenceError
      // (que zustand se come en un catch silencioso). Hay que usar el `state`
      // que recibe el callback.
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/* ─── Selectores ────────────────────────────────────────────────────────────── */

export const selectTotalItems = (state: CartState) =>
  state.items.reduce((total, line) => total + line.quantity, 0);

export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((total, line) => total + line.price * line.quantity, 0);
