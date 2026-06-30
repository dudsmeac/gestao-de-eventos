"use client";

import { useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/lib/app-store";

export function AuthModals() {
    const { authModal, openAuthModal, login, register } = useApp();
    const open = authModal !== null;

    const close = () => openAuthModal(null);

    return (
        <Dialog open={open} onOpenChange={(o) => !o && close()}>
            <DialogContent className="sm:max-w-md">
                {authModal === "prompt" && <PromptView />}
                {authModal === "login" && <LoginView onSubmit={login} onForgot={() => openAuthModal("forgot")} />}
                {authModal === "forgot" && <ForgotView onClose={close} />}
                {authModal === "register" && <RegisterView onSubmit={register} />}
            </DialogContent>
        </Dialog>
    );
}

function PromptView() {
    const { openAuthModal } = useApp();
    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-center text-xl text-primary">Faça login ou cadastre-se</DialogTitle>
                <DialogDescription className="text-center">
                    Faça login ou cadastre-se para mais informações.
                </DialogDescription>
            </DialogHeader>
            <div className="mt-2 grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => openAuthModal("login")}>
                    Login
                </Button>
                <Button onClick={() => openAuthModal("register")}>Cadastrar</Button>
            </div>
        </>
    );
}

function LoginView({ onSubmit, onForgot }: { onSubmit: (email: string) => void; onForgot: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <form
            onSubmit={(e: FormEvent) => {
                e.preventDefault();
                onSubmit(email);
            }}
        >
            <DialogHeader>
                <DialogTitle className="text-primary">Login</DialogTitle>
                <DialogDescription>Entre com seu email e senha.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3">
                <div className="space-y-1.5">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="login-pwd">Senha</Label>
                    <Input id="login-pwd" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button
                    type="button"
                    onClick={onForgot}
                    className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                >
                    Esqueci a senha
                </button>
            </div>
            <Button type="submit" className="mt-5 w-full">
                Continuar
            </Button>
        </form>
    );
}

function ForgotView({ onClose }: { onClose: () => void }) {
    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-primary">Recuperação de senha</DialogTitle>
                <DialogDescription>
                    Link de recuperação enviado para o email. Verifique sua caixa de entrada e a pasta de spam.
                </DialogDescription>
            </DialogHeader>
            <Button className="mt-4 w-full" onClick={onClose}>
                Continuar
            </Button>
        </>
    );
}

function RegisterView({
    onSubmit,
}: {
    onSubmit: (d: { name: string; email: string; matricula: string; cpf: string }) => void;
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [matricula, setMatricula] = useState("");
    const [noMat, setNoMat] = useState(false);
    const [cpf, setCpf] = useState("");
    const [pwd, setPwd] = useState("");

    const numeric = (v: string) => v.replace(/\D/g, "");

    return (
        <form
            onSubmit={(e: FormEvent) => {
                e.preventDefault();
                onSubmit({ name, email, matricula: noMat ? "" : matricula, cpf });
            }}
        >
            <DialogHeader>
                <DialogTitle className="text-primary">Criar conta</DialogTitle>
                <DialogDescription>Preencha seus dados para se cadastrar.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3">
                <div className="space-y-1.5">
                    <Label htmlFor="r-name">Nome Completo</Label>
                    <Input id="r-name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="r-email">Email</Label>
                    <Input id="r-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="r-mat">Matrícula</Label>
                    <Input
                        id="r-mat"
                        inputMode="numeric"
                        placeholder="Apenas números"
                        disabled={noMat}
                        value={matricula}
                        onChange={(e) => setMatricula(numeric(e.target.value))}
                    />
                    <label className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Checkbox checked={noMat} onCheckedChange={(v) => setNoMat(v === true)} />
                        Não possuo matrícula
                    </label>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="r-cpf">CPF</Label>
                    <Input
                        id="r-cpf"
                        inputMode="numeric"
                        placeholder="Apenas números"
                        required
                        value={cpf}
                        onChange={(e) => setCpf(numeric(e.target.value))}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="r-pwd">Senha</Label>
                    <Input id="r-pwd" type="password" required value={pwd} onChange={(e) => setPwd(e.target.value)} />
                </div>
            </div>
            <Button type="submit" className="mt-5 w-full">
                Criar conta
            </Button>
        </form>
    );
}