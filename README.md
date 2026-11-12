# Valcen

**Valcen makes existing AI tools multiplayer for enterprise teams — with shared context and agent handoffs.**

A desktop sidebar that turns individual AI work into editable team memory. Teammates and their AI agents build on each other's work using shared, reviewable project memory. Each person keeps their own private memory.

This repo contains the Valcen demo (Vite + React + TypeScript + Tailwind + Electron). It renders three surfaces:

- **Menu-bar icon** — opens/closes the sidebar and surfaces Supermode state.
- **Sidebar panel** — project selector, drop area, review queue, team updates, agent activity, Supermode start/stop, running agents.
- **Full window** — project memory: inspect, edit, approve, delete decisions; see sources and agent retrieval history; inspect the current context window.

## Run it

```bash
npm install
npm run dev          # Vite in the browser at http://localhost:5173
npm run electron:dev # Electron desktop app (menubar + floating sidebar + full window)
```

## The team

- **Manahil Tariq** — product & design (Duke ECE, Fidelity, on leave to build Valcen full-time)
- **Riya Manchanda** — development (Duke CS/math, AWS, USENIX Security co-author)
- **Huzaifa Tariq** — outreach & customer feedback (Princeton ORFE)
