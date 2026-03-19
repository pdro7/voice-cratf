# Konverxa — AI Voice Agent Platform

Konverxa is live demo site for an AI voice receptionist service targeting European SMBs. Visitors can speak directly with a conversational AI agent that qualifies leads, answers questions about the product, and captures contact information — all in real time.

Built as a portfolio project to demonstrate production-grade integration of the [ElevenLabs Conversational AI](https://elevenlabs.io/conversational-ai) platform.

---

## Live Demo

The agent supports **English and Spanish**, personalizes the conversation using the visitor's name and business type, and integrates with a PostgreSQL database to persist leads captured during the call.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion |
| Voice AI | ElevenLabs Conversational AI (`@elevenlabs/react` SDK) |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Supabase) + Drizzle ORM |
| Validation | Zod |

---

## ElevenLabs Integration

This project showcases several ElevenLabs platform features working together in a production context.

### Dynamic Variables
Before starting the call, the user fills a pre-call form with their name, business type, and preferred language. These are passed to the agent session as dynamic variables:

```typescript
await conversation.startSession({
  agentId: AGENT_ID,
  connectionType: "webrtc",
  dynamicVariables: {
    user_name: form.name,
    business_type: businessLabel,
    language: form.language === "es" ? "español" : "english",
  },
  overrides: {
    agent: {
      firstMessage, // Dynamically generated based on language + user data
      language: form.language,
    },
  },
});
```

The agent prompt uses `{{user_name}}`, `{{business_type}}`, and `{{language}}` to personalize the greeting and conduct the entire conversation in the right language from the first word.

### Client Tools

Two client tools are registered in the `useConversation` hook to connect the voice agent with the application backend:

#### `save_lead`
Called by the agent when the user provides contact details verbally. Posts directly to the `/api/contact` endpoint.

```typescript
save_lead: async ({ name, email, phone }) => {
  const res = await fetch("/api/contact", { method: "POST", ... });
  return res.ok ? "Lead saved successfully." : "Failed to save lead.";
}
```

#### `show_email_form`
Email addresses are unreliable over voice (ASR struggles with `@` and domain names). When the agent needs an email, it calls this tool instead of asking verbally — which renders a text input directly in the call UI.

```typescript
show_email_form: ({ name, phone }) => {
  setPendingLead({ name, phone });
  setShowEmailForm(true);
  // Returns a Promise that resolves only when the user submits the form
  return new Promise<string>((resolve) => {
    emailResolveRef.current = resolve;
  });
}
```

The agent stays silent (interruptions disabled) until the Promise resolves with the result. This pattern — combining voice with a targeted UI interaction — avoids a common pain point in voice-only data collection.

### Language & Voice Override
The `overrides.agent.language` parameter ensures both ASR (speech recognition) and TTS (voice synthesis) operate in the correct language. Combined with the `{{language}}` dynamic variable in the system prompt, the agent is fully bilingual end-to-end.

---

## Architecture

```
Browser
├── Pre-call form (name, business type, language)
├── ElevenLabs WebRTC session
│   ├── Dynamic variables → agent personalisation
│   ├── Client tool: save_lead → POST /api/contact
│   └── Client tool: show_email_form → UI email input → POST /api/contact
└── Call UI (speaking indicator, email form overlay)

Express Server
├── POST /api/contact → contactSubmissions (DB)
└── POST /api/demo-request → demoRequests (DB)

PostgreSQL (Supabase)
├── contact_submissions
└── demo_requests
```

---

## Running Locally

### Prerequisites
- Node.js 20+
- A PostgreSQL database (Supabase recommended)
- An ElevenLabs account with a configured Conversational AI agent

### Setup

```bash
git clone https://github.com/pdro7/voice-cratf.git
cd voice-cratf
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_agent_id
```

> The `ELEVENLABS_API_KEY` requires **ElevenAgents → Write** permission. The Agent ID and API key are never sent to the client — the frontend requests an ephemeral signed URL from the backend before each session.

Push the schema to your database:

```bash
npx drizzle-kit push
```

Start the development server:

```bash
PORT=3001 npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

### ElevenLabs Agent Configuration

The agent requires the following **dynamic variables** defined in the ElevenLabs dashboard:

| Variable | Description |
|----------|-------------|
| `user_name` | Caller's name from the pre-call form |
| `business_type` | Caller's business sector |
| `language` | `español` or `english` |

And two **client tools**:

| Tool | Wait for response | Description |
|------|:-----------------:|-------------|
| `save_lead` | Yes | Saves name, email, phone to DB |
| `show_email_form` | Yes (60s timeout, interruptions disabled) | Renders email input in UI |

---

## Key Design Decisions

**Pre-call form over cold start** — Collecting name, business type, and language before the call allows the agent to open with a fully personalised greeting instead of a generic one. This mirrors how a real receptionist would use a CRM screen-pop.

**Email via UI, not voice** — Voice-to-text is unreliable for email addresses. Triggering a typed input from within the voice conversation (via a client tool that returns a Promise) solves this cleanly without breaking the conversational flow.

**Client tools as integration points** — Both tools demonstrate how a voice agent can interact with external systems (databases, CRMs) in real time. The same pattern scales to calendar integrations, inventory lookups, or any API call an enterprise customer might need.

**Signed URL authentication** — The Agent ID never reaches the browser. Before each session, the frontend requests an ephemeral signed URL from the backend, which generates it server-side using the ElevenLabs API key stored in environment variables. This prevents unauthorised use of the agent even if the source code is public.
