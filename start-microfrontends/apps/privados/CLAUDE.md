# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VUCEM (Ventanilla Única de Comercio Exterior Mexicana) frontend application built with Angular 17. The application provides air cargo consultation services (consultas aéreas) including air manifest queries, document downloads, and transport document management.

## Development Commands

### Development Server
```bash
npm start
# or
ng serve
```
Navigate to `http://localhost:4200/`

### Build
```bash
ng build                           # Production build
ng build --configuration development   # Development build
ng build --watch --configuration development  # Watch mode
```

### Testing
```bash
ng test                            # Run all tests via Karma
ng test --include='**/path/to/file.spec.ts'  # Run single test file
```

### Code Generation
```bash
ng generate component component-name
ng generate service service-name
ng generate directive|pipe|guard|interface|enum
```

## Architecture

This project follows **Clean Architecture** with Angular-specific adaptations. The codebase is organized in distinct layers that flow from generic/reusable to specific/business logic.

### Layer Hierarchy

```
Core (global services, guards, interceptors)
  ↓
Shared (reusable utilities, components, pipes, directives)
  ↓
Components (UI building blocks)
  ↓
Features (business domain modules)
  ↓
Pages (routable views)
  ↓
Layouts (structural wrappers)
```

### Directory Structure

```
src/app/
├── core/              # Global application services (auth, routing, interceptors)
├── shared/            # Reusable across the entire app
│   ├── components/    # Generic UI components (table, button, modal)
│   ├── interfaces/    # Common type definitions
│   ├── utils/         # Helper functions (serviceUtils, formUtils)
│   ├── pipes/         # Reusable pipes
│   └── directives/    # Custom directives
├── features/          # Business domain modules
│   ├── consultas/     # Air cargo consultation domain
│   │   ├── manifiesto-aereo/  # Air manifest feature
│   │   └── descargar-documento-consultado/  # Document download feature
│   └── tramites/      # Procedures domain
├── store-front/       # Main application entry layer
│   ├── components/    # Navbar, sidebar
│   ├── layout/        # Main layout structure
│   ├── pages/         # Top-level pages (home, consultas, not-found)
│   └── interfaces/    # Store-front specific types
├── app.component.*    # Root component
├── app.routes.ts      # Global routing configuration
└── app.config.ts      # Application-wide providers and configuration
```

## Key Architectural Patterns

### 1. Route Organization

Routes are organized hierarchically with centralized constants:

- **Global routes**: `app.routes.constants.ts` → `APP_ROUTES`
- **Store-front routes**: `store-front.routes.constants.ts` → `STORE_FRONT_ROUTES`
- **Feature routes**: Each feature module has its own route constants
- **Centralized exports**: `routes.constants.ts` re-exports all route constants

Route definitions use lazy loading with `loadComponent()` and `loadChildren()`.

Example route pattern:
```typescript
{
  path: CONSULTAS_ROUTES.MANIFIESTO_AEREO,
  component: ManifiestoAereoPage,
}
```

### 2. Service Pattern

Services use Angular's `inject()` function for modern dependency injection and signals for reactive state management:

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleService {
  private http = inject(HttpClient);
  private sessionStorage = inject(SessionStorageService);

  // Signals for reactive state
  public data = signal<Type[]>([]);

  // Session storage persistence pattern
  constructor() {
    this.loadFromSessionStorage();
  }

  private loadFromSessionStorage() {
    const saved = this.sessionStorage.get<Type>('key');
    if (saved) {
      this.data.set(saved);
    }
  }
}
```

### 3. State Management

- **Signals** are used for reactive state (Angular's built-in reactivity)
- **SessionStorage** is used for persistence across navigation
- `SessionStorageService` provides type-safe session storage with signal integration
- Feature services maintain their own state and persist to session storage

### 4. Naming Conventions

- **Pages**: `*.page.ts` (routable components, e.g., `manifiesto-aereo.page.ts`)
- **Components**: `*.component.ts` (reusable UI components)
- **Services**: `*.service.ts`
- **Interfaces**: `*.interface.ts`
- **Routes constants**: `*.routes.constants.ts`
- **Routes definitions**: `*.routes.ts`

### 5. Path Aliases

TypeScript path aliases are configured for cleaner imports:

```typescript
"@/*"       → "src/app/*"
"@app/*"    → "src/app/*"
"@shared/*" → "src/app/shared/*"
"@core/*"   → "src/app/core/*"
```

Use these aliases in imports:
```typescript
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { AuthInformationService } from '@/features/auth/services/auth-information.service';
```

### 6. HTTP Communication Pattern

- All HTTP calls use observables with RxJS operators
- Error handling uses `catchError()` to transform errors into user-friendly messages
- `cleanParams()` utility removes null/empty values from HTTP params
- Response mapping extracts data from API wrapper structures

### 7. Component Architecture

- **Standalone components** are used (Angular 17+ pattern)
- Components are lazy-loaded for optimal bundle size
- Pages orchestrate multiple components and services
- Components communicate via `@Input()`, `@Output()`, and shared services

## Application Configuration

The `app.config.ts` provides:
- Router with view transitions and scroll restoration
- HTTP client with fetch API
- Animations support

## Feature Module Pattern

Each feature module (e.g., `manifiesto-aereo`) contains:
- **pages/**: Routable page components
- **components/**: Feature-specific UI components
- **services/**: Business logic and API communication
- **interfaces/**: Type definitions for the feature
- **routes.ts**: Feature routing configuration
- **routes.constants.ts**: Route path constants

## CSS/Styling

- **SCSS** is used for styling
- Global styles in `src/styles.scss`
- Color variables defined in `src/styles/colors.scss`
- Component-specific styles are scoped

## External Dependencies

- **ngx-bootstrap**: Bootstrap components for Angular
- **RxJS**: Reactive programming with observables
- **Angular Forms**: Reactive and template-driven forms

## Development Workflow

When working on features:

1. Define route constants in `*.routes.constants.ts`
2. Create page component in `pages/` directory
3. Create feature-specific components in `components/`
4. Implement service with signals and session storage pattern
5. Define interfaces for type safety
6. Configure routes in `*.routes.ts`
7. Lazy-load feature module from parent routes

When modifying routing:
- Always use route constants, never hardcode paths
- Export new route constants from `routes.constants.ts`
- Use relative navigation with `RoutingService.navigate()`

When creating services:
- Use `inject()` for dependency injection
- Use signals for reactive state
- Persist critical state to session storage
- Load session storage data in constructor
