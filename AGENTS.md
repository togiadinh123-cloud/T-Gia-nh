# AGENTS.md

## Project Overview

This project is an English learning web app inspired by Duolingo-style gamification, with original branding, original visual design, and original UI patterns.

Do not copy Duolingo assets, mascot, logo, exact layout, exact wording, or exact interaction design. Use the general idea of playful learning, streaks, progress, lessons, rewards, and friendly motivation while creating a distinct product identity.

## Tech Stack

- Use Next.js with the App Router.
- Use TypeScript.
- Use Tailwind CSS for styling.
- Prefer built-in Next.js and React capabilities before adding dependencies.
- Do not add unnecessary dependencies.

## Development Principles

- Keep components small, focused, and reusable.
- Do not build large features in a single file.
- Prefer clear composition over deeply nested or overly clever abstractions.
- Use a clean folder structure that separates routes, components, mock data, utilities, and types.
- Start with placeholder mock data before connecting a backend.
- Keep implementation mobile-first and responsive.
- Make UI text easy to translate later.
- Avoid hard-coding repeated user-facing strings throughout components.

## Suggested Folder Structure

Use this structure unless the project already has a better established pattern:

```text
app/
  layout.tsx
  page.tsx
  lessons/
    page.tsx
components/
  ui/
  lesson/
  layout/
data/
  mock/
lib/
types/
styles/
```

Keep route-specific components near their route only when they are not reused elsewhere. Move shared components into `components/`.

## UI And Product Direction

- Build a playful, encouraging learning experience with original branding.
- Prioritize clarity, accessibility, and fast comprehension.
- Design for mobile first, then scale up to tablet and desktop.
- Use friendly progress indicators, lesson cards, rewards, streaks, and practice flows where useful.
- Keep layouts polished but not derivative of any existing language learning product.
- Do not use Duolingo-like mascots, owl imagery, green branding as the defining visual identity, copied badges, or cloned lesson screens.

## Internationalization Readiness

- Keep all user-facing UI text simple and easy to translate.
- Prefer central text objects, dictionaries, or structured constants for repeated copy.
- Avoid constructing sentences from many fragmented strings when it would make translation difficult.
- Avoid embedding user-facing copy in utility functions unless there is a clear reason.

## Data And Backend

- Use placeholder mock data first.
- Keep mock data in a dedicated location such as `data/mock/`.
- Define TypeScript types for learning entities such as lessons, units, exercises, achievements, and users.
- Do not introduce backend services, databases, auth providers, or API integrations until explicitly needed.

## Quality Checks

After each code change, run the available validation commands and report any errors.

Prefer, in order:

```bash
npm run lint
npm run build
```

If the project uses another package manager or scripts differ, inspect `package.json` and run the closest available lint, typecheck, test, or build command.

If no validation command exists yet, say so clearly.

## Code Style

- Use TypeScript types for props and shared data models.
- Keep component props minimal and explicit.
- Prefer semantic HTML and accessible controls.
- Use Tailwind utility classes consistently.
- Extract repeated UI patterns into reusable components.
- Avoid premature global state management.
- Avoid broad refactors unless they are necessary for the requested change.

## Agent Workflow

When working in this repository:

1. Inspect the existing structure before changing files.
2. Make the smallest useful change that fits the request.
3. Keep files focused and reasonably sized.
4. Use mock data for new product surfaces unless backend work is requested.
5. Run available lint/build checks after changes.
6. Report what changed, what checks ran, and any remaining issues.

