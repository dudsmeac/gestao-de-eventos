"use client";

import { Award, Download, Calendar, Clock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockCertificates } from "@/lib/mockdata";
import { useApp } from "@/lib/app-store";
import { toast } from "sonner";

export default function CertificadosPage() {
    const { user } = useApp();
    // Se não houver usuário, garantimos que o código não quebre
    const certs = mockCertificates.map((c) => ({
        ...c,
        participant: user?.name ?? c.participant
    }));

    return (
        <div className="flex w-full justify-center">
            <section className="w-full max-w-5xl px-4 py-10 sm:px-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-primary">Certificados</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Baixe os certificados dos eventos em que você participou.
                    </p>
                </header>

                {certs.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                        <p className="text-muted-foreground">Nenhum certificado disponível no momento.</p>
                    </div>
                ) : (
                    <ul className="space-y-6">
                        {certs.map((c) => (
                            <li
                                key={c.id}
                                className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:p-8 sm:items-center"
                            >
                                {/* Ícone de Certificado */}
                                <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-primary/10">
                                    <Award className="size-10 text-primary" />
                                </div>

                                {/* Dados do Evento */}
                                <div className="flex flex-1 flex-col">
                                    <h2 className="text-xl font-bold text-primary">{c.eventTitle}</h2>

                                    <div className="mt-4 grid grid-cols-1 gap-y-3 gap-x-4 text-sm text-muted-foreground sm:grid-cols-3">
                                        <span className="inline-flex items-center gap-2">
                                            <UserIcon className="size-4 text-primary" /> {c.participant}
                                        </span>
                                        <span className="inline-flex items-center gap-2">
                                            <Calendar className="size-4 text-primary" /> {c.date}
                                        </span>
                                        <span className="inline-flex items-center gap-2">
                                            <Clock className="size-4 text-primary" /> {c.time}
                                        </span>
                                    </div>
                                </div>

                                {/* Botão de Download */}
                                <div className="flex shrink-0 items-center justify-end sm:mt-0 mt-4">
                                    <Button
                                        variant="outline"
                                        className="gap-2 border-primary text-primary hover:bg-primary/10"
                                        onClick={() => toast.success("Download iniciado: " + c.eventTitle)}
                                    >
                                        <Download className="size-4" /> Baixar PDF
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}