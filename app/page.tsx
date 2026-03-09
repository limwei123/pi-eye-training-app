"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Target,
  TrendingUp,
  Play,
  Settings,
  Calendar,
  CreditCard,
} from "lucide-react"
import Link from "next/link"

declare global {
  interface Window {
    Pi?: {
      createPayment: (
        paymentData: {
          amount: number
          memo: string
          metadata: Record<string, unknown>
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void
          onReadyForServerCompletion: (paymentId: string, txid: string) => void
          onCancel: (paymentId: string) => void
          onError: (error: unknown, payment?: unknown) => void
        }
      ) => void
    }
  }
}

export default function HomePage() {
  const [todayProgress] = useState(65)
  const [streak] = useState(7)
  const [totalSessions] = useState(42)
  const [paymentStatus, setPaymentStatus] = useState("")
  const [isPaying, setIsPaying] = useState(false)

  const exerciseCategories = [
    {
      id: "focus",
      title: "Focus Training",
      description: "Improve visual focus and concentration",
      icon: Target,
      exercises: 8,
      duration: "15-20 min",
      color: "bg-blue-500",
    },
    {
      id: "tracking",
      title: "Eye Tracking",
      description: "Smooth pursuit and tracking exercises",
      icon: Eye,
      exercises: 6,
      duration: "10-15 min",
      color: "bg-green-500",
    },
    {
      id: "stability",
      title: "Stability Training",
      description: "Reduce involuntary eye movements",
      icon: TrendingUp,
      exercises: 5,
      duration: "12-18 min",
      color: "bg-purple-500",
    },
  ]

  const postJson = async (url: string, body: Record<string, unknown>) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(
        typeof data?.error === "string" ? data.error : "Request failed"
      )
    }

    return data
  }

  const handleTestPayment = async () => {
    try {
      setPaymentStatus("")
      setIsPaying(true)

      if (typeof window === "undefined" || !window.Pi) {
        setPaymentStatus("Pi SDK not found. Please open this app in Pi Browser.")
        setIsPaying(false)
        return
      }

      window.Pi.createPayment(
        {
          amount: 0.01,
          memo: "Test payment for Eye Training App",
          metadata: {
            type: "test_payment",
            feature: "premium_eye_training",
          },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            try {
              setPaymentStatus(`Approving payment ${paymentId}...`)
              await postJson("/api/payments/approve", { paymentId })
              setPaymentStatus(`Payment approved: ${paymentId}`)
            } catch (error) {
              const message =
                error instanceof Error ? error.message : "Approval failed"
              setPaymentStatus(`Approval error: ${message}`)
              setIsPaying(false)
            }
          },

          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            try {
              setPaymentStatus(`Completing payment ${paymentId}...`)
              await postJson("/api/payments/complete", { paymentId, txid })
              setPaymentStatus(`Payment completed successfully. TXID: ${txid}`)
              setIsPaying(false)
            } catch (error) {
              const message =
                error instanceof Error ? error.message : "Completion failed"
              setPaymentStatus(`Completion error: ${message}`)
              setIsPaying(false)
            }
          },

          onCancel: (paymentId: string) => {
            setPaymentStatus(`Payment cancelled: ${paymentId}`)
            setIsPaying(false)
          },

          onError: (error: unknown) => {
            const message =
              error instanceof Error ? error.message : "Unknown payment error"
            setPaymentStatus(`Payment error: ${message}`)
            setIsPaying(false)
          },
        }
      )
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown payment error"
      setPaymentStatus(`Payment error: ${message}`)
      setIsPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center pt-8 pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Eye className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Eyes Training</h1>
          </div>
          <p className="text-gray-600 text-sm">for Nystagmus</p>
        </div>

        <Card className="shadow-lg border-2 border-yellow-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-yellow-600" />
              Pi Test Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Use this button to test a 0.01 Pi transaction for Pi Developer
              verification.
            </p>

            <Button
              onClick={handleTestPayment}
              disabled={isPaying}
              className="w-full h-12"
            >
              {isPaying ? "Processing..." : "Pay 0.01 Pi"}
            </Button>

            {paymentStatus && (
              <div className="rounded-lg bg-gray-100 p-3 text-sm text-gray-700 break-words">
                {paymentStatus}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Daily Goal</span>
                <span className="font-medium">{todayProgress}%</span>
              </div>
              <Progress value={todayProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{streak}</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalSessions}</div>
                <div className="text-xs text-gray-500">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-xs text-gray-500">This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 px-1">
            Exercise Categories
          </h2>

          {exerciseCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.id} href={`/exercises/${category.id}`}>
                <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${category.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {category.description}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {category.exercises} exercises
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {category.duration}
                          </Badge>
                        </div>
                      </div>
                      <Play className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Link href="/progress">
            <Button
              variant="outline"
              className="w-full h-12 flex items-center gap-2 bg-transparent"
            >
              <TrendingUp className="h-4 w-4" />
              View Progress
            </Button>
          </Link>
          <Link href="/settings">
            <Button
              variant="outline"
              className="w-full h-12 flex items-center gap-2 bg-transparent"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  )
}