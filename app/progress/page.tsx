"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, Calendar, Target, Clock } from "lucide-react"
import Link from "next/link"

export default function ProgressPage() {
  const weeklyData = [
    { day: "Mon", sessions: 2, duration: 25 },
    { day: "Tue", sessions: 1, duration: 15 },
    { day: "Wed", sessions: 3, duration: 35 },
    { day: "Thu", sessions: 2, duration: 20 },
    { day: "Fri", sessions: 1, duration: 12 },
    { day: "Sat", sessions: 2, duration: 28 },
    { day: "Sun", sessions: 1, duration: 18 },
  ]

  const maxSessions = Math.max(...weeklyData.map((d) => d.sessions))

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
            <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
            <p className="text-sm text-gray-600">Track your training journey</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">7</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">42</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              This Week's Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                  <div className="h-16 bg-gray-100 rounded flex flex-col justify-end p-1">
                    <div
                      className="bg-blue-500 rounded-sm transition-all duration-300"
                      style={{ height: `${(day.sessions / maxSessions) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{day.sessions}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">Sessions per day</div>
          </CardContent>
        </Card>

        {/* Exercise Categories Progress */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-blue-600" />
              Exercise Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Focus Training</span>
                  <span className="text-gray-600">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Eye Tracking</span>
                  <span className="text-gray-600">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Stability Training</span>
                  <span className="text-gray-600">30%</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Spent */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              Time Investment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">153</div>
                <div className="text-xs text-gray-500">Minutes This Week</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">22</div>
                <div className="text-xs text-gray-500">Avg Per Day</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">680</div>
                <div className="text-xs text-gray-500">Total Minutes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🔥</span>
              </div>
              <div>
                <div className="font-medium text-green-800">7-Day Streak!</div>
                <div className="text-sm text-green-600">Keep up the great work</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⭐</span>
              </div>
              <div>
                <div className="font-medium text-blue-800">Focus Master</div>
                <div className="text-sm text-blue-600">Completed 10 focus exercises</div>
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
