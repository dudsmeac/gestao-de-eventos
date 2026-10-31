"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
    ChevronLeft,
    MapPin,
    Pencil,
    Trash2,
    QrCode,
    CheckCircle2,
    Circle,
    Camera,
    FileText,
    Upload,
    Plus,
    Move,
} from "lucide-react";
import { useApp } from "@/lib/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatCpf(digits: string) {
    const d = digits.replace(/\D/g, "").slice(0, 11);
    const p1 = d.slice(0, 3);
    const p2 = d.slice(3, 6);
    const p3 = d.slice(6, 9);
    const p4 = d.slice(9, 11);
    let out = p1;
    if (p2) out += "." + p2;
    if (p3) out += "." + p3;
    if (p4) out += "-" + p4;
    return out;
}

export default function DashboardEventoPage() {
    const params = useParams();
    const eventId = params.id as string;
    const router = useRouter();

    const { user, managedEvents, deleteEvent, toggleCheckin, checkinByIdentifier } = useApp();
    const ev = managedEvents.find((e) => e.id === eventId);

    const [qrOpen, setQrOpen] = useState(false);
    const [manual, setManual] = useState("");

    // Estados do Certificado
    const [fontColor, setFontColor] = useState("#003366");
    const [fontSize, setFontSize] = useState(24);
    const [template, setTemplate] = useState<"padrão" | "arquivo">("padrão");
    const [customBg, setCustomBg] = useState<string | null>(null);

    // Estados e Ref para o Drag and Drop (Arrastar texto)
    const previewRef = useRef<HTMLDivElement>(null);
    const [textPos, setTextPos] = useState({ x: 50, y: 50 }); // Começa centralizado (50% 50%)
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (user && user.role !== "GESTOR") {
            toast.error("Acesso restrito a gestores");
            router.push("/");
        }
    }, [user, router]);

    if (!user || user.role !== "GESTOR") return null;

    if (!ev) {
        return (
            <div className="flex w-full justify-center">
                <section className="w-full max-w-3xl px-4 py-10 text-center sm:px-6">
                    <h1 className="text-2xl font-bold text-primary">Evento não encontrado</h1>
                    <Button asChild className="mt-4">
                        <Link href="/gestor/eventos">Voltar</Link>
                    </Button>
                </section>
            </div>
        );
    }

    const presentes = ev.inscritos.filter((i) => i.checkedIn).length;

    const doManual = () => {
        if (!manual.trim()) return;
        const r = checkinByIdentifier(ev.id, manual);
        if (r.ok) {
            toast.success(`Check-in realizado para: ${r.name}`);
            setManual("");
        } else {
            toast.error("Inscrito não encontrado ou dados incorretos.");
        }
    };

    const simulateQr = () => {
        const next = ev.inscritos.find((i) => !i.checkedIn);
        if (!next) {
            toast.info("Todos os inscritos já fizeram check-in");
            return;
        }
        toggleCheckin(ev.id, next.cpf);
        toast.success(`Check-in simulado para: ${next.name}`);
    };

    // Funções de Arrastar e Soltar o Texto no Certificado
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !previewRef.current) return;

        // Impede a tela do celular de rolar enquanto arrasta
        if (e.cancelable) e.preventDefault();

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const rect = previewRef.current.getBoundingClientRect();

        // Calcula a posição em porcentagem relativa ao contêiner da imagem
        let x = ((clientX - rect.left) / rect.width) * 100;
        let y = ((clientY - rect.top) / rect.height) * 100;

        // Trava para não deixar arrastar para fora da área visível (limite de 5% a 95%)
        x = Math.max(5, Math.min(95, x));
        y = Math.max(5, Math.min(95, y));

        setTextPos({ x, y });
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    return (
        <div className="flex w-full justify-center">
            <section className="w-full max-w-5xl px-4 py-10 sm:px-6">
                <Link
                    href="/gestor/eventos"
                    className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                    <ChevronLeft className="size-4" /> Voltar aos Meus Eventos
                </Link>

                <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-tight text-primary">{ev.title}</h1>
                        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="size-4 text-accent" />
                            <span>
                                {ev.local} / {ev.dateStart} às {ev.timeStart}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label="Editar evento"
                            onClick={() => router.push(`/gestor/eventos/novo?edit=${ev.id}`)}
                        >
                            <Pencil className="size-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Excluir evento"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Deseja excluir seu evento?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação é irreversível. Todos os dados, inscritos e histórico serão apagados permanentemente.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        onClick={() => {
                                            deleteEvent(ev.id);
                                            toast.success("Evento excluído com sucesso!");
                                            router.push("/gestor/eventos");
                                        }}
                                    >
                                        Sim, Excluir
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </header>

                <Tabs defaultValue="validação" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
                        <TabsTrigger value="validação">Validação</TabsTrigger>
                        <TabsTrigger value="inscritos">
                            Inscritos ({presentes}/{ev.inscritos.length})
                        </TabsTrigger>
                        <TabsTrigger value="certificados">Certificados</TabsTrigger>
                    </TabsList>

                    <TabsContent value="validação" className="mt-6">
                        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <h2 className="mb-3 text-lg font-bold text-primary">Leitura por QR Code</h2>
                                <p className="text-sm text-muted-foreground">
                                    Aponte a câmera para o QR Code do participante.
                                </p>
                                <Button className="mt-4 w-full" onClick={() => setQrOpen(true)}>
                                    <QrCode className="mr-2 size-4" /> Ler QR Code
                                </Button>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <h2 className="mb-3 text-lg font-bold text-primary">Entrada manual</h2>
                                <Label htmlFor="manual">CPF</Label>
                                <div className="mt-2 flex flex-col sm:flex-row gap-2">
                                    <Input
                                        id="manual"
                                        inputMode="numeric"
                                        placeholder="000.000.000-00"
                                        value={manual}
                                        onChange={(e) => {
                                            const v = e.target.value.replace(/\D/g, "");
                                            setManual(v.length <= 11 ? formatCpf(v) : v);
                                        }}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), doManual())}
                                    />
                                    <Button type="button" onClick={doManual}>
                                        Inserir
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="inscritos" className="mt-6">
                        <div className="rounded-2xl border border-border bg-card p-2 shadow-sm">
                            <ul className="divide-y divide-border">
                                {ev.inscritos.length === 0 && (
                                    <li className="p-6 text-center text-sm text-muted-foreground">
                                        Nenhum inscrito até o momento.
                                    </li>
                                )}
                                {ev.inscritos.map((i) => (
                                    <li key={i.cpf} className="flex items-center justify-between gap-3 px-4 py-3">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{i.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                CPF {formatCpf(i.cpf)} · Matrícula {i.matricula}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleCheckin(ev.id, i.cpf)}
                                            aria-label={i.checkedIn ? "Desfazer check-in" : "Fazer check-in"}
                                            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring transition-transform hover:scale-110"
                                        >
                                            {i.checkedIn ? (
                                                <CheckCircle2 className="size-6 text-emerald-600" />
                                            ) : (
                                                <Circle className="size-6 text-muted-foreground" />
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </TabsContent>

                    <TabsContent value="certificados" className="mt-6">
                        <div className="mx-auto grid max-w-4xl gap-4 lg:grid-cols-[320px_1fr]">

                            <div className="h-fit space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <div>
                                    <h2 className="text-base font-semibold text-primary">Modelo do certificado</h2>
                                    <div className="mt-2.5 flex flex-wrap gap-2">
                                        <Button
                                            size="sm"
                                            variant={template === "padrão" ? "default" : "outline"}
                                            className="text-xs h-8"
                                            onClick={() => setTemplate("padrão")}
                                        >
                                            <FileText className="mr-1.5 size-3.5" /> Usar padrão
                                        </Button>

                                        <div className="relative inline-block">
                                            <input
                                                type="file"
                                                id="cert-upload"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        const fileUrl = URL.createObjectURL(e.target.files[0]);
                                                        setCustomBg(fileUrl);
                                                        setTemplate("arquivo");
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor="cert-upload"
                                                className={cn(
                                                    "inline-flex h-8 cursor-pointer items-center justify-center rounded-md px-3 text-xs font-medium transition-colors border border-dashed",
                                                    template === "arquivo"
                                                        ? "bg-primary text-primary-foreground border-transparent shadow-sm"
                                                        : "border-muted-foreground/30 bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                )}
                                            >
                                                <Upload className="mr-1.5 size-3.5" /> Carregar arquivo...
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 pt-4 border-t border-border/50">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-medium text-foreground/90">
                                            Cor do nome
                                        </label>
                                        <div className="flex items-center gap-1.5">
                                            {["#003366", "#1E293B", "#991B1B", "#000000"].map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setFontColor(color)}
                                                    className={cn(
                                                        "size-5 rounded-full border shadow-sm transition-transform hover:scale-110",
                                                        fontColor === color ? "ring-2 ring-primary ring-offset-1 border-transparent" : "border-border"
                                                    )}
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}

                                            <div className="h-4 w-[1px] bg-border mx-0.5" />

                                            <div
                                                className="relative flex size-5 cursor-pointer items-center justify-center rounded-full border border-dashed border-muted-foreground/50 bg-muted/30 transition-transform hover:scale-110"
                                                title="Cor personalizada"
                                            >
                                                <Plus className="size-3 text-muted-foreground" />
                                                <input
                                                    type="color"
                                                    value={fontColor}
                                                    onChange={(e) => setFontColor(e.target.value)}
                                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-medium text-foreground/90">
                                            Tamanho do texto
                                        </label>
                                        <Select value={fontSize.toString()} onValueChange={(v) => setFontSize(Number(v))}>
                                            <SelectTrigger className="h-8 w-24 rounded-md border-border/70 bg-background px-2 py-1 text-xs shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors focus:ring-1 focus:ring-primary focus:ring-offset-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border/70 shadow-lg">
                                                {[16, 18, 24, 32, 40, 48, 56, 64, 72].map((s) => (
                                                    <SelectItem key={s} value={s.toString()} className="text-xs rounded-lg cursor-pointer">
                                                        {s} px
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Button
                                    className="w-full font-semibold text-xs h-9 mt-2"
                                    disabled={presentes === 0}
                                    onClick={() =>
                                        toast.success(`Certificados emitidos e enviados para ${presentes} presentes!`)
                                    }
                                >
                                    Enviar {presentes} certificados
                                </Button>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <h2 className="mb-2.5 flex items-center justify-between text-sm font-semibold text-primary">
                                    Prévia do documento
                                    <span className="text-[10px] font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                        Arraste a variável para posicionar
                                    </span>
                                </h2>

                                {/* CONTÊINER DA PRÉVIA (Recebe os movimentos do mouse) */}
                                <div
                                    ref={previewRef}
                                    onMouseMove={handleDragMove}
                                    onMouseUp={handleDragEnd}
                                    onMouseLeave={handleDragEnd}
                                    onTouchMove={handleDragMove}
                                    onTouchEnd={handleDragEnd}
                                    onTouchCancel={handleDragEnd}
                                    className="relative min-h-[350px] w-full rounded-xl border border-border bg-muted/10 overflow-hidden bg-cover bg-center select-none shadow-inner"
                                    style={{
                                        backgroundImage: template === "arquivo" && customBg ? `url(${customBg})` : undefined,
                                    }}
                                >
                                    {template === "arquivo" && customBg && (
                                        <div className="absolute inset-0 bg-white/40 dark:bg-black/50 pointer-events-none" />
                                    )}

                                    {/* INFORMAÇÕES ESTÁTICAS FIXAS (Apenas no modelo Padrão) */}
                                    {template === "padrão" && (
                                        <div className="absolute inset-0 flex flex-col justify-between p-12 pointer-events-none z-0">
                                            <p className="text-center text-xs uppercase tracking-[0.2em] text-foreground/60 font-medium">
                                                Certificado de Participação
                                            </p>
                                            <div className="text-center">
                                                <p className="text-sm text-foreground/80 font-semibold">{ev.title}</p>
                                                <p className="text-xs text-foreground/50 mt-1">{ev.dateStart}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* BLOCO DE TEXTO ARRASTÁVEL (Apenas a Variável do Nome) */}
                                    <div
                                        onMouseDown={handleDragStart}
                                        onTouchStart={handleDragStart}
                                        className={cn(
                                            "absolute z-10 group cursor-grab active:cursor-grabbing px-4 py-2 rounded-lg border-2 border-transparent transition-colors text-center whitespace-nowrap",
                                            isDragging ? "border-primary/50 bg-background/50 backdrop-blur-sm shadow-md" : "hover:border-primary/30 hover:bg-background/30 hover:backdrop-blur-sm"
                                        )}
                                        style={{
                                            left: `${textPos.x}%`,
                                            top: `${textPos.y}%`,
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    >
                                        <div className="absolute -top-3 -left-3 size-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none">
                                            <Move className="size-3" />
                                        </div>

                                        <p
                                            className="font-bold tracking-tight pointer-events-none"
                                            style={{
                                                color: fontColor,
                                                fontSize: `${fontSize}px`,
                                                lineHeight: 1.1,
                                            }}
                                        >
                                            [ Nome do Participante ]
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </TabsContent>
                </Tabs>

                <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-primary">Leitor de QR Code</DialogTitle>
                            <DialogDescription>Simulação para teste do sistema — nenhuma câmera é acessada.</DialogDescription>
                        </DialogHeader>
                        <div className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-slate-900/90 text-white">
                            <Camera className="size-16 opacity-70" />
                            <div className="pointer-events-none absolute inset-8 rounded-lg border-2 border-accent/70" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/10 to-transparent animate-pulse" />
                            <p className="absolute bottom-3 text-xs font-medium text-white/80">Simulando leitura...</p>
                        </div>
                        <Button
                            onClick={() => {
                                simulateQr();
                                setQrOpen(false);
                            }}
                        >
                            Simular check-in aleatório
                        </Button>
                    </DialogContent>
                </Dialog>
            </section>
        </div>
    );
}