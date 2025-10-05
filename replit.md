# Baseline Lint Web Demo

## Overview

An interactive web demonstration tool for the `baseline-lint` package that analyzes CSS and JavaScript code for browser compatibility issues. The application features a retro terminal aesthetic with real-time code analysis, displaying compatibility status across modern browsers using the Baseline initiative standards.

The project provides developers with immediate feedback on web platform feature compatibility, categorizing features as "widely-available," "newly-available," or "limited" support across browsers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- Wouter for lightweight client-side routing (single page application)
- React Query (@tanstack/react-query) for server state management

**UI Component System**
- Shadcn/ui component library with Radix UI primitives for accessible components
- Tailwind CSS for styling with custom design tokens
- Terminal/retro computing aesthetic with monospace fonts (JetBrains Mono, Fira Code)
- Dark mode-first design with green terminal color scheme
- Custom CSS variables for theming (background, foreground, borders, etc.)

**Code Editor Integration**
- Monaco Editor (@monaco-editor/react) for syntax-highlighted code editing
- Support for both CSS and JavaScript analysis
- Tab-based interface for switching between language modes

**State Management Strategy**
- React hooks for local component state
- React Query for API data fetching and caching
- Toast notifications for user feedback via custom hook pattern

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server
- TypeScript for type safety across server code
- Custom middleware for request logging and error handling

**API Design**
- RESTful endpoint: POST `/api/analyze` for code analysis
- Request validation using Zod schemas
- JSON request/response format

**Code Analysis Engine**
- Integration with `baseline-lint` npm package (v1.0.6)
- Babel parser (@babel/parser) and Babel traverse (@babel/traverse) for JavaScript AST analysis
- CSS-tree (@types/css-tree) for CSS parsing
- Source map support via @jridgewell/trace-mapping

**Analysis Flow**
1. Client submits code and language type
2. Server validates request with Zod schema
3. `baseline-lint` library analyzes code for compatibility issues
4. Results converted to standardized format with status levels
5. Response includes compatibility score and detailed issue list

### Data Storage Solutions

**Current Implementation**
- In-memory storage (MemStorage class) for user data
- No persistent database configured (placeholder schema exists)
- Session-based data management

**Prepared Database Schema**
- Drizzle ORM configured for PostgreSQL
- Schema defined for users table (id, username, password)
- Neon serverless Postgres driver ready for integration
- Migration system configured via drizzle-kit

**Design Decision**: The application currently uses in-memory storage as user authentication is not actively implemented. The database schema exists as infrastructure for future features.

### External Dependencies

**Third-Party Libraries**

*Core Analysis*
- `baseline-lint` (v1.0.6) - Main compatibility analysis engine
- `@babel/parser` & `@babel/traverse` - JavaScript parsing and AST traversal
- `css-tree` - CSS parsing and analysis

*Frontend UI*
- `@radix-ui/*` - Accessible UI component primitives (20+ components)
- `@monaco-editor/react` - Code editor component
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` & `clsx` - Dynamic className utilities

*Backend Services*
- `express` - Web server framework
- `zod` - Schema validation
- `@neondatabase/serverless` - PostgreSQL database driver (configured but not actively used)

*Development Tools*
- `vite` - Build tool and dev server
- `typescript` - Type checking
- `drizzle-kit` - Database migrations
- `esbuild` - Server bundling for production

**Design Rationale**: Heavy use of Radix UI provides accessibility out-of-the-box while maintaining full styling control. Monaco Editor was chosen over simpler alternatives for professional-grade code editing experience with syntax highlighting.

**Replit-Specific Integrations**
- `@replit/vite-plugin-runtime-error-modal` - Development error overlay
- `@replit/vite-plugin-cartographer` - Development navigation (dev only)
- `@replit/vite-plugin-dev-banner` - Development indicator (dev only)

**Font Hosting**
- Google Fonts CDN for JetBrains Mono and Fira Code monospace fonts
- Preconnect optimization for performance