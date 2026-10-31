"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import type { EventItem } from "@/lib/mockdata";
import { cn } from "@/lib/utils";

type Props = {
    events: EventItem[];
    onSelect: (event: EventItem) => void;
};

export function EventCoverflow({ events, onSelect }: Props) {
    const [index, setIndex] = useState(0);

    // Estados para calcular o arrastar (swipe) no mobile
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const total = events.length;
    if (total === 0) return null;
    const center = events[index];

    const go = (d: number) => setIndex((i) => (i + d + total) % total);
    const sideOffset = 180 * 2;

    // Lógica do Swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50; // Distância mínima para considerar um swipe válido

        if (distance > minSwipeDistance) {
            go(1); // Arrastou para a esquerda (próximo)
        }
        if (distance < -minSwipeDistance) {
            go(-1); // Arrastou para a direita (anterior)
        }
    };

    return (
        <div
            className="w-full overflow-x-clip"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="relative mx-auto flex h-[360px] w-full max-w-4xl items-center justify-center overflow-visible sm:h-[420px]">
                {events.map((ev, i) => {
                    let offset = i - index;
                    if (offset > total / 2) offset -= total;
                    if (offset < -total / 2) offset += total;
                    const abs = Math.abs(offset);
                    if (abs > 2) return null;

                    const isCenter = offset === 0;
                    const translate = offset * 180;
                    const scale = isCenter ? 1 : abs === 1 ? 0.78 : 0.6;
                    const zIndex = 10 - abs;

                    return (
                        <button
                            key={ev.id}
                            type="button"
                            onClick={() => (isCenter ? onSelect(ev) : setIndex(i))}
                            aria-label={ev.title}
                            className={cn(
                                "absolute top-1/2 left-1/2 h-[240px] w-[290px] sm:h-[360px] sm:w-[640px] rounded-2xl border border-border shadow-xl transition-all duration-500 ease-out",
                                isCenter ? "cursor-pointer" : "cursor-pointer",
                            )}
                            style={{
                                transform: `translate(-50%, -50%) translateX(${translate}px) scale(${scale})`,
                                zIndex,
                                background: ev.image
                            }}
                        >
                            <div className="relative flex h-full w-full flex-col justify-end rounded-2xl bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 text-left">
                                {ev.soldOut && (
                                    <span className="absolute right-3 top-3 rounded-full bg-destructive px-2.5 py-0.5 text-xs font-semibold text-destructive-foreground text-white shadow">
                                        Ingressos Esgotados
                                    </span>
                                )}
                                <span className="inline-flex w-fit rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                                    Evento
                                </span>
                                <h3 className="mt-2 text-lg font-bold leading-tight text-white">{ev.title}</h3>
                            </div>
                        </button>
                    )
                })}

                {/* Adicionado 'hidden sm:grid' e mantida a sua matemática com 50vw */}
                <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Anterior"
                    className="hidden sm:grid absolute top-1/2 z-20 size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-foreground shadow-md transition hover:bg-muted"
                    style={{
                        left: `calc(50% - ${sideOffset + 180}px)`
                    }}
                >
                    <ChevronLeft className="size-5" />
                </button>
                <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Próximo"
                    className="hidden sm:grid absolute top-1/2 z-20 size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-foreground shadow-md transition hover:bg-muted"
                    style={{
                        right: `calc(50% - ${sideOffset + 180}px)`
                    }}
                >
                    <ChevronRight className="size-5" />
                </button>
            </div>

            <div className="mt-4 flex justify-center gap-2">
                {events.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        aria-label={`Ir para ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={cn(
                            "size-2 rounded-full transition-colors",
                            i === index
                                ? "bg-primary"
                                : "bg-border hover:bg-muted-foreground/40",
                        )}
                    />
                ))}
            </div>

            <div className="mx-auto mt-6 max-w-2xl text-center">
                <h2 className="text-2xl font-bold text-primary">{center.title}</h2>
                <div className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4 text-accent" />
                    <span> {center.local} </span>
                    <Calendar className="size-4 text-accent" />
                    <span> {center.date}, {center.time}</span>
                </div>
            </div>
        </div >
    );
}