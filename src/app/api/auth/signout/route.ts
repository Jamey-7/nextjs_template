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
