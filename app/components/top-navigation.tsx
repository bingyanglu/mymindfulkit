"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  BarChart3,
  Sun,
  Moon,
  Brain,
} from "lucide-react"
import type { PomodoroSettings } from "../hooks/use-pomodoro"
import type { Theme } from "../hooks/use-theme"

interface TopNavigationProps {
  settings: PomodoroSettings
  onSettingsChange: (settings: PomodoroSettings) => void
  onShowStats: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function TopNavigation({
  settings,
  onSettingsChange,
  onShowStats,
  theme,
  onToggleTheme,
}: TopNavigationProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - App title and stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="font-semibold text-slate-800 dark:text-white text-lg">
                  <span className="hidden sm:inline">Dual-Task Pomodoro</span>
                  <span className="sm:hidden">Dual Pomodoro</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-gray-400">
                  <span className="hidden sm:inline">A focus tool that rotates between two tasks</span>
                  <span className="sm:hidden">ADHD Friendly</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button onClick={onToggleTheme} variant="outline" size="sm" title="Toggle Theme">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Statistics Button */}
            <Button onClick={onShowStats} variant="outline" size="sm" title="View Statistics">
              <BarChart3 className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">
                Statistics
              </span>
            </Button>

            {/* Settings Button */}
            <Button onClick={() => setShowSettings(!showSettings)} variant="outline" size="sm" title="Settings">
              <Settings className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">
                Settings
              </span>
            </Button>

            {/* Settings Dialog */}
        {showSettings && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
                <Card className="w-11/12 max-w-md bg-white dark:bg-gray-800 shadow-xl border-slate-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">Settings</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-gray-400">
                      Adjust your Pomodoro and break durations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pomodoro Duration */}
                    <div>
                      <Label htmlFor="pomo-duration" className="text-slate-800 dark:text-white">Pomodoro Duration (minutes)</Label>
                <Input
                        id="pomo-duration"
                  type="number"
                  value={settings.pomoDuration}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      pomoDuration: parseInt(e.target.value),
                    })
                  }
                        min={1}
                        className="mt-1 bg-slate-50 dark:bg-gray-700 border-slate-200 dark:border-gray-600 text-slate-800 dark:text-white"
                />
              </div>

                    {/* Short Break Duration */}
                    <div>
                      <Label htmlFor="short-break-duration" className="text-slate-800 dark:text-white">Short Break Duration (minutes)</Label>
                <Input
                        id="short-break-duration"
                  type="number"
                  value={settings.shortBreakDuration}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      shortBreakDuration: parseInt(e.target.value),
                    })
                  }
                        min={1}
                        className="mt-1 bg-slate-50 dark:bg-gray-700 border-slate-200 dark:border-gray-600 text-slate-800 dark:text-white"
                />
              </div>

                    {/* Long Break Duration */}
                    <div>
                      <Label htmlFor="long-break-duration" className="text-slate-800 dark:text-white">Long Break Duration (minutes)</Label>
                <Input
                        id="long-break-duration"
                  type="number"
                  value={settings.longBreakDuration}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      longBreakDuration: parseInt(e.target.value),
                    })
                  }
                        min={1}
                        className="mt-1 bg-slate-50 dark:bg-gray-700 border-slate-200 dark:border-gray-600 text-slate-800 dark:text-white"
                />
              </div>

                    <Separator className="dark:bg-gray-700" />

                    {/* Sound Settings */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-slate-800 dark:text-white">Sound Settings</h3>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="task-completion-sound" className="text-slate-800 dark:text-white">Task Completion Sound</Label>
                        <Switch
                          id="task-completion-sound"
                          checked={settings.playCompletionSound}
                          onCheckedChange={(checked) =>
                    onSettingsChange({
                      ...settings,
                              playCompletionSound: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                        <Label htmlFor="break-start-sound" className="text-slate-800 dark:text-white">Break Start Sound</Label>
                <Switch
                          id="break-start-sound"
                          checked={settings.playBreakSound}
                  onCheckedChange={(checked) =>
                    onSettingsChange({
                      ...settings,
                              playBreakSound: checked,
                    })
                  }
                />
              </div>
            </div>
                  </CardContent>
                  <div className="flex justify-end p-4 bg-slate-50 dark:bg-gray-700 border-t border-slate-200 dark:border-gray-600 rounded-b-lg">
                    <Button onClick={() => setShowSettings(false)}>Close</Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
