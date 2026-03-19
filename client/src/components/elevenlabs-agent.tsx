import { useState, useCallback } from "react";
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
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";

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

  const conversation = useConversation({
    onConnect: () => {
      setIsConnecting(false);
      setError(null);
    },
    onDisconnect: () => {
      setIsConnecting(false);
      setStep("form");
    },
    onError: (err) => {
      setError(typeof err === "string" ? err : "An error occurred");
      setIsConnecting(false);
    },
  });

  const isConnected = conversation.status === "connected";

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
        setError(null);
      }
      onOpenChange(newOpen);
    },
    [isConnected, endConversation, onOpenChange]
  );

  const isFormValid = form.name.trim().length > 0 && form.businessType !== "";

  const t = {
    title: form.language === "es" ? "Habla con nuestro Agente" : "Talk to our Agent",
    description:
      form.language === "es"
        ? "Cuéntanos sobre tu negocio y descubre cómo un agente de voz puede ayudarte."
        : "Tell us about your business and discover how a voice agent can help you.",
    namePlaceholder: form.language === "es" ? "Tu nombre" : "Your name",
    nameLabel: form.language === "es" ? "Nombre" : "Name",
    businessLabel: form.language === "es" ? "Tipo de negocio" : "Business type",
    businessPlaceholder:
      form.language === "es" ? "Selecciona tu sector" : "Select your industry",
    languageLabel: form.language === "es" ? "Idioma de la llamada" : "Call language",
    startButton: form.language === "es" ? "Iniciar llamada" : "Start call",
    connecting: form.language === "es" ? "Conectando..." : "Connecting...",
    agentSpeaking: form.language === "es" ? "El agente está hablando..." : "Agent is speaking...",
    listening: form.language === "es" ? "Escuchando..." : "Listening...",
    endButton: form.language === "es" ? "Finalizar llamada" : "End call",
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
            {/* Language selector */}
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

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="agent-name">{t.nameLabel}</Label>
              <Input
                id="agent-name"
                placeholder={t.namePlaceholder}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            {/* Business type */}
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
