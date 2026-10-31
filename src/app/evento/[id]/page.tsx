"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Check, Calendar, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import { events } from "@/lib/mockdata";
import { useApp } from "@/lib/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Componente visual para mostrar que o campo é imutável
function LockedInput({ id, value }: { id: string; value: string }) {
  return (
    <div className="relative">
      <Input id={id} value={value} disabled readOnly className="bg-muted pr-10" />
      <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export default function EventDetails() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const { user, addTicket, hasTicket, openAuthModal } = useApp();

  const event = events.find((e) => e.id === eventId);

  if (!event) {
    notFound();
  }

  const reserved = hasTicket(event.id);
  const [booking, setBooking] = useState(false);

  const submit = () => {
    if (!user) {
      openAuthModal("prompt");
      return;
    }

    addTicket({
      eventId: event.id,
      eventTitle: event.title,
      participant: user.name, // Puxa direto da store, sem chance de edição
      date: event.date,
      time: event.time,
      cpf: user.cpf, 
    });

    setBooking(false);
    toast.success("Inscrição realizada com sucesso!", {
      action: { label: "Ver ingresso", onClick: () => router.push("/ingressos") },
    });
  };

  return (
    <div className="flex w-full justify-center">
      <section className="w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <h3 className="text-lg font-regular text-primary">{event.title}</h3>
          <span className="text-muted-foreground">›</span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4 text-accent" />
            <span>{event.local}</span>
            <span className="mx-1">/</span>
            <Calendar className="size-4 text-accent" />
            <span>
              {event.date}, {event.time}
            </span>
          </span>
        </nav>

        {/* NOVO LAYOUT: Usando flex-col para mobile e grid para desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
          
          {/* 1. Imagem do Evento (Primeiro no mobile, ocupa 2 colunas no desktop) */}
          <div className="order-1 lg:col-span-2">
            <div
              className="aspect-[16/10] w-full rounded-2xl border border-border shadow-md"
              style={{ 
                background: event.image ? `url(${event.image}) center/cover` : "linear-gradient(135deg, #003366, #1E293B)" 
              }}
              role="img"
              aria-label={event.title}
            />
          </div>

          {/* 2. Coluna da Direita: Caixa de Inscrição (Segundo no mobile, lado direito no desktop) */}
          <aside className="order-2 lg:col-span-1 lg:row-span-2">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Inscrição gratuita
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">Garanta sua vaga</p>

              <div className="mt-5">
                {event.soldOut ? (
                  <Button disabled className="w-full" size="lg">
                    Ingressos Esgotados
                  </Button>
                ) : reserved ? (
                  <Button
                    disabled
                    className="w-full bg-success text-success-foreground hover:bg-success disabled:opacity-100"
                    size="lg"
                  >
                    <Check className="mr-2 size-5" /> Vaga Garantida
                  </Button>
                ) : booking ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submit();
                    }}
                    className="space-y-4"
                  >
                    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
                      <p className="text-xs text-muted-foreground text-center mb-2">
                        Confirme seus dados para emissão do certificado.
                      </p>
                      <div className="space-y-1.5">
                        <Label htmlFor="b-name">Nome Completo</Label>
                        <LockedInput id="b-name" value={user?.name || ""} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="b-mat">Matrícula</Label>
                        <LockedInput id="b-mat" value={user?.matricula || "Não possui"} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="b-cpf">CPF</Label>
                        <LockedInput id="b-cpf" value={user?.cpf || ""} />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setBooking(false)}
                      >
                        Voltar
                      </Button>
                      <Button type="submit" className="flex-1">
                        Confirmar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Button
                    className="w-full transition-transform hover:scale-105"
                    size="lg"
                    onClick={() => {
                      if (!user) {
                        openAuthModal("prompt");
                        return;
                      }
                      setBooking(true);
                    }}
                  >
                    Inscrever-se
                  </Button>
                )}
              </div>

              <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>{event.local}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>
                    {event.date} • {event.time}
                  </span>
                </li>
              </ul>
            </div>
          </aside>

          {/* 3. Descrição do Evento (Terceiro no mobile, logo abaixo da imagem no desktop) */}
          <div className="order-3 lg:col-span-2">
            <h2 className="text-xl font-bold text-primary">Descrição do evento</h2>
            <p className="mt-4 leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}