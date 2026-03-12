"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    Pi?: {
      init: (options: { version: string; sandbox: boolean }) => void
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound?: (payment: unknown) => void
      ) => Promise<{
        accessToken: string
        user: {
          uid: string
          username: string
        }
      }>
    }
  }
}

type AuthResult = {
  accessToken: string
  user: {
    uid: string
    username: string
  }
}

export function AuthLoadingScreen({
  onAuthenticated,
}: {
  onAuthenticated?: (auth: AuthResult) => void
}) {
  const [message, setMessage] = useState("Loading Pi SDK...")
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const waitForPi = async () => {
      for (let i = 0; i < 50; i++) {
        if (window.Pi) return window.Pi
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      return null
    }

    const run = async () => {
      try {
        if (typeof window === "undefined") return

        setMessage("Loading Pi Network SDK...")

        if (!window.Pi) {
          const existing = document.querySelector(
            'script[src="https://sdk.minepi.com/pi-sdk.js"]'
          ) as HTMLScriptElement | null

          if (!existing) {
            const script = document.createElement("script")
            script.src = "https://sdk.minepi.com/pi-sdk.js"
            script.async = true
            document.body.appendChild(script)
          }
        }

        const Pi = await waitForPi()

        if (!Pi) {
          throw new Error("Pi SDK not available")
        }

        setMessage("Initializing Pi SDK...")

        Pi.init({
          version: "2.0",
          sandbox: false,
        })

        await new Promise((resolve) => setTimeout(resolve, 300))

        setMessage("Authenticating with Pi Network...")

        const auth = await Pi.authenticate(["username", "payments"], () => {
          console.log("Incomplete payment found")
        })

        if (cancelled) return

        setMessage(`Welcome ${auth.user.username}`)

        onAuthenticated?.(auth)
      } catch (err) {
        if (cancelled) return
        const msg =
          err instanceof Error ? err.message : "Unknown authentication error"
        setError(`Authentication error: ${msg}`)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [onAuthenticated])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold text-black">
          Pi Network Authentication
        </h1>

        {error ? (
          <p className="text-lg text-red-600">{error}</p>
        ) : (
          <p className="text-lg text-black">{message}</p>
        )}
      </div>
    </div>
  )
}