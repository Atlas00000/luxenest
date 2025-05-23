import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  const redirectUrl = new URL("/", requestUrl.origin)
  
  // Add any query parameters from the original request
  requestUrl.searchParams.forEach((value, key) => {
    if (key !== "code") {
      redirectUrl.searchParams.set(key, value)
    }
  })

  return NextResponse.redirect(redirectUrl)
} 