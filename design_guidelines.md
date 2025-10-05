# Design Guidelines: Terminal-Style Baseline Lint Web Demo

## Design Approach: Terminal/Retro Computing Aesthetic

**Inspiration**: Neo-terminal developer portfolio with CRT monitor aesthetics, command-line interfaces, and retro computing nostalgia. This is a specialized aesthetic requirement that overrides standard design system approaches.

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background Base: 10 100% 4% (deep black with slight green tint)
- Surface/Card: 120 15% 8% (dark charcoal with green undertone)
- Terminal Screen: 0 0% 5% (pure dark for code areas)

**Accent Colors**
- Primary Green (Neon): 120 100% 50% (classic terminal green #00ff00)
- Success/Widely Available: 142 76% 36% (muted green)
- Warning/Newly Available: 45 93% 47% (amber warning)
- Error/Limited: 0 84% 60% (red alert)
- Muted Text: 120 10% 60% (desaturated green-gray)

**Glow Effects**
- Terminal glow: Use box-shadow with green (#00ff00) at 0 0 8px, 0 0 12px for text
- Subtle scanline overlay with CSS gradients

### B. Typography

**Font Families**
- Primary: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace
- All text uses monospace fonts to maintain terminal aesthetic
- No serif or sans-serif fonts

**Type Scale**
- Hero/H1: text-4xl md:text-5xl font-bold tracking-tight
- Section Headers/H2: text-2xl md:text-3xl font-semibold
- Subsections/H3: text-xl font-medium
- Body: text-sm md:text-base leading-relaxed
- Code Display: text-xs md:text-sm
- Terminal Prompt: text-sm with > or $ prefix

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16 consistently
- Component padding: p-4 to p-8
- Section spacing: py-12 md:py-16 lg:py-20
- Gap between elements: gap-4 to gap-8

**Container Strategy**
- Max width: max-w-7xl for main content
- Code editor: Full viewport width with max-w-6xl
- Results panel: Full width with internal max-w-5xl

### D. Component Library

**Terminal Window Chrome**
- Rounded corners (rounded-lg) with thin border
- Title bar with colored dots (red, yellow, green) in top-left
- Border: 1px solid rgba(0, 255, 0, 0.2)
- Background: Slightly lighter than page background

**Code Editor Container**
- Monaco Editor wrapped in terminal window
- Dark theme with green syntax highlighting
- Line numbers in muted green
- Min height: 400px, resizable
- Padding: p-4

**Results Display**
- Split panel design: Issues list + Details view
- Color-coded badges for status (green/yellow/red)
- Monospace formatting for all feature names
- Expandable accordion for detailed recommendations

**Navigation**
- Simple header with site title (ASCII art style if possible)
- Minimal links: Home, GitHub, About
- Fixed position with backdrop-blur for scrolling

**Buttons & CTAs**
- Primary action: Solid green with black text, hover glow effect
- Secondary: Outlined green with transparent background
- Hover states: Increase glow intensity, subtle scale (1.02)

**Example Snippets Panel**
- Card grid (2 columns on desktop, 1 on mobile)
- Each card: Small code preview, "Load Example" button
- Syntax highlighting with green/amber color scheme

### E. Visual Effects & Animations

**CRT/Terminal Effects**
- Subtle scanline overlay (repeating linear gradient)
- Very faint screen flicker animation (optional, toggle-able)
- Text appears with typing animation on load (hero section only)
- Cursor blink animation in terminal prompt areas

**Interaction Animations**
- Button clicks: Quick scale + brightness pulse
- Code analysis: Progress bar with green segments
- Results appear: Fade in with stagger delay (50ms between items)
- NO complex transitions - keep it snappy and terminal-like

**Performance**: Minimize animations - terminal aesthetic is clean and direct

## Page Structure & Sections

### Hero Section (100vh)
- ASCII art logo/title for "Baseline Lint Terminal"
- Typewriter effect tagline: "Check Browser Compatibility // Real-time Analysis"
- Animated terminal prompt with cursor
- Single CTA button: "Launch Terminal" (scrolls to editor)
- Background: Subtle grid pattern in dark green (opacity 5%)

### Interactive Editor Section (Main Focus)
- Full-width terminal window containing Monaco Editor
- Tab interface: "CSS" | "JavaScript" | "Examples"
- Action bar: [Check Compatibility] [Clear] [Copy Results]
- Live status indicator: "Ready" | "Analyzing..." | "Complete"

### Results Panel (Below Editor or Side-by-side on Large Screens)
- Compatibility score gauge (0-100) with color gradient
- Three-column breakdown: Widely Available | Newly Available | Limited
- Detailed list with expandable items showing recommendations
- Export options: JSON, Markdown, Share Link

### Examples Showcase
- 6-8 pre-built examples in grid layout
- Categories: Modern CSS, Flexbox, Grid, ES6+, Web APIs
- One-click load into editor

### Footer Section
- GitHub repository link with star count
- Built for Baseline Tooling Hackathon badge
- MIT License, documentation links
- Minimal, single row with centered content

## Accessibility

- Maintain WCAG AA contrast (4.5:1 minimum) even with green theme
- Keyboard navigation for all interactive elements
- Focus states: Bright green outline (2px solid)
- Screen reader labels for all icon buttons
- Code editor has proper ARIA labels

## Images

**No hero images needed** - Terminal aesthetic relies on typography and ASCII art. If any graphics:
- Use CSS-generated patterns (grid, dots, scanlines)
- SVG icons for status indicators (checkmark, warning triangle, X)
- Avoid photographs - keep it purely digital/code aesthetic

## Responsive Behavior

- Mobile: Single column, editor full width, results stack below
- Tablet: Editor remains full width, results in expandable panel
- Desktop: Optional side-by-side layout (70% editor, 30% results)
- Maintain monospace font sizing for readability on all devices