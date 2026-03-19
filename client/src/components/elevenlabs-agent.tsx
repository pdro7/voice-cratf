import { useState, useCallback, useRef } from "react";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, PhoneOff, Mic, MicOff, Mail } from "lucide-react";

const AGENT_ID = "agent_1301kc9qseaxeh9s1pxqvgdcbp3p";

const BUSINESS_TYPES = [
  { value: "restaurant", labelEs: "Restaurante / Hostelería", labelEn: "Restaurant / Hospitality" },
  { value: "clinic", labelEs: "Clínica / Salud", labelEn: "Clinic / Healthcare" },
  { value: "real_estate", labelEs: "Inmobiliaria", labelEn: "Real Estate" },
  { value: "legal", labelEs: "Despacho / Asesoría", labelEn: "Law Firm / Consultancy" },
  { value: "retail", labelEs: "Comercio / Tienda", labelEn: "Retail / Store" },
  { value: "beauty", labelEs: "Estética / Peluquería", labelEn: "Beauty / Salon" },
  { value: "education", labelEs: "Academia / Formación", labelEn: "Academy / Education" },
  { value: "other", labelEs: "Otro", labelEn: "Other" },
];

interface PreCallForm {
  name: string;
  businessType: string;
  language: "es" | "en";
}

interface PendingLead {
  name: string;
  phone: string;
}

interface ElevenLabsAgentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ElevenLabsAgent({ open, onOpenChange }: ElevenLabsAgentProps) {
  const [step, setStep] = useState<"form" | "call">("form");
  const [form, setForm] = useState<PreCallForm>({
    name: "",
    businessType: "",
    language: "es",
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email form state
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [pendingLead, setPendingLead] = useState<PendingLead>({ name: "", phone: "" });
  const emailResolveRef = useRef<((result: string) => void) | null>(null);

  // Use ref to always access latest form values inside clientTools
  const formRef = useRef(form);
  formRef.current = form;

  const conversation = useConversation({
    clientTools: {
      save_lead: async ({ name, email, phone }: { name: string; email: string; phone?: string }) => {
        try {
          const f = formRef.current;
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              phone: phone ?? "",
              company: f.businessType,
              message: `Lead captured via voice agent demo. Business: ${f.businessType}`,
            }),
          });
          if (res.ok) return "Lead saved successfully.";
          return "There was an issue saving the information.";
        } catch {
          return "Failed to save lead.";
        }
      },
      show_email_form: ({ name, phone }: { name?: string; phone?: string }) => {
        setPendingLead({ name: name ?? formRef.current.name, phone: phone ?? "" });
        setEmailInput("");
        setShowEmailForm(true);
        return new Promise<string>((resolve) => {
          emailResolveRef.current = resolve;
        });
      },
    },
    onConnect: () => {
      setIsConnecting(false);
      setError(null);
    },
    onDisconnect: () => {
      setIsConnecting(false);
      setShowEmailForm(false);
      setStep("form");
    },
    onError: (err) => {
      setError(typeof err === "string" ? err : "An error occurred");
      setIsConnecting(false);
    },
  });

  const isConnected = conversation.status === "connected";

  const handleEmailSubmit = useCallback(async () => {
    if (!emailInput.trim()) return;
    setEmailSubmitting(true);
    try {
      const f = formRef.current;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pendingLead.name,
          email: emailInput.trim(),
          phone: pendingLead.phone,
          company: f.businessType,
          message: `Lead captured via voice agent demo. Business: ${f.businessType}`,
        }),
      });
      const result = res.ok ? "Lead saved successfully." : "Failed to save lead.";
      setShowEmailForm(false);
      emailResolveRef.current?.(result);
      emailResolveRef.current = null;
    } catch {
      setShowEmailForm(false);
      emailResolveRef.current?.("Failed to save lead.");
      emailResolveRef.current = null;
    } finally {
      setEmailSubmitting(false);
    }
  }, [emailInput, pendingLead]);

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const selectedBusiness = BUSINESS_TYPES.find(
        (b) => b.value === form.businessType
      );
      const businessLabel =
        form.language === "es"
          ? selectedBusiness?.labelEs
          : selectedBusiness?.labelEn;

      const firstMessage =
        form.language === "es"
          ? `¡Hola ${form.name}! Gracias por llamar a Konverxa. Veo que tienes un negocio de ${businessLabel ?? form.businessType} — cuéntame, ¿cómo gestionas actualmente las llamadas de tus clientes?`
          : `Hello ${form.name}! Thanks for calling Konverxa. I see you're in the ${businessLabel ?? form.businessType} sector — tell me, how are you currently handling your customer calls?`;

      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "webrtc",
        dynamicVariables: {
          user_name: form.name,
          business_type: businessLabel ?? form.businessType,
          language: form.language === "es" ? "español" : "english",
        },
        overrides: {
          agent: {
            firstMessage,
            language: form.language,
          },
        },
      });

      setStep("call");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start conversation"
      );
      setIsConnecting(false);
    }
  }, [conversation, form]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleOpenChange = useCallback(
    async (newOpen: boolean) => {
      if (!newOpen) {
        if (isConnected) await endConversation();
        setStep("form");
        setForm({ name: "", businessType: "", language: "es" });
        setShowEmailForm(false);
        setError(null);
      }
      onOpenChange(newOpen);
    },
    [isConnected, endConversation, onOpenChange]
  );

  const isFormValid = form.name.trim().length > 0 && form.businessType !== "";
  const isEs = form.language === "es";

  const t = {
    title: isEs ? "Habla con nuestro Agente" : "Talk to our Agent",
    description: isEs
      ? "Cuéntanos sobre tu negocio y descubre cómo un agente de voz puede ayudarte."
      : "Tell us about your business and discover how a voice agent can help you.",
    namePlaceholder: isEs ? "Tu nombre" : "Your name",
    nameLabel: isEs ? "Nombre" : "Name",
    businessLabel: isEs ? "Tipo de negocio" : "Business type",
    businessPlaceholder: isEs ? "Selecciona tu sector" : "Select your industry",
    languageLabel: isEs ? "Idioma de la llamada" : "Call language",
    startButton: isEs ? "Iniciar llamada" : "Start call",
    connecting: isEs ? "Conectando..." : "Connecting...",
    agentSpeaking: isEs ? "El agente está hablando..." : "Agent is speaking...",
    listening: isEs ? "Escuchando..." : "Listening...",
    endButton: isEs ? "Finalizar llamada" : "End call",
    emailTitle: isEs ? "Introduce tu email" : "Enter your email",
    emailDescription: isEs
      ? "El agente continúa mientras introduces tu correo."
      : "The agent continues while you type your email.",
    emailPlaceholder: isEs ? "tu@empresa.com" : "you@company.com",
    emailSubmit: isEs ? "Confirmar" : "Confirm",
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{t.title}</DialogTitle>
          <DialogDescription className="text-center">
            {t.description}
          </DialogDescription>
        </DialogHeader>

        {step === "form" ? (
          <div className="flex flex-col gap-5 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>{t.languageLabel}</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={form.language === "es" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setForm((f) => ({ ...f, language: "es" }))}
                >
                  🇪🇸 Español
                </Button>
                <Button
                  type="button"
                  variant={form.language === "en" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setForm((f) => ({ ...f, language: "en" }))}
                >
                  🇬🇧 English
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="agent-name">{t.nameLabel}</Label>
              <Input
                id="agent-name"
                placeholder={t.namePlaceholder}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t.businessLabel}</Label>
              <Select
                value={form.businessType}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, businessType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.businessPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {form.language === "es" ? b.labelEs : b.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              size="lg"
              onClick={startConversation}
              disabled={!isFormValid || isConnecting}
              className="w-full mt-1"
            >
              {isConnecting ? (
                t.connecting
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  {t.startButton}
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 py-8">
            {showEmailForm ? (
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center gap-2 text-primary">
                  <Mail className="w-5 h-5" />
                  <p className="font-medium">{t.emailTitle}</p>
                </div>
                <p className="text-sm text-muted-foreground">{t.emailDescription}</p>
                <Input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                  autoFocus
                />
                <Button
                  onClick={handleEmailSubmit}
                  disabled={!emailInput.trim() || emailSubmitting}
                  className="w-full"
                >
                  {emailSubmitting ? "..." : t.emailSubmit}
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isConnected
                      ? conversation.isSpeaking
                        ? "bg-primary/20 ring-4 ring-primary/50 animate-pulse"
                        : "bg-primary/10 ring-2 ring-primary/30"
                      : "bg-muted"
                  }`}
                >
                  {isConnected ? (
                    conversation.isSpeaking ? (
                      <Mic className="w-12 h-12 text-primary animate-pulse" />
                    ) : (
                      <MicOff className="w-12 h-12 text-muted-foreground" />
                    )
                  ) : (
                    <Phone className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>

                <div className="text-center space-y-1">
                  <p className="font-medium">{form.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {isConnecting
                      ? t.connecting
                      : isConnected
                      ? conversation.isSpeaking
                        ? t.agentSpeaking
                        : t.listening
                      : t.connecting}
                  </p>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              </>
            )}

            <Button
              size="lg"
              variant="destructive"
              onClick={endConversation}
              data-testid="button-end-call"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              {t.endButton}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
