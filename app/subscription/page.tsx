"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Crown, Check, CreditCard, Star, Zap, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

export default function SubscriptionPage() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<"free" | "premium" | "pending">("free")

  const handlePiPayment = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).Pi) {
        const Pi = (window as any).Pi

        setSubscriptionStatus("pending")

        await Pi.init({
          version: "2.0",
          sandbox: true,
        })

        const scopes = ["payments"]
        const authResult = await Pi.authenticate(scopes, onIncompletePaymentFound)

        if (authResult.accessToken) {
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
            },
            onReadyForServerCompletion: (paymentId: string, txid: string) => {
              console.log("Payment completed:", paymentId, txid)
              setSubscriptionStatus("premium")
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
        alert("Pi Network app is required to make payments. Please open this app in the Pi Browser.")
      }
    } catch (error) {
      console.error("Pi payment error:", error)
      setSubscriptionStatus("free")
      alert("Payment failed. Please try again.")
    }
  }

  const onIncompletePaymentFound = (payment: any) => {
    console.log("Incomplete payment found:", payment)
    return (window as any).Pi.completePayment(payment.identifier)
  }

  const premiumFeatures = [
    {
      icon: Zap,
      title: "Advanced Exercises",
      description: "Access to 20+ specialized exercises for complex nystagmus patterns",
    },
    {
      icon: TrendingUp,
      title: "Detailed Analytics",
      description: "Comprehensive progress tracking with weekly and monthly reports",
    },
    {
      icon: Star,
      title: "Personalized Plans",
      description: "AI-powered training plans adapted to your specific needs",
    },
    {
      icon: Shield,
      title: "Priority Support",
      description: "Direct access to our medical advisory team",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8 pb-4">
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Premium Subscription</h1>
            <p className="text-sm text-gray-600">Unlock advanced training features</p>
          </div>
        </div>

        {/* Current Plan Status */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">Current Plan</div>
                <div className="text-sm text-gray-600">
                  {subscriptionStatus === "free" && "Free Plan"}
                  {subscriptionStatus === "premium" && "Premium Plan"}
                  {subscriptionStatus === "pending" && "Payment Processing..."}
                </div>
              </div>
              <Badge
                variant={subscriptionStatus === "premium" ? "default" : "secondary"}
                className={subscriptionStatus === "premium" ? "bg-yellow-500" : ""}
              >
                {subscriptionStatus === "free" && "Free"}
                {subscriptionStatus === "premium" && "Premium"}
                {subscriptionStatus === "pending" && "Pending"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Premium Plan Card */}
        <Card className="shadow-lg border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-yellow-600" />
              <CardTitle className="text-2xl text-yellow-800">Premium Plan</CardTitle>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold text-yellow-700">1</span>
              <div className="text-left">
                <div className="text-2xl font-bold text-yellow-700">π</div>
                <div className="text-sm text-yellow-600">per month</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Features List */}
            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <IconComponent className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{feature.title}</div>
                      <div className="text-sm text-gray-600">{feature.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Payment Button */}
            {subscriptionStatus === "free" && (
              <Button
                onClick={handlePiPayment}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3"
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Subscribe with Pi Network
              </Button>
            )}

            {subscriptionStatus === "premium" && (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Premium Active</span>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Manage Subscription
                </Button>
              </div>
            )}

            {subscriptionStatus === "pending" && (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-blue-700">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                  <span className="font-medium">Processing Payment...</span>
                </div>
                <div className="text-sm text-gray-600">Please complete the payment in your Pi Wallet</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Free vs Premium Comparison */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Plan Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-medium text-gray-900">Feature</div>
              <div className="font-medium text-gray-900 text-center">Free</div>
              <div className="font-medium text-yellow-700 text-center">Premium</div>
            </div>

            {[
              { feature: "Basic Exercises", free: true, premium: true },
              { feature: "Progress Tracking", free: true, premium: true },
              { feature: "Advanced Exercises", free: false, premium: true },
              { feature: "Detailed Analytics", free: false, premium: true },
              { feature: "Personalized Plans", free: false, premium: true },
              { feature: "Priority Support", free: false, premium: true },
            ].map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 text-sm py-2 border-t border-gray-100">
                <div className="text-gray-700">{item.feature}</div>
                <div className="text-center">
                  {item.free ? (
                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
                <div className="text-center">
                  {item.premium ? (
                    <Check className="h-4 w-4 text-yellow-600 mx-auto" />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card className="shadow-lg bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-blue-900 mb-1">Secure Pi Network Payment</div>
                <div className="text-sm text-blue-700">
                  Payments are processed securely through the Pi Network blockchain. You can cancel your subscription at
                  any time.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  )
}
