# Equipment Control Project Context & Rules (GEMINI.md)

This file is the **Single Source of Truth** for the Equipment Control project.
It defines the architectural context, coding rules, patterns, and conventions that MUST be followed.

---

## 1. Project Overview

- **Name:** Controle de Equipamentos
- **Purpose:** React Web Application for managing equipment inventory, clients, and rentals.
- **Core Stack:**
  - **Frontend:** React (TypeScript) + Vite.
  - **Styling:** CSS (Component-scoped `styles.css` or global `index.css`).
  - **State Management:** Custom Hooks + IndexedDB (Local Storage).
  - **Database:** IndexedDB (via `idb` library).
  - **Icons:** Lucide-react.

---

## 2. Core Architecture & Patterns

- **Architecture:** Clean Architecture (Simplified).
  - **Core:** Entities and Interfaces (`src/core`).
  - **Infrastructure:** Repository implementations (`src/infrastructure`).
  - **Presentation:** Components, Hooks, and Pages (`src/presentation`).
  
- **Design Patterns:**
  - **Repository Pattern:** All data access is abstracted through repositories.
  - **Hook-Logic Pattern (Presenter):** Separation of logic (hooks) from UI (components).
  - **Strategy Pattern:** Used for data import/export logic.

---

## 3. SOLID Principles (Strict Enforcement)

### S - Single Responsibility Principle (SRP)
- **Hooks:** Separate hooks for list management, form management, and specific logic.
  - ✅ `useClients` (Current, may be split if it grows).
  - ✅ `useEquipamentosLogic` (Current).
- **Components:** Focus on **rendering**. Logic belongs in hooks.

### O - Open/Closed Principle (OCP)
- Components and services should be extensible without modifying existing working code.

### L - Liskov Substitution Principle (LSP)
- Subtypes (like different Repository implementations) must be interchangeable without breaking the application.

### I - Interface Segregation Principle (ISP)
- Components should only receive the props they actually need. Avoid passing large objects when a single field suffices.

### D - Dependency Inversion Principle (DIP)
- High-level modules (UI/Pages) depend on abstractions (Interfaces), not concrete implementations (Repositories).
  - ✅ Page -> uses -> `IEquipmentRepository`.

---

## 4. Coding Conventions

- **File Structure:**
  - `src/presentation/components/{Module}/{Feature}/index.tsx` + `styles.css` + `useLogic.ts`
  - `src/presentation/hooks/{useFeature}.ts`
  - `src/infrastructure/repositories/{Repository}.ts`
  - `src/core/entities/{Entity}.ts`

- **Naming:**
  - **Components:** PascalCase (e.g., `ClientList`, `EquipmentForm`).
  - **Hooks:** camelCase, always start with `use` (e.g., `useClients`).
  - **Interfaces:** Start with `I` (e.g., `IClientRepository`).

---

## 5. UI/UX & Styling Standards

- **Fluid Layout:** Tables and containers must occupy the available width but protect content integrity.
- **Global Scrolling:** Prefer page-level horizontal scrolling (`.main-content`) over individual table scrolling to prevent UI fragmentation.
- **Responsiveness:** Use CSS Flexbox/Grid.
- **Styling Rules:**
  - **No Hardcoded Colors:** Use variables from `index.css`.
  - **Table Protection:** Critical columns (Actions, Dates, Status) MUST have `white-space: nowrap` and sufficient `min-width` to prevent overlapping or cutting.
  - **Last Column Protection:** The last column (usually "Ações") must be fully visible and never cut by the container border.

---

## 6. Operational Rules for AI Agents

1.  **Context First:** Always read this file (`GEMINI.md`) before starting significant tasks.
2.  **SOLID Adherence:** Every refactor must be checked against SOLID principles.
3.  **No Regressions:** Do not re-introduce fixed visual bugs (e.g., overlapping columns, internal scrolls).
4.  **Verification:** Always verify changes in the context of the full layout (Sidebar + Content).

---
*Last Updated: 2026-02-26*
