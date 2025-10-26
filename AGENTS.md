# Agent Guidelines for Fullstack App

## Build/Lint/Test Commands

### Backend (Python/FastAPI)
- **Run tests**: `cd backend && pytest`
- **Run single test**: `cd backend && pytest tests/unit/test_auth_service.py::test_function_name`
- **Run app**: `cd backend && python manage.py run`
- **Format code**: `cd backend && black .`
- **DB migrate**: `cd backend && python manage.py migrate`
- **Create migration**: `cd backend && python manage.py makemigrations "message"`

### Frontend (TypeScript/React)
- **Dev server**: `cd frontend && npm run dev`
- **Build**: `cd frontend && npm run build`
- **Type check**: `cd frontend && npm run typecheck`
- **Format code**: `cd frontend && npm run format`
- **Check format**: `cd frontend && npm run format:check`

### Pre-commit (automatic)
- Runs Black for Python formatting
- Runs Prettier for frontend formatting
- Checks for trailing whitespace, YAML validity, large files

## Code Style Guidelines

### Python (Backend)
- **Formatting**: Black with 100 character line length
- **Style**: PEP 8 compliant
- **Naming**: snake_case for functions/variables, PascalCase for classes
- **Imports**: Standard library → third-party → local modules
- **Error handling**: Use HTTPException for API errors, proper try/except blocks
- **Async**: Use async/await with FastAPI and SQLAlchemy
- **Type hints**: Include type annotations for function parameters and return values

### TypeScript/React (Frontend)
- **Strict mode**: Enabled with no unused locals/parameters
- **Naming**: PascalCase for components, camelCase for props/variables
- **Imports**: React → third-party → local (@/ alias for src/)
- **Components**: Use functional components with hooks
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Path aliases**: @/ for src/ directory
- **Error handling**: Use ErrorBoundary for React errors

### General
- **Commits**: Imperative form, 50 char summary + detailed explanation
- **Tests**: pytest for backend, descriptive test names with docstrings
- **Documentation**: Include docstrings for complex functions