# Implementation Plan: Tailwind CSS and shadcn/ui Design System Setup

**Branch**: `003-tailwind-shadcn-setup` | **Date**: November 12, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-tailwind-shadcn-setup/spec.md`

## Summary

This feature establishes a professional design system foundation for the Contoso University React application using Tailwind CSS v4 and shadcn/ui component library. The implementation will provide a cohesive visual language with standardized colors, typography, spacing, and reusable accessible components. Essential UI components (Button, Input, Card, Table, Select, Form, Dialog) will be installed and demonstrated through a refactored Students list page. The design system will enable rapid, consistent page development while maintaining accessibility standards and responsive behavior across all devices.

**Technical Approach**: Use the latest shadcn/ui CLI with Vite integration, configure TypeScript path aliases, establish CSS variables for theming, and implement a base layout structure with navigation. The Students list page will serve as the reference implementation demonstrating proper component usage patterns.

## Technical Context

**Language/Version**: TypeScript 5.9.3, React 19.2.0  
**Primary Dependencies**:

- Tailwind CSS 4.x with `@tailwindcss/vite` plugin
- shadcn/ui (latest) via CLI
- Radix UI (dependency of shadcn/ui components)
- Lucide React (icon library)
- React Router DOM 7.9.5 (already installed)
- class-variance-authority (CVA) for component variants
- clsx / tailwind-merge for className utilities

**Build Tool**: Vite 7.2.2  
**Storage**: N/A (UI layer only)  
**Testing**: Manual testing across viewports, accessibility validation with keyboard navigation and screen readers  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions), responsive viewports (375px mobile to 1920px desktop)  
**Project Type**: Web application (frontend only for this feature)  
**Performance Goals**:

- Component interaction response < 100ms
- Page load with design system < 2 seconds
- No layout shift on component render
- Tree-shakeable CSS (unused utilities removed in production)

**Constraints**:

- Must maintain existing functionality in Students pages
- Must work alongside legacy styling until migration complete
- Must be accessible (WCAG 2.1 AA)
- Must support responsive design (mobile-first approach)
- Must be Copilot-friendly (clear component APIs, discoverable patterns)

**Scale/Scope**:

- 7 core shadcn/ui components installed
- 1 reference page refactored (Students list)
- Base layout with navigation header
- Complete design token system (colors, typography, spacing)
- Component showcase/documentation optional

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### ✅ I. Spec-Driven Development

- **Status**: PASS
- **Evidence**: Complete specification exists at `specs/003-tailwind-shadcn-setup/spec.md` with user stories, functional requirements, and success criteria
- **Compliance**: This plan references spec throughout and tasks will be generated from it

### ✅ II. Educational Clarity

- **Status**: PASS
- **Evidence**: Plan includes detailed quickstart guide, component examples, and clear documentation of design patterns
- **Compliance**: Reference implementation (Students page) will demonstrate best practices; comments will explain design system concepts

### ✅ III. Cross-Platform Compatibility

- **Status**: PASS
- **Evidence**: shadcn/ui CLI and Tailwind CSS work identically on macOS and Windows; no platform-specific dependencies
- **Compliance**: npm commands are cross-platform; Vite works on both platforms

### ✅ IV. AI-Assisted Development

- **Status**: PASS
- **Evidence**: shadcn/ui components have clear, predictable APIs; Tailwind utilities are Copilot-discoverable
- **Compliance**: Component usage patterns follow industry standards; TypeScript provides type hints for Copilot

### ✅ V. Incremental Modernization

- **Status**: PASS
- **Evidence**: Design system can be adopted gradually; existing pages continue working; Students page refactored independently
- **Compliance**: No breaking changes; components co-exist with existing styles; each component can be adopted individually

### ✅ VI. REST API Design

- **Status**: N/A
- **Evidence**: This feature is UI/styling only; no API changes
- **Compliance**: N/A

### ✅ VII. React & Frontend Best Practices

- **Status**: PASS
- **Evidence**: Plan follows modern React patterns (functional components, TypeScript, component composition)
- **Compliance**:
  - Components use TypeScript interfaces
  - Follows recommended shadcn/ui structure: `components/ui/` for base components
  - Maintains existing service layer separation
  - Uses React hooks properly (no new state management needed for styling)

### ✅ VIII. Frontend-Backend Separation

- **Status**: PASS
- **Evidence**: This feature is pure frontend; no backend dependencies or changes
- **Compliance**: Design system is presentation-only; existing API integration remains unchanged

**Overall Gate Status**: ✅ **PASS** - All applicable constitutional principles satisfied. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/003-tailwind-shadcn-setup/
├── plan.md              # This file
├── research.md          # Phase 0 - Design decisions and alternatives
├── data-model.md        # Phase 1 - Design token structure and component inventory
├── quickstart.md        # Phase 1 - Developer guide for using the design system
└── checklists/
    └── requirements.md  # Specification quality validation
```

### Source Code (frontend application)

```text
contoso-university-ui/
├── src/
│   ├── components/
│   │   ├── ui/                    # NEW: shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── select.tsx
│   │   │   ├── form.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── label.tsx         # Required by form components
│   │   ├── layout/                # NEW: Layout components
│   │   │   ├── AppLayout.tsx     # Base layout wrapper
│   │   │   └── Navigation.tsx    # Top navigation bar
│   │   ├── common/                # EXISTING: Utility components
│   │   │   ├── LoadingSpinner.tsx (refactor with design system)
│   │   │   ├── ErrorMessage.tsx   (refactor with design system)
│   │   │   └── Pagination.tsx     (refactor with design system)
│   │   └── features/
│   │       └── StudentForm.tsx    (refactor with design system)
│   ├── lib/                       # NEW: Utility functions
│   │   └── utils.ts               # cn() helper for className merging
│   ├── pages/
│   │   └── students/
│   │       └── StudentList.tsx    # REFACTOR: Reference implementation
│   ├── styles/
│   │   └── globals.css            # MODIFY: Add Tailwind directives & CSS variables
│   └── types/                     # EXISTING: TypeScript types (no changes)
├── components.json                # NEW: shadcn/ui configuration
├── tailwind.config.ts             # NEW: Tailwind configuration with design tokens
├── tsconfig.json                  # MODIFY: Add path aliases
├── vite.config.ts                 # MODIFY: Add Tailwind plugin & path resolution
└── package.json                   # MODIFY: Add dependencies
```

**Structure Decision**:

This feature follows **Option 2: Web application (frontend only)** structure as defined in the constitution. We're modifying only the `contoso-university-ui/` frontend directory. The backend remains unchanged as this is a pure UI/styling enhancement.

Key structural decisions:

1. **`components/ui/`**: shadcn/ui components (auto-generated by CLI, customizable)
2. **`components/layout/`**: Application layout components (navigation, page wrapper)
3. **`lib/utils.ts`**: Utility functions for className manipulation (shadcn/ui convention)
4. **`styles/globals.css`**: Global styles with Tailwind directives and CSS variables for theming

This structure aligns with shadcn/ui best practices and the constitution's React frontend standards.

## Complexity Tracking

> **No violations** - This section is empty because all Constitution Check items passed.
