"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Clock, Target, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ExerciseCategoryPage() {
  const params = useParams()
  const category = params.category as string

  const exerciseData = {
    focus: {
      title: "Focus Training",
      description: "Exercises to improve visual focus and concentration",
      color: "bg-blue-500",
      exercises: [
        {
          id: 1,
          name: "Central Fixation",
          description: "Focus on a central point while maintaining steady gaze",
          duration: "3 min",
          difficulty: "Beginner",
          completed: true,
        },
        {
          id: 2,
          name: "Near-Far Focus",
          description: "Alternate focus between near and far objects",
          duration: "5 min",
          difficulty: "Beginner",
          completed: true,
        },
        {
          id: 3,
          name: "Peripheral Awareness",
          description: "Maintain central focus while noting peripheral movement",
          duration: "4 min",
          difficulty: "Intermediate",
          completed: false,
        },
        {
          id: 4,
          name: "Focus Stability",
          description: "Hold steady focus on moving targets",
          duration: "6 min",
          difficulty: "Intermediate",
          completed: false,
        },
      ],
    },
    tracking: {
      title: "Eye Tracking",
      description: "Smooth pursuit and tracking movement exercises",
      color: "bg-green-500",
      exercises: [
        {
          id: 1,
          name: "Horizontal Tracking",
          description: "Follow objects moving left to right smoothly",
          duration: "4 min",
          difficulty: "Beginner",
          completed: true,
        },
        {
          id: 2,
          name: "Vertical Tracking",
          description: "Track objects moving up and down",
          duration: "4 min",
          difficulty: "Beginner",
          completed: false,
        },
        {
          id: 3,
          name: "Circular Tracking",
          description: "Follow circular motion patterns",
          duration: "5 min",
          difficulty: "Intermediate",
          completed: false,
        },
      ],
    },
    stability: {
      title: "Stability Training",
      description: "Exercises to reduce involuntary eye movements",
      color: "bg-purple-500",
      exercises: [
        {
          id: 1,
          name: "Gaze Stabilization",
          description: "Maintain steady gaze while head moves",
          duration: "5 min",
          difficulty: "Intermediate",
          completed: false,
        },
        {
          id: 2,
          name: "Visual Anchoring",
          description: "Use visual anchors to reduce nystagmus",
          duration: "6 min",
          difficulty: "Advanced",
          completed: false,
        },
      ],
    },
  }

  const currentCategory = exerciseData[category as keyof typeof exerciseData]

  if (!currentCategory) {
    return <div>Category not found</div>
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
            <h1 className="text-2xl font-bold text-gray-900">{currentCategory.title}</h1>
            <p className="text-sm text-gray-600">{currentCategory.description}</p>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {currentCategory.exercises.filter((ex) => ex.completed).length}/{currentCategory.exercises.length}
                </div>
                <div className="text-sm text-gray-600">Exercises Completed</div>
              </div>
              <div className={`p-3 rounded-full ${currentCategory.color}`}>
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 px-1">Available Exercises</h2>

          {currentCategory.exercises.map((exercise) => (
            <Card key={exercise.id} className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                      {exercise.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {exercise.duration}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Link href={`/exercise/${category}/${exercise.id}`}>
                  <Button className="w-full flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    {exercise.completed ? "Practice Again" : "Start Exercise"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  )
}
