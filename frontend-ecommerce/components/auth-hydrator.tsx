"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

/**
 * Lee la sesion guardada una sola vez al montar la app.
 *
 * Va en el layout, antes del Navbar, para que /account vea la sesion ya
 * cargada: si cada pagina llamara a `hydrate()` por su cuenta, /account
 * podia pintar el formulario de login y saltar al panel un instante despues.
 * El flag `hydrated` del store evita el hydration mismatch.
 */
const AuthHydrator = () => {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return null;
};

export default AuthHydrator;
