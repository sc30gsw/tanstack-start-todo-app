# TanStack Start Todo App

A full-stack Todo application built with [TanStack Start Starter](https://github.com/lightsound/tanstack-start-start) — demonstrating the power of [TanStack Start](https://tanstack.com/start), the full-stack React framework powered by TanStack Router.

## About This Project

This project is a Todo application that showcases modern full-stack development with TanStack Start, TanStack DB, and Elysia. It demonstrates:

- **Local-first architecture** with TanStack DB for client-side reactive data management
- **Optimistic updates** with automatic error handling and rollback
- **Type-safe API** using Elysia with TypeBox validation and Eden Treaty for RPC calls
- **MVC pattern** following Elysia's best practices (Controller/Service/Model separation)
- **Real-time reactivity** with Live Queries that update UI instantly on data changes

The application includes features like creating, updating, deleting, and searching todos with real-time data synchronization powered by TanStack DB's reactive query system.

### Features

- ✅ Create, update, and delete todos
- 🔍 Search todos by text
- 🎯 Filter todos by completion status (All/Active/Completed)
- 📊 Sort todos by date or text (ascending/descending)
- ⚡ Real-time reactive updates with TanStack DB Live Queries
- 🚀 Optimistic updates with automatic rollback on errors
- 📝 Form validation with TanStack React Form and Valibot
- 🗄️ Database integration with Drizzle ORM and Turso (LibSQL)
- 📡 Type-safe RESTful API with Elysia and OpenAPI documentation
- 🏗️ MVC architecture following Elysia best practices

## Tech Stack

This project is built on [TanStack Start Starter](https://github.com/lightsound/tanstack-start-start) and leverages cutting-edge tools:

| Category       | Technology                                                                               | Version   |
| -------------- | ---------------------------------------------------------------------------------------- | --------- |
| Framework      | [TanStack Start](https://tanstack.com/start)                                             | Latest    |
| Router         | [TanStack Router](https://tanstack.com/router)                                           | Latest    |
| Data Fetching  | [TanStack Query](https://tanstack.com/query)                                             | Latest    |
| Client DB      | [TanStack DB](https://tanstack.com/db/latest)                                            | Latest    |
| Forms          | [TanStack React Form](https://tanstack.com/form)                                         | Latest    |
| API Server     | [Elysia](https://elysiajs.com/)                                                          | Latest    |
| Database ORM   | [Drizzle ORM](https://orm.drizzle.team/)                                                 | Latest    |
| Database       | [Turso (LibSQL)](https://turso.tech/)                                                    | Latest    |
| Validation     | [Valibot](https://valibot.dev/)                                                          | Latest    |
| API Validation | [drizzle-typebox](https://github.com/drizzle-team/drizzle-orm/tree/main/drizzle-typebox) | Latest    |
| API Validation | [TypeBox](https://github.com/sinclairzx81/typebox) (via Elysia)                          | Latest    |
| Styling        | [Tailwind CSS](https://tailwindcss.com/)                                                 | 4         |
| Language       | [TypeScript Native](https://devblogs.microsoft.com/typescript/typescript-native-port/)   | 7 Preview |
| Build Tool     | [Vite](https://vite.dev/)                                                                | 8 Beta    |
| Linter         | [oxlint](https://oxc.rs/docs/guide/usage/linter)                                         | Latest    |
| Formatter      | [oxfmt](https://oxc.rs/docs/guide/usage/formatter)                                       | Latest    |
| Git Hooks      | [Lefthook](https://github.com/evilmartians/lefthook)                                     | Latest    |
| Runtime        | [Bun](https://bun.sh/)                                                                   | Latest    |

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

# Generate and run database migrations
bun run db:generate
bun run db:migrate

# Start development server
bun run dev
```

## Scripts

| Command               | Description                                 |
| --------------------- | ------------------------------------------- |
| `bun run dev`         | Start development server                    |
| `bun run build`       | Build for production                        |
| `bun run start`       | Preview production build                    |
| `bun run check`       | Run linter and formatter check              |
| `bun run fix`         | Auto-fix lint issues and format code        |
| `bun run db:generate` | Generate database migrations                |
| `bun run db:migrate`  | Run database migrations                     |
| `bun run db:studio`   | Open Drizzle Studio for database management |

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

This provides interactive documentation for all available API endpoints, including:

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PATCH /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

The API follows Elysia's best practices with:

- Type-safe request/response validation using TypeBox
- Custom error handling with proper status codes
- OpenAPI-compliant documentation
- Type-safe client via Eden Treaty

## Developer Tools

In development mode, this application includes [TanStack Router DevTools](https://tanstack.com/router/latest/docs/framework/react/devtools) for debugging routes and navigation. The DevTools panel appears in the bottom-right corner of your application.

## Project Structure

This project follows a feature-based architecture with clear separation of concerns:

```
src/
├── components/          # Shared components
│   └── client-only.tsx # Client-side only component wrapper
├── db/                  # Database configuration and schema
│   ├── index.ts        # Database connection (Drizzle + Turso)
│   ├── schema.ts       # Drizzle ORM schema definitions
│   └── utils.ts        # Database utility functions
├── features/           # Feature-based organization
│   └── todos/          # Todo feature module
│       ├── collections.ts      # TanStack DB collection definition
│       ├── components/         # Todo-specific React components
│       │   ├── todo-form.tsx           # Todo creation form
│       │   ├── todo-item.tsx            # Individual todo item
│       │   ├── todo-list-content.tsx    # Todo list content
│       │   ├── todo-list-with-search.tsx # Todo list with search
│       │   └── todo-search.tsx         # Search and filter UI
│       ├── hooks/              # Custom React hooks
│       │   └── use-todos-query.ts      # Live query hook
│       ├── schemas/            # Validation schemas (Valibot)
│       │   ├── search-schema.ts        # Search params schema
│       │   ├── todo-form-schema.ts     # Form validation schema
│       │   └── todo-schema.ts         # Todo data schema
│       └── server/             # Elysia API (MVC pattern)
│           ├── index.ts       # Controller (Elysia plugin)
│           ├── service.ts     # Business logic (abstract class)
│           ├── model.ts       # Validation models (TypeBox)
│           └── errors.ts      # Custom error classes
├── routes/             # TanStack Router file-based routes
│   ├── api/            # API route handlers (Elysia)
│   │   └── $.ts        # Main API route with plugin integration
│   └── index.tsx       # Home page route
├── utils/              # Utility functions
│   └── cn.ts           # Class name utility (clsx + tailwind-merge)
├── router.tsx          # Router configuration
└── styles.css          # Global styles
```

### Architecture Highlights

- **Elysia Best Practices**: The API follows Elysia's recommended MVC pattern:
  - **Controller** (`server/index.ts`): Elysia plugin handling HTTP routing and validation
  - **Service** (`server/service.ts`): Business logic as abstract class with static methods
  - **Model** (`server/model.ts`): TypeBox validation schemas grouped in a namespace
  - **Errors** (`server/errors.ts`): Custom error classes with status codes

- **TanStack DB**: Client-side reactive database with:
  - **Collection** (`collections.ts`): Defines data fetching and mutations
  - **Live Queries**: Real-time reactive queries using `useLiveSuspenseQuery`
  - **Optimistic Updates**: Automatic optimistic updates via transaction mutators

- **Type Safety**: End-to-end type safety with:
  - Drizzle ORM for database types
  - [TypeBox](https://github.com/sinclairzx81/typebox) for Elysia validation (via `drizzle-typebox` and Elysia's `t`)
  - Valibot for client-side validation
  - Eden Treaty for type-safe API calls

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
