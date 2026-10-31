"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, MapPin, Users } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { toBackground } from "@/lib/background";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function GestorEventosPage() {
    const { user, managedEvents, deleteEvent } = useApp();
    const router = useRouter();
    const [confirmId, setConfirmId] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.role !== "GESTOR") {
            toast.error("Acesso restrito a gestores");
            router.push("/");
        }
    }, [user, router]);

    if (!user || user.role !== "GESTOR") return null;

    return (
        <div className="flex w-full justify-center">
            <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
                <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Meus Eventos</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Eventos que você organiza. Gerencie inscritos, check-ins e certificados.
                        </p>
                    </div>
                    <Button asChild size="lg">
                        <Link href="/gestor/eventos/novo">
                            <Plus className="mr-2 size-4" /> Criar novo evento
                        </Link>
                    </Button>
                </header>

                {managedEvents.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                        <p className="text-muted-foreground">Nenhum evento criado ainda.</p>
                        <Button asChild className="mt-4">
                            <Link href="/gestor/eventos/novo">Criar primeiro evento</Link>
                        </Button>
                    </div>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2">
                        {managedEvents.map((ev) => {
                            const presentes = ev.inscritos?.filter((i) => i.checkedIn).length || 0;
                            const totalInscritos = ev.inscritos?.length || 0;

                            return (
                                <li
                                    key={ev.id}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
                                >
                                    <button
                                        type="button"
                                        onClick={() => router.push(`/gestor/eventos/${ev.id}`)}
                                        className="flex-1 text-left transition-opacity hover:opacity-90"
                                    >
                                        <div
                                            className="h-32 w-full bg-cover bg-center"
                                            style={{
                                                background: toBackground(
                                                    ev.image,
                                                    "linear-gradient(135deg, oklch(0.31 0.09 255), oklch(0.45 0.12 260))"
                                                ),
                                            }}
                                            aria-hidden
                                        />
                                        <div className="p-5">
                                            <h2 className="text-lg font-bold text-primary">{ev.title}</h2>
                                            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <MapPin className="size-3.5 text-accent shrink-0" />
                                                <span className="truncate">
                                                    {ev.local} / {ev.dateStart}, {ev.timeStart}
                                                </span>
                                            </div>
                                            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80">
                                                <Users className="size-3.5 shrink-0" /> {totalInscritos}/{ev.vagas} inscritos
                                                <span className="text-muted-foreground">· {presentes} presentes</span>
                                            </div>
                                        </div>
                                    </button>

                                    <div className="flex items-center justify-end gap-1 border-t border-border bg-muted/30 px-3 py-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Editar evento"
                                            onClick={() => router.push(`/gestor/eventos/novo?edit=${ev.id}`)}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Excluir evento"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setConfirmId(ev.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <AlertDialog open={confirmId !== null} onOpenChange={(o) => !o && setConfirmId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Deseja excluir seu evento?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta ação é irreversível. Todos os dados de inscritos e check-ins deste evento serão
                                removidos.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => {
                                    if (confirmId) {
                                        deleteEvent(confirmId);
                                        toast.success("Evento excluído!");
                                    }
                                    setConfirmId(null);
                                }}
                            >
                                Excluir
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </section>
        </div>
    );
}