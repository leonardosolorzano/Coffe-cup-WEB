"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { NewCartItem } from "@/types/cart";

/**
 * Favoritos.
 *
 * Antes el navbar mandaba a `/loved-products`, que no existia, y no habia
 * ningun store que guardara nada. Ahora la lista vive en localStorage con el
 * mismo patron que el carrito.
 *
 * Se guardan snapshots igual que en el carrito: la pagina de favoritos tiene
 * que poder pintar algo aunque el backend este caido o el producto ya no
 * exista.
 */
export type FavoriteItem = NewCartItem;

type FavoritesState = {
  items: FavoriteItem[];
  /** `false` hasta que `persist` rehidrata. Evita hydration mismatch. */
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  addItem: (item: FavoriteItem) => void;
  removeItem: (productId: number) => void;
  toggleItem: (item: FavoriteItem) => void;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),

      addItem: (item) =>
        set((state) => {
          if (state.items.some((line) => line.productId === item.productId)) {
            return state;
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((line) => line.productId !== productId),
        })),

      toggleItem: (item) =>
        set((state) =>
          state.items.some((line) => line.productId === item.productId)
            ? {
                items: state.items.filter(
                  (line) => line.productId !== item.productId,
                ),
              }
            : { items: [...state.items, item] },
        ),

      clear: () => set({ items: [] }),
    }),
    {
      name: "entretazas-favorites",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      // Mismo detalle que en el carrito: el callback corre antes de que
      // `useFavoritesStore` exista como binding, asi que se usa el `state`
      // que recibe en vez de llamar al hook.
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export const selectIsFavorite =
  (productId: number) => (state: FavoritesState) =>
    state.items.some((line) => line.productId === productId);

export const selectFavoritesCount = (state: FavoritesState) =>
  state.items.length;
