# Agent Guidelines for map-visual

## Commands

- **Build**: `pnpm build` - Builds the React Router app
- **Dev**: `pnpm dev` - Starts development server
- **Start**: `pnpm start` - Serves production build
- **Typecheck**: `pnpm typecheck` - Runs TypeScript type checking
- **Lint**: `pnpm lint` - Runs ESLint
- **Lint Fix**: `pnpm lint:fix` - Runs ESLint with auto-fix
- **Format**: `pnpm format` - Formats code with Prettier
- **Format Check**: `pnpm format:check` - Checks code formatting
- **Add Component**: `npx shadcn@latest add [component]` - Add shadcn/ui components
- **Package Manager**: pnpm

## Code Style

- **TypeScript**: Strict mode enabled, ES2022 target
- **Imports**: Named imports preferred, use `type` keyword for type imports
- **Components**: Arrow functions, proper cleanup in useEffect
- **Styling**: Tailwind CSS classes
- **Routing**: React Router v7 with file-based routing
- **Path Mapping**: Use `~/*` for app directory imports
- **Error Handling**: Use error boundaries, check `isRouteErrorResponse`
- **Type Assertions**: Use `satisfies` keyword where appropriate

## UI Components (shadcn/ui)

- **Component Location**: `~/components/ui/` - shadcn/ui components
- **Utilities**: `~/lib/utils` - Utility functions (cn, etc.)
- **Styling**: CSS variables with light/dark theme support
- **Base Color**: Neutral color scheme
- **Installation**: Use `npx shadcn@latest add [component-name]` to add components
