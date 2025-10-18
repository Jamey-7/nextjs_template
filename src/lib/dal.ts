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
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

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
