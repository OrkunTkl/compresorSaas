# Compressor Management Platform

A full-stack web application for companies that operate and maintain industrial compressors. The platform centralizes compressor management, maintenance operations and planning, teams, users, inventory, notifications, reports, API access, and IoT integrations in a single system.

🚧 **Under Active Development** — features and architecture may evolve.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Main Features](#main-features)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Authentication & Authorization](#authentication--authorization)
- [Database & Data Models](#database--data-models)
- [Background Tasks](#background-tasks)
- [API](#api)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Git & Repository Hygiene](#git--repository-hygiene)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Performance & Scalability](#performance--scalability)
- [Roadmap](#roadmap)
- [Screenshots](#screenshots)
- [Project Status](#project-status)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Compressor Management Platform is designed for organizations that need a single, structured place to track their compressor fleet, plan and record maintenance work, coordinate teams, manage spare-parts inventory, and stay informed through notifications and reports. The system is built as a decoupled frontend/backend application communicating over a REST API.

## Tech Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS

**Backend**
- Python
- Django
- Django REST Framework
- Celery

**Database**
- SQLite (local development)

**Architecture**
- REST API communication between frontend and backend
- Celery for background/asynchronous task processing

## Main Features

### 1. Compressor Management
- Create compressors
- Edit compressor information
- View compressor details
- Manage compressor-related data
- Monitor compressor information from the dashboard

### 2. Maintenance Management
- Create maintenance plans
- Edit maintenance plans
- Track maintenance history
- Manage maintenance operations
- Track maintenance-related tasks

### 3. Dashboard
- Centralized operational dashboard
- System overview
- Compressor-related information
- Maintenance information
- Reports and analytics

### 4. Team Management
- Create teams
- Manage team members
- Add members to teams
- Manage users
- Role-based permissions

### 5. Inventory / Stock Management
- Manage stock
- Track spare parts and inventory
- Manage stock-related records

### 6. Notifications
- System notifications
- Maintenance-related notifications
- Task-related notifications

### 7. Reports
- Generate reports
- Maintenance reports
- Operational reporting
- Reporting-related services

### 8. IoT Management
- IoT device management
- Device-related records
- IoT integration support

### 9. Integrations
- Integration management
- External system integration support

### 10. Authentication and Security
- User authentication
- Role-based authorization
- API key management
- Permission management

## Project Structure

```
compresor/
├── backend/
│   ├── config/
│   ├── core/
│   │   ├── migrations/
│   │   ├── models/
│   │   ├── permissions/
│   │   ├── serializers/
│   │   ├── services/
│   │   └── views/
│   ├── celery_app.py
│   └── manage.py
│
├── frontend/
│   ├── components/
│   │   ├── Admin/
│   │   └── Landing/
│   └── src/
│       └── app/
│           ├── auth/
│           ├── dashboard/
│           └── landing/
│
├── .gitignore
└── README.md
```

**`backend/`** — Django project that exposes the REST API. It contains the core domain logic: models, serializers, permission classes, services, and views, organized under the `core` app, along with Django configuration (`config/`) and the Celery entry point (`celery_app.py`).

**`frontend/`** — Next.js application responsible for the user interface, including admin and landing-page components and the app's routed pages (authentication, dashboard, landing) under `src/app/`.

## Architecture

```
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ Next.js / React /   │
                    │     TypeScript      │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │ Django / DRF        │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
          ┌───────────────┐         ┌───────────────┐
          │   Database    │         │    Celery     │
          │ SQLite / DB   │         │ Background    │
          │               │         │ Tasks         │
          └───────────────┘         └───────────────┘
```

- **Frontend** — Renders the UI and communicates with the backend exclusively through the REST API.
- **Backend** — Django + Django REST Framework layer that implements business logic, authentication/authorization, and exposes API endpoints to the frontend.
- **Database** — Stores persistent application data (SQLite for local development).
- **Celery** — Handles background and asynchronous processing outside the request/response cycle.

## Authentication & Authorization

The backend includes:
- User management
- Role-based permissions
- API key management
- Permission classes / permission logic
- Protected application functionality

> A specific authentication library is not documented here and should be added once confirmed.

## Database & Data Models

The backend contains domain models covering areas such as:
- Users
- Teams
- Companies
- Compressors
- Maintenance
- Maintenance history
- Inventory / stock
- Notifications
- Subscriptions
- Integrations
- IoT devices
- Tasks
- API keys
- Webhooks
- Auditing

Django migrations are committed to the repository so the database schema can be reproduced consistently across environments.

## Background Tasks

Celery is used for asynchronous and background processing, including:
- Asynchronous processing outside the request/response cycle
- Background operations
- Maintenance-related processing
- Long-running tasks

Specific scheduled jobs are not documented here.

## API

The Django REST Framework backend exposes API endpoints covering the application's main domains, including:
- Authentication and users
- Companies
- Compressors
- Maintenance
- Teams
- Tasks
- Inventory
- Notifications
- Reports
- IoT devices
- Integrations
- API keys

> Specific endpoint URLs are not documented here.

## Environment Variables

Environment variables must be stored locally (e.g., in a `.env` file) and **never committed** to the repository.

Example:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=your-database-url
```

Real secrets, API keys, passwords, tokens, and credentials must never be committed to version control.

It is recommended to maintain a `.env.example` file listing the required environment variables (without real values) so other contributors know what to configure.

## Getting Started

### Prerequisites
- Python 3.13+
- Node.js
- npm
- Git

### Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows**
```bash
venv\Scripts\activate
```

**macOS/Linux**
```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

> If `requirements.txt` is not yet present in the repository, this file should be created to list backend dependencies.

Apply migrations and run the development server:

```bash
python manage.py migrate
python manage.py runserver
```

The backend will be available at: `http://127.0.0.1:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## Development Workflow

1. Create a feature branch
2. Implement the feature
3. Test locally
4. Review changes
5. Commit changes
6. Push the branch
7. Open a pull request

```bash
git checkout -b feature/new-feature
```

> A CI/CD pipeline is not currently documented for this project.

## Git & Repository Hygiene

The repository intentionally excludes generated and sensitive files. The following should never be committed:

- `.env`, `.env.local`
- API keys, passwords, secret keys, access tokens
- Database credentials
- `node_modules/`
- `__pycache__/`
- `*.pyc`
- Local SQLite database files
- Build output
- Next.js generated files

A `.gitignore` file is used to prevent these files from being tracked.

## Security

- Never commit secrets
- Never expose API keys
- Never commit production credentials
- Use environment variables for sensitive configuration
- Rotate credentials immediately if they are accidentally exposed

## Testing

The backend contains Django application tests. Test coverage should be expanded as the project grows. No additional testing framework beyond Django's built-in testing capabilities is currently documented.

## Deployment

The project is not currently deployed. Production deployment would require:

- Production database
- Secure environment variables
- Proper Django production settings
- Static file configuration
- Frontend production build
- Background task infrastructure for Celery
- Proper domain and HTTPS configuration

> This section describes production deployment guidance / future work, not current functionality.

## Performance & Scalability

Possible scalability considerations for future work:

- Background processing with Celery
- Database optimization
- API pagination where appropriate
- Caching where appropriate
- Monitoring
- Production-grade database infrastructure

> These are considerations, not currently implemented features unless stated elsewhere.

## Roadmap

Planned or potential future improvements:

- Production database support
- Advanced IoT monitoring
- Real-time compressor monitoring
- Advanced analytics
- Predictive maintenance
- More detailed reporting
- Improved notification workflows
- Cloud deployment
- Automated background workflows
- Enhanced monitoring and observability

> These items represent future improvements and are not existing functionality.

## Screenshots

<!-- Add dashboard screenshot here -->
<!-- Add compressor management screenshot here -->
<!-- Add maintenance management screenshot here -->

Screenshots can be added here once available.

## Project Status

🚧 **Under Active Development** — this project is actively being developed, and features and architecture may evolve over time.

## Contributing

Contribution guidelines can be added once the project becomes public or collaborative.

## License

This project is currently private and is not licensed for redistribution.
