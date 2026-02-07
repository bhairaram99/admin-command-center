# AI Humanizer - Admin Command Center

## Project Overview

This is the admin dashboard for the AI Humanizer platform. It provides a comprehensive interface for managing users, subscription plans, token add-ons, AI settings, and payment configurations.

## Features

- **Dashboard**: Overview of users, revenue, and token usage
- **User Management**: View, block, and manage user accounts
- **Plans Management**: Create and manage subscription plans
- **Token Add-ons**: Configure additional token packages
- **AI Settings**: Configure AI providers and settings
- **Payment Settings**: Manage payment gateways and currencies
- **Token Rules**: Set token limits for different user types

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the admin-command-center directory
cd admin-command-center

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The admin panel will be available at `http://localhost:8080`

## How to Access

1. Navigate to the admin login page
2. Enter admin credentials (configured in backend)
3. Access all administrative features

## Technologies Used

This project is built with:

- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **TanStack Query** - Data fetching and caching

## Project Structure

```
admin-command-center/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # Auth context
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and API
│   ├── pages/          # Admin page components
│   └── test/           # Test files
├── public/             # Static assets
└── package.json        # Dependencies
```

## Deployment

Build the project for production:

```sh
npm run build
```

The `dist` folder will contain the production-ready files.

## Environment Variables

Configure the backend API URL if needed in your `.env` file or build configuration.

## License

Private - All rights reserved
