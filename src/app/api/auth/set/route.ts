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
