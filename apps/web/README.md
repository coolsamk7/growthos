# GrowthOS Web UI Template

A clean, organized UI template built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

## 🚀 Quick Start

```bash
# Install dependencies (from root)
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Run linter
yarn lint
```

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layout/      # Layout components (MainLayout, etc.)
│   │   └── common/      # Shared/reusable components
│   │
│   ├── pages/
│   │   ├── home/        # Home page
│   │   ├── dashboard/   # Dashboard page
│   │   └── learning-path/ # Learning path page
│   │
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services and data fetching
│   ├── store/           # State management
│   └── utils/           # Utility functions and helpers
│
├── public/              # Static assets
├── dist/                # Production build output
└── vite.config.ts       # Vite configuration
```

## 🎨 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Language**: TypeScript 6
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Linting**: ESLint (shared config from `@growthos/eslintconfig`)
- **Formatting**: Prettier (shared config)
- **TypeScript Config**: Extended from `@growthos/tsconfig`

## 🧩 Adding shadcn/ui Components

```bash
# Add a specific component
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog

# Components will be added to src/components/ui/
```

## 📄 Available Pages

- **Home** - Landing/welcome page (`src/pages/home/HomePage.tsx`)
- **Dashboard** - User dashboard (`src/pages/dashboard/DashboardPage.tsx`)
- **Learning Path** - Learning journeys (`src/pages/learning-path/LearningPathPage.tsx`)

## 🔧 Path Aliases

The project uses `@/` alias for clean imports:

```typescript
import { MainLayout } from '@/components/layout'
import { HomePage } from '@/pages/home'
import { LoadingSpinner } from '@/components/common'
import { cn } from '@/utils'
```

## 🎯 Branding

- **Name**: GrowthOS
- **Tagline**: "Learn Smarter, Not Harder"
- **Subtitle**: "Your Personal Learning OS"

## 📱 Responsive Design

The application is fully responsive using Tailwind CSS responsive utilities.

## 📄 License

Private - All rights reserved © 2026 GrowthOS
