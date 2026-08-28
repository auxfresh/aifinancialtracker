# AI Finance

A modern, full-stack financial tracking application built with TypeScript, React, and Express. Manage your income and expenses, visualize spending patterns, and gain insights into your financial health through an intuitive dashboard and comprehensive reports.

## Overview

AI Finance is a personal finance management application that enables users to track transactions, categorize expenses, monitor budgets, and analyze spending habits through interactive visualizations. The application features user authentication via Firebase, real-time data synchronization, and multiple export options for financial data.

## What It Does

- **Transaction Management**: Record and manage income and expense transactions with categories and dates
- **Dashboard View**: Get a quick overview of your financial status with stats cards, recent transactions, and expense category breakdowns
- **Financial Reports**: Analyze your finances with interactive charts including monthly income vs. expenses, overall income/expense ratios, and category-based expense breakdowns
- **Data Export**: Export your transaction data in multiple formats (CSV, PDF, TXT)
- **User Authentication**: Secure login and registration using Firebase authentication
- **Responsive Design**: Full mobile and desktop support with adaptive UI

## Key Features

- **User Accounts**: Firebase-based authentication with email and password
- **Transaction Tracking**: Add, view, and manage financial transactions with:
  - Multiple categories (food, transport, entertainment, utilities, healthcare, shopping, other)
  - Income and expense classifications
  - Customizable descriptions and dates
- **Dashboard Analytics**: 
  - Total income, expenses, and balance statistics
  - Recent transaction list
  - Expense breakdown by category
- **Advanced Reporting**:
  - Monthly income vs. expenses bar charts (last 6 months)
  - Overall income/expense pie charts
  - Expense category breakdown visualization
- **Data Export**: Generate reports in CSV, PDF, and TXT formats
- **Responsive Interface**: Mobile-friendly design with sidebar navigation

## Technologies & Frameworks

- **Frontend**:
  - React 18 with TypeScript
  - Vite (build tool)
  - TailwindCSS (styling)
  - Radix UI (component library)
  - React Query (state management)
  - Recharts (data visualization)
  - Wouter (routing)

- **Backend**:
  - Express.js
  - TypeScript
  - Drizzle ORM (database interaction)
  - Zod (validation)

- **Database**:
  - Neon (PostgreSQL serverless)
  - Drizzle Kit (schema management)

- **Authentication & Storage**:
  - Firebase (authentication and data storage)

- **Development**:
  - Node.js
  - npm

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Neon database account (optional, for PostgreSQL support)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/auxfresh/aifinancialtracker.git
   cd aifinancialtracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration** (see Configuration section below)

4. **Start development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5000`

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Start production server**:
   ```bash
   npm start
   ```

## Project Structure

```
aifinancialtracker/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   │   ├── auth.tsx             # Authentication page (login/register)
│   │   │   ├── dashboard.tsx        # Main dashboard view
│   │   │   ├── transactions.tsx     # Transactions management page
│   │   │   ├── reports.tsx          # Financial reports and analytics
│   │   │   └── not-found.tsx        # 404 page
│   │   ├── components/              # Reusable UI components
│   │   │   ├── sidebar.tsx          # Navigation sidebar
│   │   │   ├── stats-cards.tsx      # Financial stats display
│   │   │   ├── recent-transactions.tsx # Transaction list
│   │   │   ├── expense-categories.tsx  # Category breakdown
│   │   │   ├── add-transaction-modal.tsx # Transaction form
│   │   │   └── ui/                  # Radix UI component library
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── use-auth.ts          # Authentication state management
│   │   ├── lib/                     # Utility functions
│   │   │   ├── firebase.ts          # Firebase integration
│   │   │   ├── export.ts            # Data export utilities
│   │   │   └── queryClient.ts       # React Query configuration
│   │   ├── App.tsx                  # Main app component with routing
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Global styles
│   └── index.html                   # HTML template
│
├── server/                          # Express backend
│   ├── index.ts                     # Server entry point
│   ├── routes.ts                    # API route definitions (placeholder)
│   ├── storage.ts                   # Storage interface and in-memory implementation
│   └── vite.ts                      # Vite dev server configuration
│
├── shared/                          # Shared code between client and server
│   └── schema.ts                    # Zod validation schemas for:
│                                    # - Users
│                                    # - Transactions
│                                    # - Budgets
│                                    # - Categories
│                                    # - Authentication
│
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # TailwindCSS configuration
├── components.json                  # Radix UI components config
├── drizzle.config.ts                # Database schema configuration
├── postcss.config.js                # PostCSS configuration
└── LICENSE                          # Proprietary license
```

## Basic Usage

### Starting the Application

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5000`

### Registering a User

1. Click on "Register" on the authentication page
2. Enter your name, email, and password
3. Confirm your password and submit
4. You will be redirected to the dashboard upon successful registration

### Adding a Transaction

1. From the dashboard, click the "+ Add Transaction" button
2. Fill in the transaction details:
   - Description
   - Amount
   - Category (food, transport, entertainment, utilities, healthcare, shopping, other)
   - Type (income or expense)
   - Date
3. Click "Save" to record the transaction

### Viewing Reports

1. Navigate to the "Reports" page from the sidebar
2. View your financial data through:
   - Monthly income vs. expenses bar chart
   - Overall income/expense pie chart
   - Expense breakdown by category

### Exporting Data

1. From the dashboard, click the "Export" button
2. Choose your preferred format:
   - **CSV**: Spreadsheet format for use in Excel or Google Sheets
   - **PDF**: Professional document format
   - **TXT**: Plain text format

## Configuration & Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Database Configuration (if using PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Application Environment
NODE_ENV=development
```

### Firebase Setup

1. Create a Firebase project at [https://firebase.google.com/](https://firebase.google.com/)
2. Enable Email/Password authentication in Firebase Console
3. Create a Firestore database
4. Copy your Firebase configuration credentials to your `.env` file

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database schema changes (Drizzle) |

## API Routes

Currently, the backend serves as a placeholder with the following structure:

- All routes are prefixed with `/api`
- Routes to be implemented for:
  - User authentication endpoints
  - Transaction CRUD operations
  - Budget management
  - Category management

The application currently uses Firebase for data persistence and authentication.

## Data Validation

The application uses Zod for runtime data validation. Key schemas include:

- **User**: Email, name, creation timestamp
- **Transaction**: Amount (minimum 0.01), description, category, type, date
- **Budget**: Category, amount, period (monthly/weekly/yearly)
- **Authentication**: Email validation, password confirmation, minimum requirements

## License

This project is proprietary and distributed under a custom license. See the [LICENSE](./LICENSE) file for details. Commercial use requires written permission from the copyright holder.

---

## Important Disclaimer

**⚠️ Financial Information Disclaimer**

AI Finance is designed as a personal finance tracking tool for informational and organizational purposes only. It is not intended to provide:
- Professional financial advice
- Investment recommendations
- Tax guidance
- Accounting services

Users are responsible for:
- The accuracy of all data entered into the application
- Verifying calculations and reports independently
- Consulting with qualified financial professionals for important financial decisions
- Maintaining their own financial records and backups

The developers and copyright holder assume no liability for:
- Financial decisions made based on data in this application
- Loss or corruption of financial data
- Inaccuracies in calculations or reports
- Use of exported data in any financial or legal proceedings

This application should not be used as the sole basis for financial planning or decision-making. Always consult with licensed financial advisors before making significant financial decisions.

---

**For more information or support**, please refer to the repository issues or documentation files.
