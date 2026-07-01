"use client";

import { useRef, useState, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ManagedEvent } from "@/lib/app-store";

export type EventFormValues = Omit<ManagedEvent, "id" | "inscritos">;

type Props = {
    initial?: Partial<EventFormValues>;
    submitLabel: string;
    onSubmit: (v: EventFormValues) => void;
};

export function EventForm({ initial, submitLabel, onSubmit }: Props) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [dateStart, setDateStart] = useState(initial?.dateStart ?? "");
    const [dateEnd, setDateEnd] = useState(initial?.dateEnd ?? "");
    const [timeStart, setTimeStart] = useState(initial?.timeStart ?? "");
    const [timeEnd, setTimeEnd] = useState(initial?.timeEnd ?? "");
    const [local, setLocal] = useState(initial?.local ?? "");
    const [vagas, setVagas] = useState<string>(initial?.vagas ? String(initial.vagas) : "");
    const [professor, setProfessor] = useState(initial?.professor ?? "");
    const [assunto, setAssunto] = useState(initial?.assunto ?? "");
    const [image, setImage] = useState<string | undefined>(initial?.image);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (dateEnd && dateStart && dateEnd < dateStart) {
            setError("A data final deve ser igual ou posterior à data inicial.");
            return;
        }
        const vagasNum = parseInt(vagas || "0", 10);
        if (!vagasNum || vagasNum <= 0) {
            setError("Informe um número válido de vagas.");
            return;
        }
        setError(null);
        onSubmit({
            title,
            description,
            dateStart,
            dateEnd,
            timeStart,
            timeEnd,
            local,
            vagas: vagasNum,
            professor,
            assunto,
            image,
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="ev-title">Nome do Evento</Label>
                    <Input id="ev-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="ev-desc">Descrição</Label>
                    <Textarea
                        id="ev-desc"
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="ev-ds">Data Início</Label>
                    <Input id="ev-ds" type="date" required value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="ev-de">Data Fim</Label>
                    <Input id="ev-de" type="date" required value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="ev-ts">Horário Início</Label>
                    <Input id="ev-ts" type="time" required value={timeStart} onChange={(e) => setTimeStart(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="ev-te">Horário Fim</Label>
                    <Input id="ev-te" type="time" required value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="ev-local">Local</Label>
                    <Input id="ev-local" required value={local} onChange={(e) => setLocal(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="ev-vagas">Total de vagas</Label>
                    <Input
                        id="ev-vagas"
                        inputMode="numeric"
                        required
                        value={vagas}
                        onChange={(e) => setVagas(e.target.value.replace(/\D/g, ""))}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="ev-prof">Professor Responsável</Label>
                    <Input id="ev-prof" required value={professor} onChange={(e) => setProfessor(e.target.value)} />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="ev-ass">Assunto</Label>
                    <Input id="ev-ass" required value={assunto} onChange={(e) => setAssunto(e.target.value)} />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                    <Label>Imagem do evento (Opcional)</Label>
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileRef.current?.click()}
                        >
                            <ImagePlus className="mr-2 size-4" /> Escolher Imagem
                        </Button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) setImage(URL.createObjectURL(f));
                                // Reseta o input file para permitir selecionar o mesmo arquivo após remover
                                if (fileRef.current) fileRef.current.value = "";
                            }}
                        />

                        {image && (
                            <div className="relative group">
                                <div
                                    className="h-16 w-28 rounded-md border border-border bg-muted bg-cover bg-center shadow-sm"
                                    style={{ backgroundImage: `url(${image})` }}
                                    aria-label="Prévia da imagem"
                                />
                                <button
                                    type="button"
                                    onClick={() => setImage(undefined)}
                                    className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/90 shadow-md"
                                    aria-label="Remover imagem"
                                >
                                    <X className="size-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-destructive/15 p-3">
                    <p className="text-sm font-medium text-destructive" role="alert">
                        {error}
                    </p>
                </div>
            )}

            <div className="flex justify-end pt-4 border-t border-border mt-6">
                <Button type="submit" size="lg" className="px-8">
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}