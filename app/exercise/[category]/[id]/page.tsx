"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ExercisePage() {
  const params = useParams()
  const category = params.category as string
  const exerciseId = params.id as string

  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes in seconds
  const [totalTime] = useState(180)
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const exerciseSteps = [
    "Position yourself comfortably with good lighting",
    "Focus on the center target that will appear",
    "Keep your head still and move only your eyes",
    "Maintain focus even if your eyes want to drift",
    "Take breaks if you feel strain or discomfort",
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => {
          if (timeLeft <= 1) {
            setIsActive(false)
            setIsCompleted(true)
            return 0
          }
          return timeLeft - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((totalTime - timeLeft) / totalTime) * 100

  const handleStart = () => {
    setIsActive(true)
  }

  const handlePause = () => {
    setIsActive(false)
  }

  const handleReset = () => {
    setIsActive(false)
    setTimeLeft(totalTime)
    setIsCompleted(false)
    setCurrentStep(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8 pb-4">
          <Link href={`/exercises/${category}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Central Fixation</h1>
            <p className="text-sm text-gray-600">Focus Training Exercise</p>
          </div>
        </div>

        {/* Timer Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-6xl font-bold text-blue-600 mb-4">{formatTime(timeLeft)}</div>
            <Progress value={progress} className="h-3 mb-4" />
            <div className="text-sm text-gray-600 mb-6">
              {isCompleted ? "Exercise Complete!" : `${Math.round(progress)}% Complete`}
            </div>

            <div className="flex gap-3 justify-center">
              {!isActive && !isCompleted && (
                <Button onClick={handleStart} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Start
                </Button>
              )}
              {isActive && (
                <Button onClick={handlePause} variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
              )}
              <Button onClick={handleReset} variant="outline" className="flex items-center gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Visual */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="aspect-square bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center relative">
              {isActive && <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>}
              {!isActive && !isCompleted && (
                <div className="text-center text-gray-400">
                  <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm">Press Start to begin</p>
                </div>
              )}
              {isCompleted && (
                <div className="text-center text-green-600">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Well Done!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Exercise Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {exerciseSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completion Actions */}
        {isCompleted && (
          <Card className="shadow-lg border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-800 mb-2">Exercise Completed!</h3>
              <p className="text-sm text-green-700 mb-4">Great job! You've completed this exercise session.</p>
              <div className="flex gap-3 justify-center">
                <Link href={`/exercises/${category}`}>
                  <Button variant="outline">Back to Exercises</Button>
                </Link>
                <Button onClick={handleReset}>Practice Again</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  )
}
