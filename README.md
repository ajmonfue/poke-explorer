# Pokémon Explorer

A web application for exploring Pokémon data with support for multiple data sources.

## Features

- Browse Pokémon by name, type and generation.
- View detailed Pokémon information including stats, types, and evolutions.
- Support for multiple data sources (local database or PokéAPI).
- Responsive design for desktop and mobile devices.
- Type-safe development with TypeScript.

## Prerequisites

- Node.js (see `.nvmrc` for the exact version)
- Docker (optional, for local database)

## Installation

Install the dependencies:

```bash
npm install
```

## Configuration

The project supports two data sources. You must specify which one to use in your `.env` file.

### Option 1: PostgreSQL Database (Prisma)

For better performance and offline capability, you can use a local PostgreSQL database.

1. Start the PostgreSQL database using Docker:
   ```bash
   docker compose -f etc/docker/compose.yml up -d
   ```

2. Create a `.env` file in the project root:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:25442/poke_app"
   DATA_SOURCE="prisma"
   ```

3. Apply database migrations:
   ```bash
   npm run db:migrate
   ```

4. Seed the database with Pokémon data:
   ```bash
   npx prisma db seed
   ```

### Option 2: PokéAPI (External API)

For a lighter setup that doesn't require a local database:

Create a `.env` file in the project root:
```env
DATA_SOURCE="pokeapi"
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Testing

Run the test suite:

```bash
npm test
```

## Technologies Used

- **Framework**: Next.js (T3 Stack)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: CSS Modules / Tailwind CSS
- **Testing**: Jest
- **External API**: PokéAPI