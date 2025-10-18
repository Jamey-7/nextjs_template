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
