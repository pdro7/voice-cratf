import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertDemoRequestSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/agent-token", async (_req, res) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const agentId = process.env.ELEVENLABS_AGENT_ID;

    if (!apiKey || !agentId) {
      return res.status(500).json({ error: "ElevenLabs credentials not configured" });
    }

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
        { headers: { "xi-api-key": apiKey } }
      );
      const data = await response.json() as { signed_url: string };
      res.json({ signedUrl: data.signed_url });
    } catch (error) {
      console.error("Failed to get agent token:", error);
      res.status(500).json({ error: "Failed to get agent token" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(data);
      res.json({ success: true, data: submission });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ success: false, error: validationError.message });
      }
      console.error("Contact submission error:", error);
      res.status(500).json({ success: false, error: "Failed to submit contact form" });
    }
  });

  app.post("/api/demo-request", async (req, res) => {
    try {
      const data = insertDemoRequestSchema.parse(req.body);
      const demoRequest = await storage.createDemoRequest(data);
      res.json({ success: true, data: demoRequest });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ success: false, error: validationError.message });
      }
      console.error("Demo request error:", error);
      res.status(500).json({ success: false, error: "Failed to submit demo request" });
    }
  });

  return httpServer;
}
