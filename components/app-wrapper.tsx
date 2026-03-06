"use client"

import { useState } from "react"
import { AuthLoadingScreen } from "@/components/auth-loading-screen"

type AuthState = {
  accessToken: string
  user: {
    uid: string
    username: string
  }
}

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(null)

  if (!auth) {
    return <AuthLoadingScreen onAuthenticated={setAuth} />
  }

  return <>{children}</>
}