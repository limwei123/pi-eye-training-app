"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Bell, Volume2, Palette, Clock, Shield, HelpCircle, Crown } from "lucide-react"
import Link from "next/link"

declare global {
  interface Window {
    Pi?: any
  }
}

const getPi = () => (typeof window !== "undefined" ? window.Pi : null)

function onIncompletePaymentFound(payment: any) {
  console.log("Incomplete payment found:", payment)
  const Pi = getPi()
  if (!Pi) return
  return Pi.completePayment(payment.identifier)
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [volume, setVolume] = useState([75])
  const [reminderTime, setReminderTime] = useState("09:00")
  const [subscriptionStatus, setSubscriptionStatus] = useState<"free" | "premium" | "pending">("free")

  const handlePiPayment = async () => {
    try {
      // Check if Pi SDK is available (only works inside Pi Browser)
      const Pi = getPi()
      if (Pi) {
        setSubscriptionStatus("pending")

        // Initialize Pi SDK
        await Pi.init({
          version: "2.0",
          sandbox: isSandbox, // toggle sandbox/production
        })

        // Authenticate user
        const scopes = ["payments"]
        const authResult = await Pi.authenticate(scopes, onIncompletePaymentFound)

        if (authResult.accessToken) {
          // Create payment
          const paymentData = {
            amount: 1,
            memo: "Eyes Training Premium - Monthly Subscription",
            metadata: {
              subscriptionType: "monthly",
              userId: authResult.user.uid,
            },
          }

          const payment = await Pi.createPayment(paymentData, {
            onReadyForServerApproval: (paymentId: string) => {
              console.log("Payment ready for approval:", paymentId)
              // Here you would typically send the paymentId to your backend
              // for server-side approval
            },
            onReadyForServerCompletion: (paymentId: string, txid: string) => {
              console.log("Payment completed:", paymentId, txid)
              setSubscriptionStatus("premium")
              // Update user's subscription status in your backend
            },
            onCancel: (paymentId: string) => {
              console.log("Payment cancelled:", paymentId)
              setSubscriptionStatus("free")
            },
            onError: (error: any, payment: any) => {
              console.error("Payment error:", error)
              setSubscriptionStatus("free")
            },
          })
        }
      } else {
        // Fallback for when Pi SDK is not available
        alert("Pi Network app is required to make payments. Please open this app in the Pi Browser.")
      }
    } catch (error) {
      console.error("Pi payment error:", error)
      setSubscriptionStatus("free")
      alert("Payment failed. Please try again.")
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8 pb-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-600">Customize your experience</p>
          </div>
        </div>

        {/* Notifications */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-blue-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Daily Reminders</div>
                <div className="text-sm text-gray-600">Get reminded to do your exercises</div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            {notifications && (
              <div className="pl-4 border-l-2 border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Reminder Time</div>
                    <div className="text-sm text-gray-600">When to send daily reminders</div>
                  </div>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Volume2 className="h-5 w-5 text-blue-600" />
              Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Sound Effects</div>
                <div className="text-sm text-gray-600">Play sounds during exercises</div>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>

            {soundEnabled && (
              <div className="pl-4 border-l-2 border-blue-100">
                <div className="space-y-2">
                  <div className="font-medium text-gray-900">Volume</div>
                  <Slider value={volume} onValueChange={setVolume} max={100} step={5} className="w-full" />
                  <div className="text-sm text-gray-600 text-right">{volume[0]}%</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercise Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              Exercise Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="font-medium text-gray-900 mb-2">Default Session Length</div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm">
                    Short (5min)
                  </Button>
                  <Button size="sm">Medium (10min)</Button>
                  <Button variant="outline" size="sm">
                    Long (15min)
                  </Button>
                </div>
              </div>

              <div>
                <div className="font-medium text-gray-900 mb-2">Difficulty Level</div>
                <div className="grid grid-cols-3 gap-2">
                  <Button size="sm">Beginner</Button>
                  <Button variant="outline" size="sm">
                    Intermediate
                  </Button>
                  <Button variant="outline" size="sm">
                    Advanced
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="shadow-lg border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Crown className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Premium Features</div>
                  <div className="text-sm text-gray-600">
                    {subscriptionStatus === "free" && "Unlock advanced training"}
                    {subscriptionStatus === "premium" && "Premium Active"}
                    {subscriptionStatus === "pending" && "Payment Processing..."}
                  </div>
                </div>
              </div>
              <Link href="/subscription">
                <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                  {subscriptionStatus === "free" ? "Upgrade" : "Manage"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-blue-600" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">High Contrast Mode</div>
                <div className="text-sm text-gray-600">Improve visibility for better focus</div>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Large Text</div>
                <div className="text-sm text-gray-600">Increase text size for better readability</div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              Support & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & FAQ
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Privacy Policy
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Contact Support
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="shadow-lg">
          <CardContent className="p-4 text-center text-sm text-gray-600">
            <div className="mb-2">Eyes Training for Nystagmus</div>
            <div>Version 1.0.0</div>
          </CardContent>
        </Card>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  )
}