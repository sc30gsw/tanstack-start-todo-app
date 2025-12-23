# TanStack Start Todo App

A full-stack Todo application built with [TanStack Start Starter](https://github.com/lightsound/tanstack-start-start) — demonstrating the power of [TanStack Start](https://tanstack.com/start), the full-stack React framework powered by TanStack Router.

## About This Project

This project is a Todo application that showcases modern full-stack development with TanStack Start. It includes features like creating, updating, deleting, and searching todos with real-time data synchronization.

### Features

- ✅ Create, update, and delete todos
- 🔍 Search todos by text
- 🎯 Filter todos by completion status (All/Active/Completed)
- 📊 Sort todos by date or text (ascending/descending)
- 🔄 Real-time data synchronization with TanStack Query
- 📝 Form validation with TanStack React Form
- 🗄️ Database integration with Drizzle ORM and Turso (LibSQL)
- 📡 RESTful API with Elysia and OpenAPI documentation

## Tech Stack

This project is built on [TanStack Start Starter](https://github.com/lightsound/tanstack-start-start) and leverages cutting-edge tools:

| Category   | Technology                                                                             | Version   |
| ---------- | -------------------------------------------------------------------------------------- | --------- |
| Framework  | [TanStack Start](https://tanstack.com/start)                                           | Latest    |
| Router     | [TanStack Router](https://tanstack.com/router)                                         | Latest    |
| Data Fetching | [TanStack Query](https://tanstack.com/query)                                        | Latest    |
| Database   | [TanStack DB](https://tanstack.com/db/latest)                                          | Latest    |
| Forms      | [TanStack React Form](https://tanstack.com/form)                                       | Latest    |
| API Server | [Elysia](https://elysiajs.com/)                                                        | Latest    |
| Database ORM | [Drizzle ORM](https://orm.drizzle.team/)                                              | Latest    |
| Database   | [Turso (LibSQL)](https://turso.tech/)                                                  | Latest    |
| Validation | [Valibot](https://valibot.dev/)                                                        | Latest    |
| Styling    | [Tailwind CSS](https://tailwindcss.com/)                                               | 4         |
| Language   | [TypeScript Native](https://devblogs.microsoft.com/typescript/typescript-native-port/) | 7 Preview |
| Build Tool | [Vite](https://vite.dev/)                                                              | 8 Beta    |
| Linter     | [oxlint](https://oxc.rs/docs/guide/usage/linter)                                       | Latest    |
| Formatter  | [oxfmt](https://oxc.rs/docs/guide/usage/formatter)                                     | Latest    |
| Git Hooks  | [Lefthook](https://github.com/evilmartians/lefthook)                                   | Latest    |
| Runtime    | [Bun](https://bun.sh/)                                                                 | Latest    |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- A [Turso](https://turso.tech/) account (for database) or SQLite setup

### Installation

```bash
# Clone the repository
git clone <your-repository-url>
cd tanstack-start-todo-app

# Install dependencies (git hooks are automatically set up)
bun install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Turso database credentials:
# TURSO_DATABASE_URL=your-database-url
# TURSO_AUTH_TOKEN=your-auth-token

# Run database migrations
bun run db:migrate

# Start development server
bun run dev
```

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `bun run dev`      | Start development server             |
| `bun run build`    | Build for production                 |
| `bun run start`    | Preview production build             |
| `bun run check`    | Run linter and formatter check       |
| `bun run fix`      | Auto-fix lint issues and format code |
| `bun run db:generate` | Generate database migrations      |
| `bun run db:migrate` | Run database migrations            |
| `bun run db:studio` | Open Drizzle Studio for database management |

## VS Code Configuration

### Recommended Extension

This project recommends installing the [oxc extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) for the best development experience.

### Editor Settings

The included `.vscode/settings.json` provides the following configurations:

- **Format on Save**: oxfmt automatically formats your code when you save a file
- **Read-only Files**: The following files are set to read-only to prevent accidental edits:
  - `**/*.md` — Markdown files should be managed by AI, not edited directly
  - `bun.lock` — Auto-generated lockfile, should not be manually modified
  - `**/routeTree.gen.ts` — Auto-generated by TanStack Router, should not be manually modified

## About oxlint Configuration

This starter uses **minimal oxlint rules** with only the `correctness` category enabled. This catches obvious bugs without being intrusive, allowing you to customize the rules according to your project's needs.

You can make the linting stricter by adding more categories to `.oxlintrc.json`:

```json
{
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "perf": "warn"
  }
}
```

Available categories: `correctness`, `suspicious`, `perf`, `style`, `pedantic`, `restriction`, `nursery`

## Git Hooks with Lefthook

This starter uses [Lefthook](https://github.com/evilmartians/lefthook) for managing git hooks:

- **pre-commit**: Runs linting and format check on staged files (fast)
- **pre-push**: Runs the full `check` script before pushing (complete)

Git hooks are automatically installed when you run `bun install`.

## API Documentation

The application includes an OpenAPI/Swagger documentation endpoint. When running the development server, you can access it at:

```
http://localhost:3000/api/swagger
```

This provides interactive documentation for all available API endpoints.

## Developer Tools

In development mode, this application includes [TanStack Router DevTools](https://tanstack.com/router/latest/docs/framework/react/devtools) for debugging routes and navigation. The DevTools panel appears in the bottom-right corner of your application.

## Project Structure

```
src/
├── components/          # Shared components
├── db/                  # Database configuration and schema
│   ├── index.ts        # Database connection
│   ├── model.ts        # Database model utilities
│   └── schema.ts       # Drizzle ORM schema definitions
├── features/           # Feature-based organization
│   └── todos/          # Todo feature module
│       ├── collections.ts      # TanStack DB collections
│       ├── components/         # Todo-specific components
│       ├── hooks/              # Custom React hooks
│       ├── schemas/            # Validation schemas (Valibot)
│       └── todo-dto.ts         # Data transfer objects
├── routes/             # TanStack Router file-based routes
│   ├── api/            # API route handlers (Elysia)
│   └── index.tsx       # Home page route
└── router.tsx          # Router configuration
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
