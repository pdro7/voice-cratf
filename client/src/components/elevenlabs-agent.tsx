import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";

const AGENT_ID = "agent_0601kbfjez74e6n9gtw65apy53x5";

interface ElevenLabsAgentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ElevenLabsAgent({ open, onOpenChange }: ElevenLabsAgentProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      setIsConnecting(false);
      setError(null);
    },
    onDisconnect: () => {
      setIsConnecting(false);
    },
    onError: (err) => {
      setError(typeof err === 'string' ? err : "An error occurred");
      setIsConnecting(false);
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "webrtc",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start conversation");
      setIsConnecting(false);
    }
  }, [conversation]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleOpenChange = useCallback(async (newOpen: boolean) => {
    if (!newOpen && conversation.status === "connected") {
      await endConversation();
    }
    onOpenChange(newOpen);
  }, [conversation.status, endConversation, onOpenChange]);

  const isConnected = conversation.status === "connected";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Talk to Our AI Agent</DialogTitle>
          <DialogDescription className="text-center">
            Experience our AI voice assistant. Click Start Call and speak naturally.
          </DialogDescription>
        </DialogHeader>
        
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

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {isConnecting 
                ? "Connecting..." 
                : isConnected 
                  ? conversation.isSpeaking 
                    ? "Agent is speaking..." 
                    : "Listening..."
                  : "Click to start talking with our AI agent"
              }
            </p>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          {!isConnected ? (
            <Button 
              size="lg" 
              onClick={startConversation}
              disabled={isConnecting}
              data-testid="button-start-call"
            >
              {isConnecting ? (
                <>Connecting...</>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Start Call
                </>
              )}
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="destructive"
              onClick={endConversation}
              data-testid="button-end-call"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              End Call
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
