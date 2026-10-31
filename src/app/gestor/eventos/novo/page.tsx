"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { EventForm } from "@/components/eventform";
import { useApp } from "@/lib/app-store";
import { toast } from "sonner";

function NovoEventoContent() {
    const { user, managedEvents, createEvent, updateEvent } = useApp();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Lê da URL se estamos a tentar editar um evento (ex: ?edit=123)
    const editId = searchParams.get("edit");
    const editing = editId ? managedEvents.find((e) => e.id === editId) : undefined;

    useEffect(() => {
        if (user && user.role !== "GESTOR") {
            toast.error("Acesso restrito a gestores");
            router.push("/");
        }
    }, [user, router]);

    if (!user || user.role !== "GESTOR") return null;

    return (
        <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
            <Link
                href="/gestor/eventos"
                className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline transition-colors"
            >
                <ChevronLeft className="size-4" /> Voltar aos Meus Eventos
            </Link>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-primary">
                    {editing ? "Editar Evento" : "Criar Novo Evento"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Preencha os dados abaixo. Todos os campos são obrigatórios.
                </p>
            </header>

            {/* O componente EventForm já cuida de renderizar os inputs */}
            <EventForm
                initial={editing}
                submitLabel={editing ? "Salvar alterações" : "Criar evento"}
                onSubmit={(v) => {
                    if (editing) {
                        updateEvent(editing.id, v);
                        toast.success("Evento atualizado com sucesso!");
                    } else {
                        createEvent(v);
                        toast.success("Evento criado com sucesso!");
                    }
                    router.push("/gestor/eventos");
                }}
            />
        </section>
    );
}

export default function NovoEventoPage() {
    return (
        <div className="flex w-full justify-center">
            <Suspense fallback={<div className="p-10 text-center text-muted-foreground">Carregando formulário...</div>}>
                <NovoEventoContent />
            </Suspense>
        </div>
    );
}