"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Clock, Target } from "lucide-react"
import type { PomodoroSession } from "../hooks/use-pomodoro"

interface StatsViewProps {
}

export function StatsView({}: StatsViewProps) {
  const [sessions, setSessions] = useState<PomodoroSession[]>([])

  useEffect(() => {
    const savedSessions = localStorage.getItem("pomodoro-sessions")
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    }
  }, [])

  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  // Get week start (Monday)
  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1)).toISOString().split("T")[0]

  const todaySessions = sessions.filter((s) => s.date === today && s.completed)
  const yesterdaySessions = sessions.filter((s) => s.date === yesterday && s.completed)
  const weekSessions = sessions.filter((s) => s.date >= weekStart && s.completed)

  const taskAToday = todaySessions.filter((s) => s.taskType === "A").length
  const taskBToday = todaySessions.filter((s) => s.taskType === "B").length

  const taskAWeek = weekSessions.filter((s) => s.taskType === "A").length
  const taskBWeek = weekSessions.filter((s) => s.taskType === "B").length

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getRecentSessions = () => {
    return sessions
      .filter((s) => s.completed)
      .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
      .slice(0, 10)
  }

  return (
    <div className="space-y-6">
      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">Today's Pomodoros</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{todaySessions.length}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Yesterday: {yesterdaySessions.length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">Focus Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{formatTime(todaySessions.length * 25)}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">Today's Total</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">Task A</CardTitle>
            <Target className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{taskAToday}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">Completed Today</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">Task B</CardTitle>
            <Target className="h-4 w-4 text-purple-500 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{taskBToday}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">Completed Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <TrendingUp className="h-5 w-5" />
            Weekly Stats
          </CardTitle>
          <CardDescription className="dark:text-gray-400">See your completed Pomodoros and tasks for the current week.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{weekSessions.length}</div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Total Pomodoros</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{taskAWeek}</div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Task A</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{taskBWeek}</div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Task B</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              This week's focus time: {formatTime(weekSessions.length * 25)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Recent Sessions</CardTitle>
          <CardDescription className="dark:text-gray-400">A list of your most recently completed Pomodoro sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getRecentSessions().length === 0 ? (
              <p className="text-center text-muted-foreground dark:text-gray-400 py-4">No sessions recorded yet. Start a Pomodoro to see your progress here!</p>
            ) : (
              getRecentSessions().map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={`${session.taskType === "A" ? "bg-blue-500" : "bg-purple-500"} text-white`}>
                      {session.taskType === "A" ? "Task A" : "Task B"}
                    </Badge>
                    <div>
                      <p className="font-medium dark:text-white">25 minutes Focus</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        {new Date(session.endTime).toLocaleDateString("en-US")}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground dark:text-gray-400">
                    {new Date(session.endTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
