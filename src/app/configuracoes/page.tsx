"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, UserCircle, ShieldCheck, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useApp } from "@/lib/app-store";
import { toast } from "sonner";

// Componente para campos bloqueados com ícone de cadeado
function LockedInput({ id, value }: { id: string; value: string }) {
    return (
        <div className="relative">
            <Input id={id} value={value} disabled readOnly className="bg-muted pr-10" />
            <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    );
}

export default function ConfigPage() {
    const { user, updateUser } = useApp();
    const router = useRouter();
    const [name, setName] = useState(user?.name ?? "");
    const [password, setPassword] = useState("");

    if (!user) return <div className="p-10 text-center">Carregando...</div>;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ name });
        setPassword("");
        toast.success("Alterações salvas com sucesso!");
    };

    return (
        <div className="flex w-full justify-center">
            <section className="w-full max-w-3xl px-4 py-10 sm:px-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-primary">Configurações</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gerencie seus dados pessoais. Campos com cadeado são gerenciados pela secretaria.
                    </p>
                </header>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Dados Pessoais */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-primary">
                            <UserCircle className="size-5" /> Dados de Perfil
                        </h2>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="c-name">Nome Completo</Label>
                                <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="c-email">E-mail</Label>
                                <LockedInput id="c-email" value={user.email} />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="c-mat">Matrícula</Label>
                                    <LockedInput id="c-mat" value={user.matricula || "—"} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="c-cpf">CPF</Label>
                                    <LockedInput id="c-cpf" value={user.cpf} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Segurança */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-primary">
                            <ShieldCheck className="size-5" /> Segurança
                        </h2>

                        <div className="space-y-1.5">
                            <Label htmlFor="c-pwd">Alterar Senha</Label>
                            <Input
                                id="c-pwd"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" size="lg" className="px-10">
                            Salvar Alterações
                        </Button>
                    </div>
                </form>

                {/* Zona de Perigo (Adicionado do Lovable) */}
                <div className="mt-12 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <ShieldAlert className="mt-1 size-6 shrink-0 text-destructive" />
                        <div className="flex-1">
                            <p className="mt-1 text-sm text-muted-foreground">
                                Ao excluir sua conta você perderá acesso aos seus ingressos, histórico de inscrições
                                e certificados emitidos. Esta ação é irreversível.
                            </p>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="mt-5">
                                        Solicitar Exclusão da Conta
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-destructive">Excluir sua conta?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Todos os seus dados, ingressos e certificados serão removidos
                                            permanentemente. Esta ação não pode ser desfeita.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            onClick={() => {
                                                deleteAccount();
                                                toast.success("Conta excluída com sucesso.");
                                                router.push("/");
                                            }}
                                        >
                                            Sim, excluir definitivamente
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}