# Personal Finance Tracker

## Overview

This is a full-stack personal finance tracking application built with React, Express, and Firebase. The application allows users to manage their expenses, track budgets, and visualize financial data through an intuitive dashboard interface. It uses Firebase for authentication and data storage, with a modern UI built using shadcn/ui components and Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: Firebase Firestore (NoSQL document database)
- **Authentication**: Firebase Authentication
- **API Design**: RESTful API with `/api` prefix
- **Development**: Hot reload with Vite middleware integration

### Data Storage Solutions
- **Primary Database**: Firebase Firestore for real-time data synchronization
- **Authentication**: Firebase Auth for user management
- **Collections**: 
  - `transactions` - User financial transactions
  - `budgets` - User budget configurations
  - `categories` - Expense categorization
- **Schema Validation**: Zod schemas for type-safe data validation

## Key Components

### Authentication System
- Firebase Authentication with email/password
- Protected routes with authentication guards
- User session management with React hooks
- Form validation using React Hook Form and Zod

### Transaction Management
- CRUD operations for financial transactions
- Category-based expense tracking (food, transport, entertainment, etc.)
- Income and expense type classification
- Real-time data updates with TanStack Query

### Dashboard & Analytics
- Statistical overview cards (balance, income, expenses, savings)
- Recent transactions display
- Expense category breakdown visualization
- Responsive design for mobile and desktop

### UI/UX Features
- Modern, accessible design with shadcn/ui components
- Dark/light theme support via CSS variables
- Toast notifications for user feedback
- Modal dialogs for data entry
- Loading states and error handling

## Data Flow

1. **Authentication Flow**: User signs in via Firebase Auth → React context updates → Protected routes become accessible
2. **Data Fetching**: TanStack Query manages API calls → Firebase Firestore queries → Real-time data synchronization
3. **State Management**: Server state via React Query, local UI state via React hooks
4. **Form Submission**: React Hook Form → Zod validation → Firebase API calls → Query cache invalidation → UI updates

## External Dependencies

### Core Dependencies
- **Firebase SDK**: Authentication, Firestore database, real-time updates
- **React Ecosystem**: React, React DOM, React Hook Form, TanStack Query
- **UI Libraries**: Radix UI primitives, Lucide React icons, class-variance-authority
- **Validation**: Zod for runtime type checking and form validation
- **Styling**: Tailwind CSS, clsx for conditional classes
- **Development**: Vite, TypeScript, ESBuild

### Database Configuration
- Drizzle ORM configured for PostgreSQL (future migration path)
- Current implementation uses Firebase Firestore
- Schema definitions in `shared/schema.ts` for type safety

## Deployment Strategy

### Build Process
- **Development**: `npm run dev` - Vite dev server with hot reload
- **Production Build**: `npm run build` - Vite build + ESBuild server bundling
- **Output**: Static assets in `dist/public`, server bundle in `dist/index.js`

### Platform Configuration
- **Target**: Replit deployment with autoscale
- **Port**: External port 80, internal port 5000
- **Environment**: Node.js 20, PostgreSQL 16 modules available
- **Assets**: Client files served from `dist/public`

### Environment Variables
- Firebase configuration via environment variables
- Database URL for future PostgreSQL integration
- Development/production environment detection

## Changelog

```
Changelog:
- June 23, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```