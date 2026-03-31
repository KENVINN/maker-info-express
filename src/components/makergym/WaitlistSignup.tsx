import { useState } from "react";
import { Loader2, Mail, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

type Interest = "tester" | "launch" | "both";

const interestOptions: Array<{
  value: Interest;
  label: string;
  description: string;
}> = [
  {
    value: "both",
    label: "Tester + lancamento",
    description: "Quero testar antes e tambem ser avisado quando abrir geral.",
  },
  {
    value: "tester",
    label: "Quero testar cedo",
    description: "Tenho interesse em acesso antecipado e feedback.",
  },
  {
    value: "launch",
    label: "So no lancamento",
    description: "Quero entrar na lista para ser avisado quando sair.",
  },
];

interface WaitlistSignupProps {
  source?: string;
  compact?: boolean;
}

export default function WaitlistSignup({
  source = "makergym-landing",
  compact = false,
}: WaitlistSignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<Interest>("both");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail) {
      toast({
        title: "Falta seu e-mail",
        description: "Coloque um e-mail valido para entrar na lista do Maker Gym.",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      email: trimmedEmail,
      name: trimmedName || null,
      wants_tester_access: interest === "tester" || interest === "both",
      wants_launch_updates: interest === "launch" || interest === "both",
      source,
    };

    const { error } = await supabase
      .from("maker_gym_waitlist")
      .insert(payload);

    setIsSubmitting(false);

    if (error && error.code === "23505") {
      toast({
        title: "Esse e-mail ja esta na lista",
        description: "Perfeito. Voce ja esta salvo para testers, lancamento ou ambos.",
      });
      return;
    }

    if (error) {
      toast({
        title: "Nao deu para entrar agora",
        description: "Confere se a tabela maker_gym_waitlist ja foi criada no Supabase com a policy de insert e tenta de novo.",
        variant: "destructive",
      });
      return;
    }

    setName("");
    setEmail("");
    setInterest("both");

    toast({
      title: "Voce entrou na lista",
      description:
        interest === "tester"
          ? "Perfeito. Vamos te considerar para acesso antecipado."
          : interest === "launch"
            ? "Perfeito. Vamos te avisar quando o Maker Gym abrir oficialmente."
            : "Perfeito. Vamos te avisar sobre testes antecipados e sobre o lancamento.",
    });
  }

  return (
    <div
      className={`rounded-[1.9rem] border border-white/10 bg-black/25 p-5 backdrop-blur ${
        compact ? "" : "shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          {compact ? <Mail size={18} /> : <Users size={18} />}
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Lista do Maker Gym
          </div>
          <h3 className="mt-2 font-heading text-2xl font-black">
            Capture testers agora e publico depois.
          </h3>
          <p className="mt-2 leading-7 text-muted-foreground">
            Deixa o e-mail aqui para acesso antecipado, aviso de lancamento ou os dois.
          </p>
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome (opcional)"
            className="h-12 rounded-2xl border-white/10 bg-white/5"
          />
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seuemail@exemplo.com"
            className="h-12 rounded-2xl border-white/10 bg-white/5"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {interestOptions.map((option) => {
            const active = interest === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setInterest(option.value)}
                className={`rounded-[1.4rem] border px-4 py-4 text-left transition-all ${
                  active
                    ? "border-primary/40 bg-primary/12 text-foreground neon-glow-cyan"
                    : "border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em]">
                  <Sparkles size={14} className={active ? "text-primary" : "text-secondary"} />
                  {option.label}
                </div>
                <div className="mt-2 text-sm leading-6">{option.description}</div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-muted-foreground">
            Ao entrar na lista, voce autoriza contato sobre testes do Maker Gym e comunicacoes de lancamento.
          </p>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-2xl px-6 font-heading font-black neon-glow-cyan"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Mail />}
            Entrar na lista
          </Button>
        </div>
      </form>
    </div>
  );
}
