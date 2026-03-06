"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    Pi?: {
      init: (options: {
        version: string
        sandbox: boolean
      }) => void
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

type AuthLoadingScreenProps = {
  onAuthenticated?: (auth: {
    accessToken: string
    user: {
      uid: string
      username: string
    }
  }) => void
}

export function AuthLoadingScreen({
  onAuthenticated,
}: AuthLoadingScreenProps) {
  const [message, setMessage] = useState("Loading Pi SDK...")
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadPiSdk = async () => {
      try {
        if (typeof window === "undefined") return

        if (!window.Pi) {
          setMessage("Loading Pi Network SDK...")

          await new Promise<void>((resolve, reject) => {
            const existing = document.querySelector(
              'script[src="https://sdk.minepi.com/pi-sdk.js"]'
            ) as HTMLScriptElement | null

            if (existing) {
              if (window.Pi) {
                resolve()
                return
              }

              existing.addEventListener("load", () => resolve(), { once: true })
              existing.addEventListener(
                "error",
                () => reject(new Error("Failed to load Pi SDK")),
                { once: true }
              )
              return
            }

            const script = document.createElement("script")
            script.src = "https://sdk.minepi.com/pi-sdk.js"
            script.async = true
            script.onload = () => resolve()
            script.onerror = () => reject(new Error("Failed to load Pi SDK"))
            document.body.appendChild(script)
          })
        }

        if (!window.Pi) {
          throw new Error("Pi SDK not available")
        }

        setMessage("Initializing Pi SDK...")

        window.Pi.init({
          version: "2.0",
          sandbox: true,
        })

        setMessage("Authenticating with Pi Network...")

        const auth = await window.Pi.authenticate(
          ["username", "payments"],
          () => {
            console.log("Incomplete payment found")
          }
        )

        if (cancelled) return

        setMessage(`Welcome ${auth.user.username}`)

        if (onAuthenticated) {
          onAuthenticated(auth)
        }
      } catch (err) {
        if (cancelled) return
        const msg =
          err instanceof Error ? err.message : "Unknown authentication error"
        setError(`Authentication error: ${msg}`)
      }
    }

    loadPiSdk()

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