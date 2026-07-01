"use client";

import { useState } from "react";
import Link from "next/link";
import { QrCode, Calendar, Clock, User as UserIcon } from "lucide-react";
import { useApp, type Ticket } from "@/lib/app-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export default function IngressosPage() {
    const { tickets, removeTicket, user } = useApp();
    const [qrOpen, setQrOpen] = useState<Ticket | null>(null);
    const [confirmId, setConfirmId] = useState<string | null>(null);

    // Função rápida para formatar o CPF visualmente (000.000.000-00)
    const formatCpf = (cpf?: string) => {
        if (!cpf) return "CPF não informado";
        const clean = cpf.replace(/\D/g, "");
        if (clean.length === 11) {
            return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        }
        return cpf;
    };

    return (
        <div className="flex w-full justify-center">
            <section className="w-full max-w-5xl px-4 py-10 sm:px-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-primary">Ingressos Disponíveis</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Apresente o QR Code na entrada de cada evento.
                    </p>
                </header>

                {tickets.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
                        <p className="text-muted-foreground">Você ainda não tem ingressos.</p>
                        <Button asChild className="mt-5">
                            <Link href="/">Explorar eventos</Link>
                        </Button>
                    </div>
                ) : (
                    <ul className="space-y-6">
                        {tickets.map((t) => {
                            // Ajuste de tipagem seguro
                            const ticketCpf = 'cpf' in t ? (t as { cpf?: string }).cpf : undefined;

                            return (
                                <li
                                    key={t.id}
                                    className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:p-8"
                                >
                                    {/* Caixinha vertical para agrupar QR Code e CPF */}
                                    <div className="flex shrink-0 flex-col items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setQrOpen(t)}
                                            aria-label="Ampliar QR Code"
                                            className="grid size-32 shrink-0 place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/30 transition hover:border-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            <QrCode className="size-16 text-primary" />
                                        </button>
                                        {/* Texto do CPF logo abaixo */}
                                        <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                            {formatCpf(ticketCpf || user?.cpf)}
                                        </span>
                                    </div>

                                    <div className="flex flex-1 flex-col">
                                        <h2 className="text-xl font-bold text-primary">{t.eventTitle}</h2>
                                        <div className="mt-4 grid grid-cols-1 gap-y-3 gap-x-4 text-sm text-muted-foreground sm:grid-cols-2">
                                            <span className="inline-flex items-center gap-2">
                                                <UserIcon className="size-4 text-primary" /> {t.participant}
                                            </span>
                                            <span className="inline-flex items-center gap-2">
                                                <Calendar className="size-4 text-primary" /> {t.date}
                                            </span>
                                            <span className="inline-flex items-center gap-2">
                                                <Clock className="size-4 text-primary" /> {t.time}
                                            </span>
                                        </div>

                                        <div className="mt-6 flex flex-1 items-end justify-end">
                                            <button
                                                type="button"
                                                className="text-sm font-medium text-destructive transition-colors hover:text-destructive/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive rounded-sm px-1"
                                                onClick={() => setConfirmId(t.id)}
                                            >
                                                Cancelar Inscrição
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* Modal de Ampliar QR Code */}
                <Dialog open={qrOpen !== null} onOpenChange={(o) => !o && setQrOpen(null)}>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-primary">{qrOpen?.eventTitle}</DialogTitle>
                        </DialogHeader>
                        <div className="mx-auto grid aspect-square w-full max-w-xs place-items-center rounded-xl border-2 border-dashed border-border bg-muted/40 p-4">
                            <QrCode className="size-full text-primary" />
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                            Apresente este código na entrada do evento.
                        </p>
                    </DialogContent>
                </Dialog>

                {/* Modal de Confirmação de Cancelamento */}
                <AlertDialog open={confirmId !== null} onOpenChange={(o) => !o && setConfirmId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Deseja cancelar sua inscrição?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Sua vaga ficará disponível para outros participantes.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Não, manter vaga</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => {
                                    if (confirmId) {
                                        removeTicket(confirmId);
                                        toast.success("Inscrição cancelada com sucesso!");
                                    }
                                    setConfirmId(null);
                                }}
                            >
                                Sim, cancelar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </section>
        </div>
    );
}