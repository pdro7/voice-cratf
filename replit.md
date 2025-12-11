# AI Voice Agent Landing Page

## Overview

This is a modern landing page for an AI voice agent and avatar service. The application showcases AI-powered receptionist capabilities that handle customer calls, book appointments, and answer questions 24/7. Built as a premium SaaS marketing site with a Stripe/Linear-inspired aesthetic, targeting European businesses with GDPR compliance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom build script for production
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style) built on Radix UI primitives
- **Animations**: Framer Motion for smooth transitions and animations
- **Icons**: Lucide React and react-icons

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Development**: tsx for TypeScript execution
- **Build**: esbuild for server bundling, Vite for client

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` with Zod validation via drizzle-zod
- **Storage**: Abstracted storage interface (`IStorage`) with in-memory implementation for development
- **Migrations**: Drizzle Kit for database migrations

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn/ui)
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and query client
├── server/              # Express backend
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Data access layer
│   └── static.ts        # Static file serving
├── shared/              # Shared types and schemas
└── migrations/          # Database migrations
```

### Design System
- **Color Palette**: Deep Navy (#0f172a), Soft White (#fafafa), Electric Blue (#3b82f6), Subtle Purple (#8b5cf6)
- **Typography**: Inter font family with clean, modern hierarchy
- **Visual Effects**: Glass-morphism, soft shadows, smooth gradients
- **Border Radius**: Consistent 8-12px rounded corners

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for PostgreSQL

### UI Framework Dependencies
- **Radix UI**: Full suite of accessible, unstyled primitives (dialog, dropdown, tabs, etc.)
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class conflict resolution
- **embla-carousel-react**: Carousel functionality
- **react-day-picker**: Date picker component
- **vaul**: Drawer component
- **cmdk**: Command palette
- **react-resizable-panels**: Resizable panel layouts
- **recharts**: Charting library

### Form & Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod resolver for form validation
- **zod**: Schema validation

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner (development only)