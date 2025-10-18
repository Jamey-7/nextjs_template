# Recommended Next.js Template Roadmap

## 📍 Current Status: Ready to Begin

**Last Updated:** October 18, 2024  
**Next.js Version:** 15.5.6 (Latest)  
**Authentication Pattern:** 2025 DAL (Data Access Layer) - CVE-2025-29927 Compliant  
**Status:** ⏳ Template Structure Ready - Implementation Pending

This template implements **modern 2025 authentication best practices** using the Data Access Layer (DAL) pattern, following the security guidelines established after CVE-2025-29927.

---

## 🎯 Quick Navigation

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Phase 1: Foundation & DAL Setup](#phase-1-foundation--dal-setup-critical)
- [Phase 2: Authentication System](#phase-2-authentication-system)
- [Phase 3: UI Foundation System](#phase-3-ui-foundation-system)
- [Phase 4: Protected Routes](#phase-4-protected-routes--layout-gates)
- [Phase 5: Database Operations](#phase-5-database-operations)
- [Phase 6: Client State Management](#phase-6-client-state-management)
- [Phase 7: Testing & Quality](#phase-7-testing--quality)
- [Phase 8: Deployment](#phase-8-deployment--documentation)

---

## 🏗️ Architecture Overview

### The 2025 Authentication Pattern

**Critical Context**: In March 2025, CVE-2025-29927 exposed a vulnerability in Next.js middleware-based authentication. The industry shifted to the **Data Access Layer (DAL)** pattern for auth checks.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ① MIDDLEWARE LAYER                            │
│                  (src/middleware.ts)                             │
├─────────────────────────────────────────────────────────────────┤
│  PURPOSE: Token refresh ONLY (not auth checks)                  │
│  • Detects expired access tokens                                │
│  • Calls Supabase refreshSession()                              │
│  • Updates httpOnly cookies                                     │
│  • Rate limiting for API routes                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │ ✅ Fresh cookies
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              ② DATA ACCESS LAYER (DAL)                           │
│                  (src/lib/dal.ts)                               │
├─────────────────────────────────────────────────────────────────┤
│  PURPOSE: Centralized auth logic                                │
│  • verifySession() - validates token with Supabase              │
│  • getUser() - returns current user or null                     │
│  • Uses React cache() to prevent duplicate calls                │
└────────────────────────┬────────────────────────────────────────┘
                         │ ✅ User data
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│           ③ SERVER COMPONENT LAYOUT GATE                         │
│              (src/app/(dashboard)/layout.tsx)                   │
├─────────────────────────────────────────────────────────────────┤
│  PURPOSE: Enforce access control                                │
│  • Calls getUser() from DAL                                     │
│  • If no user → redirect('/login')                              │
│  • Can't be bypassed (server-side only)                         │
│  • Zero flicker (decision before render)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ ✅ Authorized
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ④ PROTECTED PAGE RENDERS                        │
│               (src/app/(dashboard)/page.tsx)                    │
├─────────────────────────────────────────────────────────────────┤
│  • Fully rendered HTML (SSR)                                    │
│  • No loading states or flicker                                 │
│  • SEO-friendly                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

**✅ DO (2025 Pattern)**:
- Use DAL for authentication checks
- Use middleware ONLY for token refresh
- Store tokens in httpOnly cookies
- Protect routes with Server Component layout gates
- Use Server Actions for mutations

**❌ DON'T (Old Pattern)**:
- Don't check auth in middleware
- Don't store tokens in localStorage
- Don't rely on client-side route protection
- Don't use getServerSideProps (outdated)

---

## 📦 Tech Stack

### Core Framework
- **Next.js 15.5.6** - React framework with App Router
- **React 19.1.0** - UI library with Server Components
- **TypeScript 5.x** - Type safety (strict mode)
- **Turbopack** - Fast bundler (Next.js 15 default)

### Authentication & Database
- **Supabase** - Backend as a Service
  - `@supabase/supabase-js: ^2.39.0` - Main client
  - `@supabase/ssr: ^0.1.0` - SSR auth utilities
- **Authentication**: Email/password, OAuth ready
- **Database**: Postgres with Row Level Security
- **Storage**: File uploads (optional)

### State Management
- **Zustand 4.5.x** - Client state (lightweight, simple)
  - NOT for auth state (Supabase handles that)
  - Use for: UI state, preferences, temporary data

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS (already installed)
- **shadcn/ui** - Copy-paste component library
  - `@radix-ui/*` - Accessible primitives
- **lucide-react: ^0.344.0** - Icon library
- **next-themes: ^0.2.1** - Dark mode support
- **clsx: ^2.1.0** - Conditional classes
- **tailwind-merge: ^2.2.1** - Merge Tailwind classes

### Forms & Validation
- **react-hook-form: ^7.50.0** - Form management
- **zod: ^3.22.4** - Schema validation
- **@hookform/resolvers: ^3.3.4** - Connect hook-form + zod

### Utilities
- **date-fns: ^3.3.0** - Date formatting
- **jose: ^5.2.0** - JWT utilities (optional, for custom auth)

### Development Tools
- **ESLint 9.x** - Linting (already configured)
- **Prettier** - Code formatting (recommended)
- **Playwright** - E2E testing (Phase 7)
- **Jest** - Unit testing (Phase 7)

---

## 📁 Project Structure

```
nextjs_template/
├── src/
│   ├── app/                        # App Router (Next.js 15)
│   │   ├── (auth)/                # Route group - public auth pages
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── actions.ts     # Server Actions
│   │   │   ├── signup/
│   │   │   │   ├── page.tsx
│   │   │   │   └── actions.ts
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   └── verify-email/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/           # Route group - protected
│   │   │   ├── layout.tsx         # 🔒 AUTH GATE (uses DAL)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   └── actions.ts
│   │   │   └── notes/             # Example CRUD
│   │   │       ├── page.tsx
│   │   │       ├── [id]/
│   │   │       │   └── page.tsx
│   │   │       └── actions.ts
│   │   │
│   │   ├── api/                   # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── set/
│   │   │   │   │   └── route.ts   # Set httpOnly cookies
│   │   │   │   ├── signout/
│   │   │   │   │   └── route.ts   # Clear cookies
│   │   │   │   └── confirm/
│   │   │   │       └── route.ts   # Email verification
│   │   │   └── ...
│   │   │
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Homepage (smart routing)
│   │   ├── globals.css            # Global styles
│   │   └── error.tsx              # Error page
│   │
│   ├── components/                # Reusable components
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── auth/                  # Auth-specific
│   │   │   ├── login-form.tsx
│   │   │   ├── signup-form.tsx
│   │   │   └── reset-password-form.tsx
│   │   ├── layout/                # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── theme-toggle.tsx
│   │   └── providers/
│   │       └── theme-provider.tsx
│   │
│   ├── lib/                       # Core utilities
│   │   ├── dal.ts                 # 🔑 DATA ACCESS LAYER (CRITICAL)
│   │   ├── supabase/             # Supabase clients
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   └── middleware.ts     # Token refresh utilities
│   │   ├── utils.ts              # Helper functions (cn, etc.)
│   │   └── validations.ts        # Zod schemas
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-user.ts           # Auth hooks
│   │   ├── use-toast.ts          # Toast notifications
│   │   └── use-media-query.ts    # Responsive helpers
│   │
│   ├── stores/                    # Zustand stores
│   │   ├── auth-store.ts         # Client auth sync
│   │   ├── ui-store.ts           # UI state (sidebar, modals)
│   │   └── user-store.ts         # User preferences
│   │
│   ├── types/                     # TypeScript types
│   │   ├── database.ts           # Supabase generated types
│   │   ├── supabase.ts           # Supabase client types
│   │   └── index.ts              # Common types
│   │
│   └── middleware.ts              # 🔄 Next.js middleware (token refresh)
│
├── supabase/
│   ├── migrations/               # Database migrations
│   │   └── 001_initial_schema.sql
│   ├── seed.sql                  # Seed data (optional)
│   └── config.toml               # Supabase config
│
├── tests/
│   ├── e2e/                      # Playwright E2E tests
│   │   ├── auth.spec.ts
│   │   └── dashboard.spec.ts
│   └── unit/                     # Jest unit tests
│       ├── dal.test.ts
│       └── validations.test.ts
│
├── public/
│   ├── favicon.ico
│   └── images/
│
├── docs/
│   ├── ARCHITECTURE.md           # DAL pattern explanation
│   ├── DEPLOYMENT.md             # Production setup
│   └── SUPABASE_SETUP.md         # Database configuration
│
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Template for .env.local
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── playwright.config.ts          # E2E testing config
├── jest.config.js                # Unit testing config
├── README.md
└── RECOMMENDED_ROADMAP.md        # This file
```

---

## ✅ Phase 1: Foundation & DAL Setup (CRITICAL)

**Status:** ⏳ Pending  
**Estimated Time:** 6-8 hours  
**Priority:** CRITICAL - Security foundation  
**Dependencies:** None

### 1.1 Install Core Packages

```bash
# Supabase (auth + database)
npm install @supabase/supabase-js @supabase/ssr

# State management
npm install zustand

# Form handling
npm install react-hook-form zod @hookform/resolvers

# UI utilities
npm install clsx tailwind-merge class-variance-authority

# Icons
npm install lucide-react

# Theme
npm install next-themes

# Date utilities
npm install date-fns
```

### 1.2 Environment Configuration

Create `.env.local`:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

Create `.env.example`:
```bash
# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 1.3 Create Supabase Clients

#### `src/lib/supabase/client.ts` - Browser Client
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

#### `src/lib/supabase/server.ts` - Server Client
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

#### `src/lib/supabase/middleware.ts` - Middleware Utilities
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => 
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshing the auth token
  await supabase.auth.getUser()

  return supabaseResponse
}
```

### 1.4 Create Data Access Layer (DAL) ⭐ MOST IMPORTANT

#### `src/lib/dal.ts` - The Security Foundation
```typescript
import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

/**
 * Data Access Layer (DAL) - 2025 Authentication Pattern
 * 
 * This is the CORRECT way to handle auth in Next.js 15.
 * 
 * Why DAL instead of middleware?
 * - CVE-2025-29927 vulnerability in middleware auth checks
 * - Server Components are more secure (can't be bypassed)
 * - Centralized auth logic (single source of truth)
 * - Better performance with React cache()
 * 
 * IMPORTANT: Always use getUser() for auth checks in Server Components.
 * Never check auth in middleware (security vulnerability).
 */

/**
 * Verify the current session by validating the access token
 * Uses React cache() to prevent duplicate calls in the same render
 */
export const verifySession = cache(async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value

  if (!accessToken) {
    return null
  }

  const supabase = await createClient()
  
  // Always use getUser() not getSession() in server code
  // getUser() validates the token with Supabase on every call
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
})

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export const getUser = cache(async () => {
  return await verifySession()
})

/**
 * Get user profile data from database
 * Only call this AFTER checking auth with getUser()
 */
export const getUserProfile = cache(async (userId: string) => {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
})
```

### 1.5 Create Middleware (Token Refresh ONLY)

#### `src/middleware.ts`
```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js Middleware - 2025 Pattern
 * 
 * PURPOSE: Token refresh ONLY
 * 
 * This middleware does NOT check authentication.
 * Auth checks happen in Server Components using the DAL.
 * 
 * Why?
 * - CVE-2025-29927: Middleware auth checks are vulnerable
 * - Middleware can only modify cookies (what it's designed for)
 * - Auth checks belong in Data Access Layer (DAL)
 */

export async function middleware(request: NextRequest) {
  // Update session (refresh expired tokens)
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 1.6 Create httpOnly Cookie API Routes

#### `src/app/api/auth/set/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'

/**
 * Set httpOnly cookies for authentication
 * Called by client-side auth store after successful login
 */
export async function POST(request: NextRequest) {
  try {
    const { access_token, refresh_token } = await request.json()

    if (!access_token) {
      return NextResponse.json(
        { error: 'Missing access token' },
        { status: 400 }
      )
    }

    const response = NextResponse.json({ success: true })

    const isProd = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax' as const,
      path: '/',
      secure: isProd,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }

    response.cookies.set('sb-access-token', access_token, cookieOptions)

    if (refresh_token) {
      response.cookies.set('sb-refresh-token', refresh_token, cookieOptions)
    }

    return response
  } catch (error) {
    console.error('Error setting auth cookies:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

#### `src/app/api/auth/signout/route.ts`
```typescript
import { NextResponse } from 'next/server'

/**
 * Clear authentication cookies on signout
 */
export async function POST() {
  const response = NextResponse.json({ success: true })

  // Clear both cookies
  response.cookies.set('sb-access-token', '', { maxAge: 0 })
  response.cookies.set('sb-refresh-token', '', { maxAge: 0 })

  return response
}
```

### 1.7 Create Utility Functions

#### `src/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes with clsx
 * Prevents style conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format error messages for user display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}

/**
 * Sleep utility for testing
 */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### 1.8 TypeScript Configuration

Update `tsconfig.json` with path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true
  }
}
```

### 1.9 Checklist

- [ ] Install all core packages
- [ ] Create `.env.local` with Supabase credentials
- [ ] Create `.env.example` template
- [ ] Create browser Supabase client (`lib/supabase/client.ts`)
- [ ] Create server Supabase client (`lib/supabase/server.ts`)
- [ ] Create middleware utilities (`lib/supabase/middleware.ts`)
- [ ] **Create Data Access Layer (`lib/dal.ts`)** ⭐
- [ ] Create Next.js middleware (`middleware.ts`)
- [ ] Create `/api/auth/set` route
- [ ] Create `/api/auth/signout` route
- [ ] Create utility functions (`lib/utils.ts`)
- [ ] Update `tsconfig.json` with path aliases
- [ ] Test: Can create Supabase client without errors
- [ ] Test: Middleware doesn't break existing pages

**Time Spent:** ___ hours  
**Status:** ⏳ Pending

---

## ✅ Phase 2: Authentication System

**Status:** ⏳ Pending  
**Estimated Time:** 8-10 hours  
**Priority:** HIGH  
**Dependencies:** Phase 1 complete

### 2.1 Create Login Page with Server Actions

#### `src/app/(auth)/login/page.tsx`
```typescript
import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
```

#### `src/app/(auth)/login/actions.ts`
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
```

#### `src/components/auth/login-form.tsx`
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/(auth)/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await login(formData)

    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
      setIsLoading(false)
    }
    // If successful, Server Action will redirect
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}
```

### 2.2 Create Signup Page

#### `src/app/(auth)/signup/page.tsx`
```typescript
import { Metadata } from 'next'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
}

export default function SignupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
```

#### `src/app/(auth)/signup/actions.ts`
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/confirm`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/verify-email')
}
```

### 2.3 Email Verification

#### `src/app/api/auth/confirm/route.ts`
```typescript
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      redirect(next)
    }
  }

  // Redirect to error page if verification fails
  redirect('/error')
}
```

#### `src/app/(auth)/verify-email/page.tsx`
```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Check your email to verify your account',
}

export default function VerifyEmailPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We've sent you a verification link. Please check your email to continue.
          </p>
        </div>
      </div>
    </div>
  )
}
```

### 2.4 Password Reset Flow

#### `src/app/(auth)/reset-password/page.tsx`
```typescript
import { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your password',
}

export default function ResetPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a reset link
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
```

### 2.5 Validation Schemas

#### `src/lib/validations.ts`
```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
```

### 2.6 Checklist

- [ ] Create login page (`(auth)/login/page.tsx`)
- [ ] Create login Server Action (`(auth)/login/actions.ts`)
- [ ] Create login form component (`components/auth/login-form.tsx`)
- [ ] Create signup page (`(auth)/signup/page.tsx`)
- [ ] Create signup Server Action (`(auth)/signup/actions.ts`)
- [ ] Create signup form component
- [ ] Create email confirmation route (`api/auth/confirm/route.ts`)
- [ ] Create verify email page
- [ ] Create password reset page
- [ ] Create password reset form
- [ ] Create validation schemas (`lib/validations.ts`)
- [ ] Test: Login with valid credentials
- [ ] Test: Login with invalid credentials shows error
- [ ] Test: Signup sends verification email
- [ ] Test: Email verification link works
- [ ] Test: Password reset flow works

**Time Spent:** ___ hours  
**Status:** ⏳ Pending

---

## ✅ Phase 3: UI Foundation System

**Status:** ⏳ Pending  
**Estimated Time:** 10-12 hours  
**Priority:** HIGH  
**Dependencies:** Phase 1 complete

### 3.1 Install shadcn/ui and Configure Theming

#### Run shadcn/ui Initialization

```bash
npx shadcn@latest init
```

**Configuration Options:**
- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes

**What This Creates:**
- ✅ `src/app/globals.css` - Theme CSS variables (light/dark)
- ✅ `tailwind.config.ts` - Tailwind theme configuration
- ✅ `components.json` - shadcn/ui config
- ✅ `src/lib/utils.ts` - cn() utility function

#### Understanding the Theming System

shadcn/ui uses a **hybrid CSS + Tailwind approach**:

1. **CSS Variables** (in `globals.css`) define colors for light/dark modes
2. **Tailwind Config** maps those variables to Tailwind utilities
3. **Components** use Tailwind classes like `bg-primary`, `text-foreground`
4. **next-themes** toggles `.dark` class on `<html>` to switch themes

**The Flow:**
```
User clicks theme toggle
  ↓
next-themes adds/removes .dark class
  ↓
CSS variables update (--background, --primary, etc.)
  ↓
Tailwind classes automatically use new values
  ↓
Entire app re-colors instantly! ✨
```

#### Configure Tailwind Theme

The `npx shadcn@latest init` command creates this file. Verify it looks like this:

**`tailwind.config.ts`**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'], // ✅ Enable dark mode with class strategy
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ✅ Maps CSS variables to Tailwind utilities
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

#### Set Up Global Styles and Theme Variables

The init command also creates this file. Verify it includes the theme variables:

**`src/app/globals.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light mode colors - HSL values without hsl() wrapper */
    --background: 0 0% 100%;           /* White */
    --foreground: 222.2 84% 4.9%;      /* Dark gray text */
    
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    
    --primary: 221.2 83.2% 53.3%;      /* Blue */
    --primary-foreground: 210 40% 98%; /* Light text on blue */
    
    --secondary: 210 40% 96.1%;        /* Light gray */
    --secondary-foreground: 222.2 47.4% 11.2%;
    
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    
    --destructive: 0 84.2% 60.2%;      /* Red */
    --destructive-foreground: 210 40% 98%;
    
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    
    --radius: 0.5rem;                  /* Border radius */
  }
  
  .dark {
    /* Dark mode colors */
    --background: 222.2 84% 4.9%;      /* Dark background */
    --foreground: 210 40% 98%;         /* Light text */
    
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    
    --primary: 217.2 91.2% 59.8%;      /* Lighter blue */
    --primary-foreground: 222.2 47.4% 11.2%;
    
    --secondary: 217.2 32.6% 17.5%;    /* Dark gray */
    --secondary-foreground: 210 40% 98%;
    
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    
    --destructive: 0 62.8% 30.6%;      /* Darker red */
    --destructive-foreground: 210 40% 98%;
    
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**How to Use These Colors:**
```tsx
// In your components, use Tailwind classes:
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Click me
  </button>
  <div className="bg-card text-card-foreground border border-border rounded-lg p-4">
    Card content
  </div>
</div>
```

**Customizing Colors:**

To change the theme colors, modify the HSL values in `globals.css`:

```css
:root {
  /* Change primary to green instead of blue */
  --primary: 142.1 76.2% 36.3%;  /* Green */
  --primary-foreground: 355.7 100% 97.3%;
}
```

Use a tool like [HSL Color Picker](https://hslpicker.com/) to find HSL values.

### 3.2 Add Core UI Components

**Note**: The first time you add a component, shadcn/ui will automatically install `tailwindcss-animate` for animation utilities.

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add toast
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add separator
npx shadcn@latest add sheet
npx shadcn@latest add tabs
npx shadcn@latest add alert
npx shadcn@latest add badge
```

**What These Components Are:**
- `button` - Buttons with variants (primary, secondary, outline, ghost)
- `input` - Text input fields
- `label` - Form labels
- `card` - Container cards with header/content/footer
- `dialog` - Modal dialogs
- `form` - Form wrapper with react-hook-form integration
- `toast` - Toast notifications (success, error, info)
- `dropdown-menu` - Dropdown menus (like theme toggle)
- `avatar` - User avatar circles
- `separator` - Horizontal/vertical dividers
- `sheet` - Slide-out panels
- `tabs` - Tabbed interfaces
- `alert` - Alert banners
- `badge` - Small badges for status/counts

### 3.3 Theme Provider

#### `src/components/providers/theme-provider.tsx`
```typescript
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

#### `src/components/layout/theme-toggle.tsx`
```typescript
'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 3.4 Update Root Layout

#### `src/app/layout.tsx`
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Next.js Template',
    template: '%s | Next.js Template',
  },
  description: 'A modern Next.js template with authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 3.5 Toast Hook

#### `src/hooks/use-toast.ts`
```typescript
'use client'

// This is typically auto-generated by shadcn/ui
// Add custom toast utilities here if needed

import { toast as sonnerToast } from 'sonner'

export function useToast() {
  return {
    toast: sonnerToast,
  }
}

export { toast } from 'sonner'
```

### 3.6 Form Components with react-hook-form

#### Example Form Component
```typescript
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export function ExampleForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormDescription>
                We'll never share your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### 3.7 Checklist

- [ ] Run `npx shadcn@latest init` (creates theme files automatically)
- [ ] Verify `tailwind.config.ts` has color mappings to CSS variables
- [ ] Verify `globals.css` has light/dark theme CSS variables
- [ ] Understand how CSS variables + Tailwind work together
- [ ] Add 15+ core UI components via `npx shadcn@latest add`
- [ ] Create theme provider (`components/providers/theme-provider.tsx`)
- [ ] Create theme toggle component (`components/layout/theme-toggle.tsx`)
- [ ] Update root layout with theme provider
- [ ] Set up toast notifications
- [ ] Create example form with validation
- [ ] Test: Light mode displays correctly
- [ ] Test: Dark mode displays correctly
- [ ] Test: System theme preference works
- [ ] Test: Theme toggle switches instantly
- [ ] Test: Theme preference persists after refresh
- [ ] Test: Forms validate correctly
- [ ] Test: Toasts display properly
- [ ] Test: All shadcn/ui components respect theme

**Time Spent:** ___ hours  
**Status:** ⏳ Pending

---

## ✅ Phase 4: Protected Routes & Layout Gates

**Status:** ⏳ Pending  
**Estimated Time:** 6-8 hours  
**Priority:** HIGH  
**Dependencies:** Phases 1-3 complete

### 4.1 Smart Homepage (Server Component)

#### `src/app/page.tsx`
```typescript
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/dal'
import { LoginForm } from '@/components/auth/login-form'

/**
 * Smart Homepage - Routes based on auth state
 * 
 * This is a Server Component that decides what to show:
 * - Unauthenticated: Show login form
 * - Authenticated: Redirect to dashboard
 * 
 * Benefits:
 * - Zero flicker (decision on server)
 * - SEO friendly
 * - Secure (can't bypass client-side)
 */
export default async function HomePage() {
  const user = await getUser()

  // If authenticated, go to dashboard
  if (user) {
    redirect('/dashboard')
  }

  // Show login for unauthenticated users
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
```

### 4.2 Protected Dashboard Layout (Auth Gate)

#### `src/app/(dashboard)/layout.tsx` ⭐ CRITICAL
```typescript
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/dal'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'

/**
 * Dashboard Layout with Auth Gate
 * 
 * This is the NEW 2025 pattern for protecting routes.
 * 
 * How it works:
 * 1. Server Component calls getUser() from DAL
 * 2. If no user, redirect to login
 * 3. If user exists, render protected content
 * 
 * Why Server Component instead of middleware?
 * - CVE-2025-29927: Middleware auth is vulnerable
 * - Can't be bypassed by client
 * - Zero flicker (decision before HTML sent)
 * - Better performance with React cache()
 * 
 * IMPORTANT: This is the security gate for ALL dashboard routes.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ✅ AUTH CHECK - Uses DAL (secure, can't be bypassed)
  const user = await getUser()

  if (!user) {
    // Not authenticated - redirect to homepage
    redirect('/')
  }

  // ✅ User is authenticated - render protected layout
  return (
    <div className="h-screen overflow-hidden">
      <div className="flex h-full">
        <Sidebar user={user} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header user={user} />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
```

### 4.3 Dashboard Page

#### `src/app/(dashboard)/dashboard/page.tsx`
```typescript
import { Metadata } from 'next'
import { getUser, getUserProfile } from '@/lib/dal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your dashboard',
}

export default async function DashboardPage() {
  // No need to check auth here - layout does it
  const user = await getUser()
  const profile = user ? await getUserProfile(user.id) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### 4.4 Header Component

#### `src/components/layout/header.tsx`
```typescript
import { User } from '@supabase/supabase-js'
import { UserNav } from './user-nav'
import { ThemeToggle } from './theme-toggle'

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-6">
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}
```

### 4.5 Sidebar Component

#### `src/components/layout/sidebar.tsx`
```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Settings,
  User as UserIcon,
  FileText,
} from 'lucide-react'

interface SidebarProps {
  user: User
}

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Profile',
    icon: UserIcon,
    href: '/profile',
  },
  {
    label: 'Notes',
    icon: FileText,
    href: '/notes',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Next.js Template</h2>
      </div>
      <nav className="space-y-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent',
              pathname === route.href
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

### 4.6 User Navigation

#### `src/components/layout/user-nav.tsx`
```typescript
'use client'

import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'

interface UserNavProps {
  user: User
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    
    // Clear httpOnly cookies
    await fetch('/api/auth/signout', { method: 'POST' })
    
    router.push('/')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Account</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 4.7 Settings Page

#### `src/app/(dashboard)/settings/page.tsx`
```typescript
import { Metadata } from 'next'
import { getUser } from '@/lib/dal'
import { SettingsForm } from '@/components/settings/settings-form'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings',
}

export default async function SettingsPage() {
  const user = await getUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <SettingsForm user={user!} />
    </div>
  )
}
```

### 4.8 Checklist

- [ ] Create smart homepage (`app/page.tsx`)
- [ ] **Create dashboard layout with auth gate** ⭐
- [ ] Create dashboard page
- [ ] Create header component
- [ ] Create sidebar component
- [ ] Create user navigation dropdown
- [ ] Create settings page
- [ ] Test: Unauthenticated users redirected to login
- [ ] Test: Authenticated users can access dashboard
- [ ] Test: Sign out clears cookies and redirects
- [ ] Test: No flicker on protected routes
- [ ] Test: Theme toggle works in dashboard

**Time Spent:** ___ hours  
**Status:** ⏳ Pending

---

## ✅ Phase 5: Database Operations

**Status:** ⏳ Pending  
**Estimated Time:** 6-8 hours  
**Priority:** MEDIUM  
**Dependencies:** Phase 4 complete

### 5.1 Create Database Schema

#### `supabase/migrations/001_initial_schema.sql`
```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create notes table (example CRUD)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 5.2 Generate TypeScript Types

```bash
# Install Supabase CLI
npm install -D supabase

# Generate types from your database
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

#### `src/types/database.ts` (Generated)
```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
```

### 5.3 Notes List Page

#### `src/app/(dashboard)/notes/page.tsx`
```typescript
import { Metadata } from 'next'
import Link from 'next/link'
import { getUser } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { CreateNoteDialog } from '@/components/notes/create-note-dialog'

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Your notes',
}

export default async function NotesPage() {
  const user = await getUser()
  
  if (!user) {
    return null // Layout will redirect
  }

  const supabase = await createClient()

  // Fetch notes from database
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notes:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">
            Create and manage your notes
          </p>
        </div>
        <CreateNoteDialog />
      </div>

      {!notes || notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No notes yet. Create your first note!
            </p>
            <CreateNoteDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {note.content || 'No content'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 5.4 Notes Actions (Server Actions)

#### `src/app/(dashboard)/notes/actions.ts`
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'

export async function createNote(formData: FormData) {
  const user = await getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title) {
    return { error: 'Title is required' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: user.id,
      title,
      content,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/notes')
  return { success: true, note: data }
}

export async function updateNote(noteId: string, formData: FormData) {
  const user = await getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const supabase = await createClient()

  const { error } = await supabase
    .from('notes')
    .update({ title, content })
    .eq('id', noteId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/notes')
  revalidatePath(`/notes/${noteId}`)
  return { success: true }
}

export async function deleteNote(noteId: string) {
  const user = await getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/notes')
  redirect('/notes')
}
```

### 5.5 Note Detail Page

#### `src/app/(dashboard)/notes/[id]/page.tsx`
```typescript
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getUser } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'
import { EditNoteForm } from '@/components/notes/edit-note-form'
import { DeleteNoteButton } from '@/components/notes/delete-note-button'

export const metadata: Metadata = {
  title: 'Note',
  description: 'View and edit note',
}

export default async function NotePage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getUser()
  
  if (!user) {
    return null
  }

  const supabase = await createClient()

  const { data: note, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !note) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Note</h1>
        <DeleteNoteButton noteId={note.id} />
      </div>

      <EditNoteForm note={note} />
    </div>
  )
}
```

### 5.6 Checklist

- [ ] Create database migration (`supabase/migrations/001_initial_schema.sql`)
- [ ] Run migration with Supabase CLI
- [ ] Generate TypeScript types (`types/database.ts`)
- [ ] Create notes list page
- [ ] Create note detail page
- [ ] Create Server Actions for CRUD operations
- [ ] Create create note dialog component
- [ ] Create edit note form component
- [ ] Create delete note button component
- [ ] Test: Create a note
- [ ] Test: View note list
- [ ] Test: Edit a note
- [ ] Test: Delete a note
- [ ] Test: RLS policies prevent unauthorized access

**Time Spent:** ___ hours  
**Status:** ⏳ Pending

---

## ✅ Phase 6: Client State Management

**Status:** ⏳ Pending  
**Estimated Time:** 4-6 hours  
**Priority:** MEDIUM  
**Dependencies:** Phase 4 complete

### 6.1 Install Zustand

```bash
npm install zustand
```

### 6.2 Auth Store (Client Sync)

#### `src/stores/auth-store.ts`
```typescript
import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthState {
  user: User | null
  isLoading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  initialized: false,

  setUser: (user) => set({ user, isLoading: false }),

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    
    // Clear httpOnly cookies
    await fetch('/api/auth/signout', { method: 'POST' })
    
    set({ user: null })
  },

  initialize: async () => {
    if (get().initialized) return

    const supabase = createClient()

    // Get initial session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      set({ user: session.user, isLoading: false, initialized: true })
      
      // Sync cookies
      await fetch('/api/auth/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        }),
      })
    } else {
      set({ user: null, isLoading: false, initialized: true })
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        set({ user: session.user })
        
        // Sync cookies on auth change
        await fetch('/api/auth/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        })
      } else {
        set({ user: null })
      }
    })
  },
}))
```

### 6.3 UI Store

#### `src/stores/ui-store.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'ui-storage',
    }
  )
)
```

### 6.4 User Store (Preferences)

#### `src/stores/user-store.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  emailNotifications: boolean
  pushNotifications: boolean
}

interface UserState {
  preferences: UserPreferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      preferences: {
        theme: 'system',
        emailNotifications: true,
        pushNotifications: false,
      },
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
    }),
    {
      name: 'user-preferences',
    }
  )
)
```

### 6.5 Initialize Auth Store

#### `src/components/providers/auth-provider.tsx`
```typescript
'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return <>{children}</>
}
```

Update root layout to include AuthProvider:
```typescript
// In src/app/layout.tsx
import { AuthProvider } from '@/components/providers/auth-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 6.6 Using Stores in Components

```typescript
'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useUIStore } from '@/stores/ui-store'

export function ExampleComponent() {
  const user = useAuthStore((state) => state.user)
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  return (
    <div>
      <p>User: {user?.email}</p>
      <p>Sidebar: {sidebarOpen ? 'Open' : 'Closed'}</p>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
    </div>
  )
}
```

### 6.7 Checklist

- [ ] Install Zustand
- [ ] Create auth store (`stores/auth-store.ts`)
- [ ] Create UI store (`stores/ui-store.ts`)
- [ ] Create user preferences store
- [ ] Create auth provider component
- [ ] Update root layout with auth provider
- [ ] Update components to use stores
- [ ] Test: Auth state syncs on login/logout
- [ ] Test: UI preferences persist across sessions
- [ ] Test: Stores work with Server Component data

**Time Spent:** ___ hours  
**Status:** ⏳ Pending

---

## ✅ Phase 7: Testing & Quality

**Status:** ⏳ Pending  
**Estimated Time:** 8-10 hours  
**Priority:** MEDIUM  
**Dependencies:** Phases 1-6 complete

### 7.1 Install Testing Dependencies

```bash
# Playwright for E2E tests
npm install -D @playwright/test

# Jest for unit tests
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom

# TypeScript support
npm install -D @types/jest ts-jest
```

### 7.2 Configure Playwright

#### `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 7.3 E2E Tests

#### `tests/e2e/auth.spec.ts`
```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login form on homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Email').fill('invalid@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    await expect(page.getByText('Error')).toBeVisible()
  })

  test('should redirect to dashboard after login', async ({ page }) => {
    await page.goto('/')
    
    // Use test credentials
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Dashboard')).toBeVisible()
  })

  test('should protect dashboard route', async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto('/dashboard')
    
    // Should redirect to homepage
    await expect(page).toHaveURL('/')
  })
})
```

#### `tests/e2e/dashboard.spec.ts`
```typescript
import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('should display user email', async ({ page }) => {
    await expect(page.getByText('test@example.com')).toBeVisible()
  })

  test('should navigate to settings', async ({ page }) => {
    await page.getByRole('link', { name: 'Settings' }).click()
    await expect(page).toHaveURL('/settings')
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  })

  test('should sign out', async ({ page }) => {
    await page.getByRole('button', { name: /account/i }).click()
    await page.getByRole('menuitem', { name: 'Sign out' }).click()
    
    await expect(page).toHaveURL('/')
  })
})
```

### 7.4 Configure Jest

#### `jest.config.js`
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

#### `jest.setup.js`
```javascript
import '@testing-library/jest-dom'
```

### 7.5 Unit Tests

#### `tests/unit/dal.test.ts`
```typescript
import { describe, it, expect, jest } from '@jest/globals'

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

describe('Data Access Layer', () => {
  it('should return null when no access token', async () => {
    const { cookies } = require('next/headers')
    cookies.mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    })

    const { verifySession } = require('@/lib/dal')
    const result = await verifySession()
    
    expect(result).toBeNull()
  })

  it('should return user when valid token', async () => {
    const mockUser = { id: '123', email: 'test@example.com' }
    
    const { cookies } = require('next/headers')
    const { createClient } = require('@/lib/supabase/server')
    
    cookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    })
    
    createClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    })

    const { verifySession } = require('@/lib/dal')
    const result = await verifySession()
    
    expect(result).toEqual(mockUser)
  })
})
```

#### `tests/unit/validations.test.ts`
```typescript
import { describe, it, expect } from '@jest/globals'
import { loginSchema, signupSchema } from '@/lib/validations'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct email and password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      })
      
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      })
      
      expect(result.success).toBe(false)
    })
  })

  describe('signupSchema', () => {
    it('should reject weak password', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'weak',
      })
      
      expect(result.success).toBe(false)
    })

    it('should validate strong password', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'StrongPass123',
      })
      
      expect(result.success).toBe(true)
    })
  })
})
```

### 7.6 Update package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:coverage": "jest --coverage"
  }
}
```

### 7.7 ESLint Configuration

Update `eslint.config.mjs`:
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

export default eslintConfig;
```

### 7.8 Checklist

- [ ] Install Playwright and Jest
- [ ] Configure Playwright (`playwright.config.ts`)
- [ ] Configure Jest (`jest.config.js`)
- [ ] Write E2E tests for authentication
- [ ] Write E2E tests for dashboard
- [ ] Write unit tests for DAL
- [ ] Write unit tests for validations
- [ ] Update package.json scripts
- [ ] Configure ESLint
- [ ] Run `npm test` - all tests pass
- [ ] Run `npm run test:e2e` - all E2E tests pass
- [ ] Run `npm run lint` - no errors

**Time Spent:** ___ hours  
**Status:** ⏳ Pending

---

## ✅ Phase 8: Deployment & Documentation

**Status:** ⏳ Pending  
**Estimated Time:** 4-6 hours  
**Priority:** HIGH  
**Dependencies:** All previous phases

### 8.1 Vercel Deployment

#### `vercel.json` (Optional)
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

#### Deployment Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: Next.js template with 2025 auth"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Configure environment variables
- Deploy

3. **Environment Variables on Vercel**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

### 8.2 Update README.md

#### `README.md`
```markdown
# Next.js Template with 2025 Authentication

A modern, production-ready Next.js 15 template with authentication using the **2025 Data Access Layer (DAL) pattern**.

## Features

✅ **2025 Authentication Pattern** - CVE-2025-29927 compliant  
✅ **Next.js 15** - App Router, Server Components, Server Actions  
✅ **Supabase** - Authentication, Database, Row Level Security  
✅ **TypeScript** - Full type safety  
✅ **Tailwind CSS v4** - Modern styling  
✅ **shadcn/ui** - Beautiful components  
✅ **Zustand** - Client state management  
✅ **react-hook-form + zod** - Type-safe forms  
✅ **Playwright + Jest** - E2E and unit testing  
✅ **Dark Mode** - With next-themes  

## Security Architecture

This template implements the **correct 2025 authentication pattern**:

- ✅ **Data Access Layer (DAL)** for auth checks (not middleware)
- ✅ **Middleware ONLY** for token refresh
- ✅ **httpOnly cookies** for secure token storage
- ✅ **Server Component layout gates** for access control
- ✅ **React cache()** to prevent duplicate calls

**Why?** In March 2025, CVE-2025-29927 exposed vulnerabilities in middleware-based authentication. The DAL pattern is now the industry standard.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone YOUR_REPO_URL
cd nextjs_template
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration from `supabase/migrations/001_initial_schema.sql`
4. Generate TypeScript types:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Public auth pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Auth forms
│   └── layout/           # Layout components
├── lib/
│   ├── dal.ts            # 🔑 Data Access Layer (CRITICAL)
│   ├── supabase/         # Supabase clients
│   ├── utils.ts          # Utilities
│   └── validations.ts    # Zod schemas
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores
└── middleware.ts         # Token refresh (NOT auth checks)
```

## Key Files

- `src/lib/dal.ts` - **Data Access Layer** (auth checks)
- `src/middleware.ts` - Token refresh only
- `src/app/(dashboard)/layout.tsx` - **Auth gate** for protected routes
- `src/lib/supabase/client.ts` - Browser Supabase client
- `src/lib/supabase/server.ts` - Server Supabase client

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run Jest tests
npm run test:e2e     # Run Playwright E2E tests
```

## Testing

### Unit Tests (Jest)
```bash
npm test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy

### Environment Variables

Required for production:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
```

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - DAL pattern explained
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production setup
- [Supabase Setup](./docs/SUPABASE_SETUP.md) - Database configuration

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [CVE-2025-29927 Details](https://nvd.nist.gov/vuln/detail/CVE-2025-29927)

## License

MIT
```

### 8.3 Architecture Documentation

#### `docs/ARCHITECTURE.md`
```markdown
# Architecture Documentation

## 2025 Authentication Pattern

This template implements the **Data Access Layer (DAL)** pattern for authentication, which became the industry standard after CVE-2025-29927 was disclosed in March 2025.

### The Security Issue

CVE-2025-29927 revealed that authentication checks in Next.js middleware could be bypassed by spoofing the `x-middleware-subrequest` header. This vulnerability had a CVSS score of 9.1 (Critical).

### The Solution: DAL Pattern

Instead of checking authentication in middleware, we use a **Data Access Layer** with Server Components:

```typescript
// ❌ OLD WAY (Vulnerable)
// middleware.ts
export function middleware(request) {
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.redirect('/login')
  }
}

// ✅ NEW WAY (Secure)
// lib/dal.ts
export const getUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

// app/(dashboard)/layout.tsx
export default async function DashboardLayout({ children }) {
  const user = await getUser()
  if (!user) redirect('/login')
  return <>{children}</>
}
```

### Architecture Layers

```
1. Middleware
   └─ Purpose: Token refresh ONLY
   └─ Does NOT check authentication

2. Data Access Layer (DAL)
   └─ Purpose: Centralized auth logic
   └─ Used by Server Components

3. Server Component Layout Gates
   └─ Purpose: Enforce access control
   └─ Calls DAL for auth checks

4. Protected Pages
   └─ Fully authenticated
   └─ Can access user data safely
```

### Benefits

✅ **Security**: Can't be bypassed (server-side only)  
✅ **Performance**: React cache() prevents duplicate calls  
✅ **UX**: Zero flicker (decision before render)  
✅ **Maintainability**: Centralized auth logic  
✅ **Testing**: Easy to test pure functions  

### Key Principles

1. **Never check auth in middleware**
2. **Always use getUser() in Server Components**
3. **Store tokens in httpOnly cookies**
4. **Use Server Actions for mutations**
5. **Validate on server, optimize on client**

## Data Flow

### Login Flow
```
1. User submits form (Client Component)
2. Server Action validates credentials
3. Supabase creates session
4. Server Action calls /api/auth/set
5. API route sets httpOnly cookies
6. Redirect to dashboard
7. Layout gate checks auth (DAL)
8. Dashboard renders
```

### Protected Route Access
```
1. User navigates to /dashboard
2. Middleware refreshes token if needed
3. Layout gate calls getUser() (DAL)
4. DAL validates token with Supabase
5. If valid: render page
6. If invalid: redirect to login
```

## Technology Choices

### Why Supabase?
- Complete auth solution (no DIY needed)
- Built-in Row Level Security
- Real-time subscriptions
- File storage
- Edge functions

### Why Zustand?
- Simple API (less boilerplate than Redux)
- Better TypeScript support than Context
- Lightweight (< 1KB)
- Perfect for client-side UI state

### Why shadcn/ui?
- Copy-paste (not npm package)
- Full customization
- Accessible by default (Radix UI)
- Modern design

### Why Server Components?
- Better performance (less JavaScript)
- SEO-friendly
- Secure (auth logic on server)
- Streaming support

## References

- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [CVE-2025-29927 Details](https://nvd.nist.gov/vuln/detail/CVE-2025-29927)
- [Francisco Moretti: Modern Next.js Auth](https://www.franciscomoretti.com/blog/modern-nextjs-authentication-best-practices-2025)
```

### 8.4 Deployment Documentation

#### `docs/DEPLOYMENT.md`
```markdown
# Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account
- Supabase project

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

2. **Import to Vercel**
- Go to https://vercel.com
- Click "Add New Project"
- Import your GitHub repository
- Select the repository

3. **Configure Environment Variables**

Click "Environment Variables" and add:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

4. **Deploy**
- Click "Deploy"
- Wait for build to complete
- Visit your app!

### Post-Deployment

1. **Update Supabase Auth Settings**
- Go to Supabase Dashboard
- Navigate to Authentication > URL Configuration
- Add your Vercel URL to "Site URL"
- Add `https://your-app.vercel.app/api/auth/confirm` to "Redirect URLs"

2. **Test Authentication**
- Sign up for a new account
- Check email verification
- Test login
- Test protected routes

## Netlify Deployment

### Steps

1. **Create netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. **Deploy to Netlify**
- Go to https://netlify.com
- Click "Add new site"
- Import from Git
- Configure environment variables
- Deploy

## Environment Variables

### Required
```
NEXT_PUBLIC_SUPABASE_URL        # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Your Supabase anon/public key
NEXT_PUBLIC_APP_URL             # Your app's URL (production)
```

### Optional
```
NODE_ENV=production             # Set automatically by hosting platforms
```

## Production Checklist

### Before Deployment

- [ ] Run `npm run build` locally - no errors
- [ ] Run `npm run lint` - no errors
- [ ] Run `npm test` - all tests pass
- [ ] Run `npm run test:e2e` - all E2E tests pass
- [ ] Update `.env.example` with all required variables
- [ ] Test authentication flows locally
- [ ] Test protected routes locally
- [ ] Review security headers

### After Deployment

- [ ] Verify app loads in production
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test email verification
- [ ] Test password reset
- [ ] Test protected routes redirect
- [ ] Test sign out
- [ ] Check browser console for errors
- [ ] Test on mobile
- [ ] Test dark mode

### Security Checklist

- [ ] httpOnly cookies enabled
- [ ] HTTPS enforced
- [ ] Supabase Row Level Security (RLS) enabled
- [ ] No API keys in client code
- [ ] Environment variables secured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (optional)

## Monitoring

### Vercel Analytics
- Enable in Vercel dashboard
- Monitor page views, performance
- Track Core Web Vitals

### Supabase Logs
- Check Authentication logs
- Monitor database queries
- Review API usage

### Error Tracking (Optional)
- Sentry
- LogRocket
- Datadog

## Rollback

If something goes wrong:

1. **Vercel**: Go to deployment history → redeploy previous version
2. **Check logs**: Vercel → Deployments → View logs
3. **Supabase**: Check project logs and database

## Custom Domain

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records (A/CNAME)
4. Wait for SSL certificate

### Update Environment Variables
```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Update Supabase
- Add custom domain to Site URL
- Update redirect URLs

## Database Migrations

### Running Migrations in Production

1. **Using Supabase Dashboard**
- Go to SQL Editor
- Run migration scripts
- Verify changes

2. **Using Supabase CLI**
```bash
# Link to production project
supabase link --project-ref YOUR_PROJECT_ID

# Push migrations
supabase db push
```

## Troubleshooting

### Build Fails
- Check build logs
- Verify all dependencies in package.json
- Test build locally first

### Authentication Not Working
- Verify environment variables
- Check Supabase URL configuration
- Confirm redirect URLs are correct

### Protected Routes Not Working
- Check DAL implementation
- Verify middleware is running
- Check browser cookies

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Supabase Support](https://supabase.com/docs)
```

### 8.5 Supabase Setup Documentation

#### `docs/SUPABASE_SETUP.md`
```markdown
# Supabase Setup Guide

## Create a Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Create a new organization (if needed)
4. Click "New Project"
5. Fill in project details:
   - Name: Your project name
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
6. Click "Create new project"
7. Wait for provisioning (~2 minutes)

## Get API Keys

1. Go to Project Settings → API
2. Copy your Project URL
3. Copy your anon/public key
4. Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Run Database Migration

### Option 1: Supabase Dashboard

1. Go to SQL Editor
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Paste into SQL Editor
4. Click "Run"
5. Verify tables created

### Option 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -D supabase

# Login
npx supabase login

# Link project
npx supabase link --project-ref YOUR_PROJECT_ID

# Push migrations
npx supabase db push
```

## Configure Authentication

### Email Settings

1. Go to Authentication → Email Templates
2. Customize email templates:
   - Confirm signup
   - Magic link
   - Reset password
3. Update confirmation URL to include your domain

### URL Configuration

1. Go to Authentication → URL Configuration
2. Set Site URL:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. Add Redirect URLs:
   - `http://localhost:3000/api/auth/confirm`
   - `https://yourdomain.com/api/auth/confirm`

### Email Auth Settings

1. Go to Authentication → Providers
2. Enable Email provider
3. Configure:
   - ✅ Enable email confirmations
   - ✅ Enable password recovery
   - ⬜ Disable email change confirmations (optional)

### OAuth Providers (Optional)

To add Google, GitHub, etc.:

1. Go to Authentication → Providers
2. Enable desired provider
3. Add OAuth credentials from provider
4. Configure callback URL:
   - `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

## Row Level Security (RLS)

The migration automatically sets up RLS policies. To verify:

1. Go to Table Editor
2. Select a table (e.g., `notes`)
3. Click RLS icon (shield)
4. Verify policies are enabled

### Understanding RLS Policies

```sql
-- Users can only see their own notes
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);
```

This ensures:
- Users can ONLY access their own data
- Impossible to bypass (enforced at database level)
- Works with generated API automatically

## Generate TypeScript Types

```bash
# Generate types from your database schema
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

This creates type-safe database queries:
```typescript
// Type-safe query
const { data } = await supabase
  .from('notes')  // ✅ Autocomplete
  .select('*')    // ✅ Type-checked columns
```

## Test Your Setup

### Test Auth

```bash
# Start your app
npm run dev

# Try to sign up at http://localhost:3000/signup
```

Check:
- ✅ Email sent
- ✅ Confirmation link works
- ✅ User created in Supabase dashboard

### Test Database

```bash
# In Supabase Dashboard → Table Editor
# Should see tables: profiles, notes
```

Check:
- ✅ Tables created
- ✅ RLS enabled
- ✅ Policies active

## Local Development with Supabase

### Option: Use Supabase CLI Locally

```bash
# Initialize Supabase
npx supabase init

# Start local Supabase
npx supabase start

# Get local credentials
npx supabase status
```

Update `.env.local` with local credentials for development.

## Troubleshooting

### Email Confirmation Not Sent

1. Check Authentication → Email Templates
2. Verify SMTP settings (or use Supabase default)
3. Check spam folder

### RLS Blocking Queries

1. Verify user is authenticated
2. Check policy conditions match query
3. Test query in SQL Editor with user context

### Types Not Generating

1. Verify Supabase CLI installed
2. Check project ID is correct
3. Ensure you're logged in: `npx supabase login`

## Best Practices

### Security

- ✅ Always enable RLS on tables with user data
- ✅ Test policies thoroughly
- ✅ Never expose service_role key
- ✅ Use anon key in client code

### Performance

- Create indexes on frequently queried columns
- Use `.select()` to limit columns returned
- Enable statement timeout
- Monitor slow queries in Supabase dashboard

### Backup

- Enable automatic backups (Supabase Pro)
- Export data regularly
- Test restore process

## Useful Supabase Features

### Realtime

Subscribe to database changes:
```typescript
const subscription = supabase
  .channel('notes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'notes'
  }, (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

### Storage

Upload files:
```typescript
const { data, error } = await supabase
  .storage
  .from('avatars')
  .upload('public/avatar1.png', file)
```

### Edge Functions

Deploy serverless functions:
```bash
npx supabase functions new my-function
npx supabase functions deploy my-function
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [SQL Reference](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
```

### 8.6 Final Checklist

- [ ] Create Vercel configuration (optional)
- [ ] Update README.md with complete instructions
- [ ] Create ARCHITECTURE.md documentation
- [ ] Create DEPLOYMENT.md guide
- [ ] Create SUPABASE_SETUP.md guide
- [ ] Test production build locally
- [ ] Deploy to Vercel
- [ ] Configure production environment variables
- [ ] Update Supabase auth URLs
- [ ] Test production deployment
- [ ] Verify all features work in production
- [ ] Set up error monitoring (optional)
- [ ] Configure custom domain (optional)

**Time Spent:** ___ hours  
**Status:** ⏳ Pending

---

## 📊 Total Project Timeline

| Phase | Time Estimate | Priority | Status |
|-------|---------------|----------|--------|
| Phase 1: Foundation & DAL | 6-8 hours | CRITICAL | ⏳ Pending |
| Phase 2: Authentication | 8-10 hours | HIGH | ⏳ Pending |
| Phase 3: UI Foundation | 10-12 hours | HIGH | ⏳ Pending |
| Phase 4: Protected Routes | 6-8 hours | HIGH | ⏳ Pending |
| Phase 5: Database Operations | 6-8 hours | MEDIUM | ⏳ Pending |
| Phase 6: Client State | 4-6 hours | MEDIUM | ⏳ Pending |
| Phase 7: Testing | 8-10 hours | MEDIUM | ⏳ Pending |
| Phase 8: Deployment | 4-6 hours | HIGH | ⏳ Pending |
| **TOTAL** | **52-68 hours** | | |

---

## 🎯 Success Criteria

At the end of implementation, the template should have:

✅ **Security**: CVE-2025-29927 compliant authentication  
✅ **Performance**: Fast page loads with Server Components  
✅ **UX**: Zero flicker, instant redirects  
✅ **DX**: Type-safe, well-documented, easy to extend  
✅ **Testing**: >70% code coverage  
✅ **Production**: Deployable immediately  
✅ **Quality**: 0 ESLint errors, 0 TypeScript errors  

---

## 📚 Additional Resources

### Official Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://docs.pmnd.rs/zustand)

### Security References
- [CVE-2025-29927 Details](https://nvd.nist.gov/vuln/detail/CVE-2025-29927)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/guides/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Blog Posts & Guides
- [Francisco Moretti: Modern Next.js Auth (2025)](https://www.franciscomoretti.com/blog/modern-nextjs-authentication-best-practices-2025)
- [Building Secure Next.js Apps with DAL](https://logicloop.dev/frontend-frameworks/secure-nextjs-authentication-data-access-layers)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Community
- [Next.js Discord](https://nextjs.org/discord)
- [Supabase Discord](https://discord.supabase.com)
- [Reddit r/nextjs](https://reddit.com/r/nextjs)

---

## 🎉 Congratulations!

When you complete all phases, you'll have a **production-ready Next.js 15 template** implementing the correct 2025 authentication pattern.

This template is:
- ✅ **Secure** - CVE-2025-29927 mitigations
- ✅ **Modern** - Latest Next.js 15 patterns
- ✅ **Fast** - Server Components + React cache()
- ✅ **Type-safe** - Full TypeScript
- ✅ **Tested** - E2E and unit tests
- ✅ **Production-ready** - Deploy immediately

**Happy coding!** 🚀
