"use client";

import * as React from "react";
import { CircleCheck, CircleAlert, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const CONTACT_EMAIL = "hola@entretazas.com";

/** Clases del <textarea>, que no tiene equivalente en components/ui. */
const textareaClass =
  "w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive md:text-sm dark:bg-input/30";

/**
 * No hay endpoint de contacto en el backend, asi que el formulario arma un
 * `mailto:` y deja al usuario abrir su propio cliente de correo. Es honesto
 * sobre el limite: mostrar "Mensaje enviado" sin nada detras seria mentir.
 * Cuando exista el endpoint, se cambia `handleSubmit` por el POST y el resto
 * de la UI ya sirve.
 */
const ContactView = () => {
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [sent, setSent] = React.useState(false);

  const update =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = `Consulta desde la web — ${form.name}`;
    const body = `${form.message}\n\n—\n${form.name} (${form.email})`;
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setSent(true);
  };

  const message = form.message.trim();
  const canSubmit =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    message.length > 0;

  return (
    <main className="container-page flex-1 py-12">
      <header className="mx-auto mb-10 flex max-w-xl flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Contactanos</h1>
        <p className="text-muted-foreground">
          ¿Buscás un café para tu método o querés saber algo de un pedido?
          Escribinos y te respondemos.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-xl flex-col gap-5 rounded-xl border border-border p-6"
      >
        <Field>
          <FieldLabel htmlFor="name">Nombre</FieldLabel>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            value={form.name}
            onChange={update("name")}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={update("email")}
          />
          <FieldDescription>Te respondemos a esta dirección.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="message">Mensaje</FieldLabel>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={form.message}
            onChange={update("message")}
            className={textareaClass}
          />
        </Field>

        {sent && (
          <p role="status" className="flex items-start gap-2 text-sm">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-amber-600" />
            Abrimos tu cliente de correo con el mensaje listo. Si no se abrió,
            escribinos a {CONTACT_EMAIL}.
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          className="bg-amber-600 text-white hover:bg-amber-500"
        >
          <Send />
          Enviar mensaje
        </Button>

        <p className="text-xs text-muted-foreground">
          <CircleAlert className="mr-1 inline size-3" />
          Todavía no hay envío automático: el mensaje se abre en tu programa de
          correo.
        </p>
      </form>
    </main>
  );
};

export default ContactView;
