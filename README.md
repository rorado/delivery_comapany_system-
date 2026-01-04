# Delivery Company Management System | Système de gestion de livraison

A delivery management dashboard built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

FR: Un tableau de bord de gestion des livraisons construit avec **Next.js 16**, **React 19**, **TypeScript** et **Tailwind CSS v4**.

## Overview | Vue d'ensemble

This repository is a front-end dashboard (demo data / UI-first). It includes multiple role areas (Admin / Client / Delivery) implemented via Next.js App Router.

FR: Ce dépôt est un tableau de bord côté front (données de démonstration / UI-first) avec plusieurs espaces (Admin / Client / Livreur) via l’App Router de Next.js.

### Tech stack (actual) | Technologies (réelles)

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Charts: ApexCharts (`apexcharts`, `react-apexcharts`)
- Date picker: Flatpickr (`flatpickr`)
- Calendar: FullCalendar (`@fullcalendar/*`)
- Maps: React jVectorMap (`@react-jvectormap/*`)
- Other UI libs: Swiper, React DnD, React Dropzone, jsPDF

## Features | Fonctionnalités

- Dashboards for different areas: Admin / Client / Delivery
- Shipment tracking UI (example tracking numbers)
- Delivery statistics charts
- Calendar UI and charts/components library
- Light/Dark theme support

Note: Authentication, database, and real-time notifications are not wired by default in this repo.

FR: Remarque : l’authentification, la base de données et les notifications temps réel ne sont pas intégrées par défaut.

## Getting started | Démarrage

### Prerequisites | Prérequis

- Node.js 18+ (Node.js 20+ recommended)

### Install | Installation

```bash
npm install
```

If you face peer-dependency issues:

```bash
npm install --legacy-peer-deps
```

### Run dev server | Lancer en développement

```bash
npm run dev
```

Open http://localhost:3000

### Build & start | Build & production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Project structure | Structure du projet

- `src/app/` — Next.js routes (App Router)
- `src/app/admin/` — Admin area
- `src/app/client/` — Client area
- `src/app/delivery/` — Delivery/driver area
- `src/components/` — UI components and feature widgets
- `src/layout/` — App shell components (sidebar/header)
- `src/context/` — Theme/Sidebar context

## Main routes | Routes principales

- `/` — Landing
- `/admin` — Admin dashboard
- `/client` — Client dashboard
- `/delivery` — Delivery dashboard

Some sections have French aliases that re-export the same pages (example: `profil` → `profile`, `suivi` → `tracking`).

FR: Certaines sections ont des alias FR qui réexportent les mêmes pages (ex: `profil` → `profile`, `suivi` → `tracking`).

## Navigation menus | Menus de navigation

### Admin

Admin navigation is defined in `src/layout/AppSidebar.tsx`.

Current sections include:

- Tableau de bord → `/admin`
- Expéditions → `/admin/expeditions`
- Chauffeurs → `/admin/chauffeurs`
- Clients → `/admin/clients`
- Rapports → `/admin/rapports/*`
- Suivi → `/admin/suivi`
- Authentification → `/connexion`, `/inscription`

### Client

Client navigation is defined in `src/app/client/layout.tsx` (`clientNavItems`).

- Tableau de bord → `/client`
- Mes expéditions → `/client/expeditions`
- Suivre un colis → `/client/suivi`
- Profil → `/client/profil`

### Delivery (Livreur)

Delivery navigation is defined in `src/app/delivery/layout.tsx` (`deliveryNavItems`).

- Tableau de bord → `/delivery`
- Mes livraisons → `/delivery/livraisons`
- Profil → `/delivery/profil`

## Route aliases (FR) | Alias de routes (FR)

These routes are implemented as re-export pages (so you can keep French URLs without duplicating code):

- `/client/suivi` → `/client/track` (see `src/app/client/suivi/page.tsx`)
- `/client/profil` → `/client/profile` (see `src/app/client/profil/page.tsx`)
- `/delivery/livraisons` → `/delivery/deliveries` (see `src/app/delivery/livraisons/page.tsx`)
- `/delivery/profil` → `/delivery/profile` (see `src/app/delivery/profil/page.tsx`)
- `/admin/suivi` → `/admin/tracking` (see `src/app/admin/suivi/page.tsx`)

If you want to remove an alias, delete the re-export page and update any links pointing to it.

## Demo data | Données de démo

Most pages/components are UI-first and use local arrays/objects.

Examples:

- Tracking demo data: `src/app/client/track/page.tsx` (`trackingDatabase`)
- Recent deliveries table: `src/components/delivery/RecentDeliveries.tsx` (`tableData`)
- Delivery list demo: `src/app/delivery/deliveries/page.tsx` (`initialDeliveries`)

To connect a backend, replace these demo objects with API calls and keep the UI types in sync.

## Troubleshooting | Dépannage

- Peer dependency warnings: try `npm install --legacy-peer-deps`
- Windows path issues: keep the repo near the drive root (shorter path)
- Port already in use: run `npm run dev -- -p 3001`

## How to use the demo | Comment utiliser la démo

1. Start the app: `npm run dev`
2. Navigate to a role area:
   - Admin: `/admin`
   - Client: `/client`
   - Delivery: `/delivery`
3. Try tracking:
   - Client tracking page is available under the Client area (e.g. `/client/suivi`).
   - Example numbers used in demo pages: `DLV-2024-001`, `DLV-2024-002`.

## Customization | Personnalisation

- Update labels/content directly in the pages under `src/app/**`.
- Replace demo arrays with API calls when you connect a backend.
- Keep internal status values stable (e.g. `Delivered`, `Pending`) and map them to French labels in UI if needed.
