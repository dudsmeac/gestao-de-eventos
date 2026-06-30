"use client";

import { useRouter } from "next/navigation";
import { EventCoverflow } from "@/components/eventcoverflow";
import { events } from "@/lib/mockdata";
import { useApp } from "@/lib/app-store";

export default function Home() {
  const { user, openAuthModal } = useApp();
  const router = useRouter();

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-2 text-center">
        <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          SNCTZO 2026
        </span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Próximos Eventos
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Navegue pelos eventos e garanta sua participação.
        </p>
      </div>

      <EventCoverflow
        events={events}
        onSelect={(ev) => {
          // Se o usuário não estiver logado, abre o modal pedindo login
          if (!user) {
            openAuthModal("prompt");
            return;
          }
          // Se estiver logado, redireciona para a página do evento
          router.push(`/evento/${ev.id}`);
        }}
      />
    </section>
  );
}