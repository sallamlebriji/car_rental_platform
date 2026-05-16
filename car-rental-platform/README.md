# Car Rental Platform

Application web complète de gestion de location de voitures avec :

- espace client
- espace admin agence
- espace super admin
- backend Express + Prisma + JWT
- frontend React + Vite + Tailwind CSS
- architecture API REST séparée

## Stack

- Frontend: React 19, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- ORM: Prisma
- Base de données: MySQL
- Authentification: JWT
- PDF: PDFKit

## Structure

```text
car-rental-platform/
├── backend/
│   ├── prisma/
│   └── src/
├── frontend/
│   └── src/
└── README.md
```

## Fonctionnalités livrées

### Espace client

- accueil dynamique basé sur les paramètres agence/visuel
- catalogue voitures
- détail d’une voiture
- réservation avec dates, pack, options et informations client
- suivi des réservations
- inscription / connexion

### Espace admin / agence

- dashboard avec statistiques
- gestion des voitures
- gestion des réservations
- gestion des clients
- gestion des employés
- gestion des packs et options
- vue paiements
- génération de contrats PDF

### Espace super admin

- paramètres agence
- paramètres visuels
- paramètres de réservation
- rôles et permissions
- paramètres notifications
- paramètres documents

## Installation

### 1. Cloner ou ouvrir le dossier

```bash
cd car-rental-platform
```

### 2. Installer les dépendances

```bash
npm install
npm install -w backend
npm install -w frontend
```

### 3. Configurer les variables d’environnement

Backend :

```bash
cp backend/.env.example backend/.env
```

Frontend :

```bash
cp frontend/.env.example frontend/.env
```

### 4. Préparer MySQL

Créer une base de données MySQL puis mettre à jour `backend/.env` :

```env
DATABASE_URL="mysql://root:root@localhost:3306/car_rental_platform"
```

### 5. Générer Prisma + migrer + seed

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

## Lancement

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

### Lancement simultané depuis la racine

```bash
npm install
npm run dev
```

## Identifiants seed

- Super Admin
  - email: `superadmin@agency.com`
  - mot de passe: `password123`

- Admin agence
  - email: `admin@agency.com`
  - mot de passe: `password123`

- Client
  - email: `client@example.com`
  - mot de passe: `password123`

## API principale

### Auth

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Cars

- `GET /api/cars`
- `GET /api/cars/:id`
- `POST /api/cars`
- `PUT /api/cars/:id`
- `DELETE /api/cars/:id`

### Reservations

- `GET /api/reservations`
- `GET /api/reservations/:id`
- `POST /api/reservations`
- `PUT /api/reservations/:id`
- `PATCH /api/reservations/:id/status`
- `DELETE /api/reservations/:id`

### Clients

- `GET /api/clients`
- `GET /api/clients/:id`
- `POST /api/clients`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`

### Employees

- `GET /api/employees`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

### Packs

- `GET /api/packs`
- `POST /api/packs`
- `PUT /api/packs/:id`
- `DELETE /api/packs/:id`

### Options

- `GET /api/options`
- `POST /api/options`
- `PUT /api/options/:id`
- `DELETE /api/options/:id`

### Settings

- `GET /api/settings`
- `PUT /api/settings`
- `GET /api/settings/agency`
- `PUT /api/settings/agency`
- `GET /api/settings/visual`
- `PUT /api/settings/visual`
- `GET /api/settings/reservation`
- `PUT /api/settings/reservation`
- `GET /api/settings/notifications`
- `PUT /api/settings/notifications`
- `GET /api/settings/documents`
- `PUT /api/settings/documents`
- `GET /api/settings/roles-permissions`

### Dashboard

- `GET /api/dashboard/stats`
- `GET /api/dashboard/revenue`
- `GET /api/dashboard/reservations-chart`
- `GET /api/dashboard/top-cars`

### Contracts

- `POST /api/contracts/generate/:reservationId`
- `GET /api/contracts/:id/download`

## Calcul du prix

Le backend applique :

- prix de base = `prix voiture * nombre de jours`
- pack = fixe, pourcentage ou supplément journalier
- options = fixe ou journalier
- frais de réservation dynamiques
- avance = pourcentage configuré
- reste à payer = total - avance

## Points d’évolution prévus

- upload réel de fichiers via `multer` dans les formulaires admin/client
- édition avancée des voitures et réservations
- pagination backend native
- notifications email / WhatsApp réelles
- impression facture / reçu
- tests unitaires et e2e

## Remarques

- Le projet est organisé pour évoluer vers une version mobile.
- Les paramètres visuels et agence sont chargés côté frontend depuis l’API.
- Les suppressions principales sont en soft delete sur les entités métier sensibles.
