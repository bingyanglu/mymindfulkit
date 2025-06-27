"use client"

import { useState, lazy, Suspense, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  SkipForward,
  BarChart3,
  Settings as SettingsIcon,
  Brain,
  Sparkles,
  Users,
  ListTodo,
  ToggleLeft,
  PlayCircle,
  HelpCircle,
  Check,
  ChevronRight,
} from "lucide-react"
// 动态导入非关键组件
const StatsView = lazy(() => import("../stats-view").then(module => ({ default: module.StatsView })))
const TaskList = lazy(() => import("../task-list").then(module => ({ default: module.TaskList })))
const TaskCompletionDialog = lazy(() => import("../task-completion-dialog").then(module => ({ default: module.TaskCompletionDialog })))
import { usePomodoro } from "../../hooks/use-pomodoro"
import { useTasks } from "../../hooks/use-tasks"
import { Separator } from "@/components/ui/separator"

// 加载占位符组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
)

export function PomodoroClient() {
  const { tasks, activeTasks, addTask, toggleTask, deleteTask, editTask, addTimeToTask, reorderTasks } = useTasks()

  const {
    currentTask,
    currentTaskType,
    timeLeft,
    isRunning,
    isBreak,
    currentRound,
    todayCount,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings,
    showConfirmation,
    confirmationTimeLeft,
    extendCurrentTask,
    confirmBreak,
    skipBreak,
    hasValidTasks,
  } = usePomodoro(activeTasks, addTimeToTask)

  const [showStats, setShowStats] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // 性能优化：使用 useMemo 缓存计算结果
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  const getProgressPercentage = useCallback(() => {
    const totalTime = isBreak
      ? (currentRound % 4 === 0 ? settings.longBreakDuration : settings.shortBreakDuration) * 60
      : settings.pomoDuration * 60
    return ((totalTime - timeLeft) / totalTime) * 100
  }, [isBreak, currentRound, settings.longBreakDuration, settings.shortBreakDuration, settings.pomoDuration, timeLeft])

  const getTaskTypeColor = useCallback(() => {
    if (isBreak) return "bg-green-500"
    return currentTaskType === "A" ? "bg-blue-500" : "bg-purple-500"
  }, [isBreak, currentTaskType])

  // 性能优化：缓存事件处理函数
  const handleStartPause = useCallback(() => {
    if (isRunning) {
      pauseTimer()
    } else {
      startTimer()
    }
  }, [isRunning, startTimer, pauseTimer])

  const handleReset = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  const handleSkipBreak = useCallback(() => {
    skipBreak()
  }, [skipBreak])

  const handleShowStats = useCallback(() => {
    setShowStats(true)
  }, [])

  const handleHideStats = useCallback(() => {
    setShowStats(false)
  }, [])

  const handleToggleSettings = useCallback(() => {
    setShowSettings(prev => !prev)
  }, [])

  if (showStats) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] dark:from-gray-900 dark:to-gray-800 dark:bg-gradient-to-br">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-[#3A3532] dark:text-white">Statistics</h1>
            <Button 
              variant="outline" 
              onClick={handleHideStats}
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Back to Timer
            </Button>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <StatsView />
          </Suspense>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:from-gray-900 dark:to-gray-800 dark:bg-gradient-to-br">
      <div className="max-w-7xl mx-auto p-4">
        {/* 顶部区域：标题和操作按钮 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#3A3532] dark:text-white">
              Dual-Task Pomodoro Timer
            </h1>
            <p className="text-[#706C69] dark:text-gray-400 mt-1">
              A focus tool that rotates between two tasks
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleShowStats}
              className="h-10 w-10 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Statistics"
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleSettings}
              className={`h-10 w-10 dark:border-gray-600 dark:hover:bg-gray-700 ${showSettings ? 'bg-slate-100 dark:bg-gray-700 text-[#3A3532] dark:text-white' : 'text-[#706C69] dark:text-gray-300'}`}
              title="Settings"
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 设置面板 */}
        {showSettings && (
          <Card className="mb-6 bg-white dark:bg-gray-800 border-[#EAE8E3] dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#3A3532] dark:text-white">Settings</CardTitle>
              <CardDescription className="text-[#706C69] dark:text-gray-400">
                Adjust your Pomodoro and break durations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 双任务模式开关 */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-[#3A3532] dark:text-white">Dual Task Mode</Label>
                  <p className="text-sm text-[#706C69] dark:text-gray-400">
                    Rotate between two tasks for better focus and less burnout.
                  </p>
                </div>
                <Switch
                  checked={settings.dualTaskMode}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      ...settings,
                      dualTaskMode: checked,
                    })
                  }
                />
              </div>
              
              {/* 新增：切换番茄数量设置 */}
              {settings.dualTaskMode && (
                <div className="flex items-center justify-between mt-4">
                  <Label className="text-[#3A3532] dark:text-white">Switch After</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={settings.switchAfterPomodoros}
                      onChange={e =>
                        updateSettings({
                          ...settings,
                          switchAfterPomodoros: Math.max(1, Math.min(10, Number(e.target.value))),
                        })
                      }
                      className="w-16 text-center"
                    />
                    <span className="text-[#706C69] dark:text-gray-400 text-sm">Pomodoros</span>
                  </div>
                </div>
              )}
              
              <Separator className="my-4 bg-[#EAE8E3] dark:bg-gray-700" />
              
              {/* Pomodoro Duration */}
              <div>
                <Label htmlFor="pomo-duration" className="text-[#3A3532] dark:text-white">Pomodoro Duration (minutes)</Label>
                <Input
                  id="pomo-duration"
                  type="number"
                  value={settings.pomoDuration}
                  onChange={(e) =>
                    updateSettings({
                      ...settings,
                      pomoDuration: parseInt(e.target.value),
                    })
                  }
                  min={1}
                  className="mt-1 bg-[#F8F7F4] dark:bg-gray-700 border-[#EAE8E3] dark:border-gray-600 text-[#3A3532] dark:text-white"
                />
              </div>

              {/* Short Break Duration */}
              <div>
                <Label htmlFor="short-break" className="text-[#3A3532] dark:text-white">Short Break Duration (minutes)</Label>
                <Input
                  id="short-break"
                  type="number"
                  value={settings.shortBreakDuration}
                  onChange={(e) =>
                    updateSettings({
                      ...settings,
                      shortBreakDuration: parseInt(e.target.value),
                    })
                  }
                  min={1}
                  className="mt-1 bg-[#F8F7F4] dark:bg-gray-700 border-[#EAE8E3] dark:border-gray-600 text-[#3A3532] dark:text-white"
                />
              </div>

              {/* Long Break Duration */}
              <div>
                <Label htmlFor="long-break" className="text-[#3A3532] dark:text-white">Long Break Duration (minutes)</Label>
                <Input
                  id="long-break"
                  type="number"
                  value={settings.longBreakDuration}
                  onChange={(e) =>
                    updateSettings({
                      ...settings,
                      longBreakDuration: parseInt(e.target.value),
                    })
                  }
                  min={1}
                  className="mt-1 bg-[#F8F7F4] dark:bg-gray-700 border-[#EAE8E3] dark:border-gray-600 text-[#3A3532] dark:text-white"
                />
              </div>

              {/* Sound Enabled */}
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-enabled" className="text-[#3A3532] dark:text-white">Sound Enabled</Label>
                <Switch
                  id="sound-enabled"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      ...settings,
                      soundEnabled: checked,
                    })
                  }
                />
              </div>

              {/* Notification Enabled */}
              <div className="flex items-center justify-between">
                <Label htmlFor="notification-enabled" className="text-[#3A3532] dark:text-white">Browser Notifications</Label>
                <Switch
                  id="notification-enabled"
                  checked={settings.notificationEnabled}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      ...settings,
                      notificationEnabled: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Task Validation Warning */}
        {!hasValidTasks && settings.dualTaskMode && (
          <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-300">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Please define at least two active tasks to use Dual-Task Mode.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Single Task Mode Info */}
        {!settings.dualTaskMode && tasks.length === 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Add a task to start your Pomodoro session.</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Main Layout - Two Columns */}
        <div id="main-app" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Timer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Timer */}
            <Card className="shadow-lg bg-white dark:bg-gray-800 border-[#EAE8E3] dark:border-gray-700">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge variant="secondary" className={`${getTaskTypeColor()} text-white`}>
                    {isBreak
                      ? "Break"
                      : settings.dualTaskMode
                        ? `Task ${currentTaskType}`
                        : "Focus Session"}
                  </Badge>
                  <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                    {isBreak
                      ? `${currentRound % 4 === 0 ? "Long Break" : "Short Break"}`
                      : `${((currentRound - 1) % 2) + 1} Pomodoro`}
                  </Badge>
                </div>
                <CardTitle className="text-3xl text-[#3A3532] dark:text-white">{currentTask}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="text-7xl font-mono font-bold text-[#3A3532] dark:text-white tracking-wider">
                  {formatTime(timeLeft)}
                </div>

                <Progress value={getProgressPercentage()} className="w-full h-4" />

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleStartPause}
                    size="lg"
                    disabled={!hasValidTasks && settings.dualTaskMode && !isBreak}
                    className={`${isRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-[#1ABC9C] hover:bg-[#16A085] dark:bg-[#4F46E5] dark:hover:bg-[#4338CA]"} text-white px-8 py-3 text-lg disabled:opacity-50`}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-6 h-6 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6 mr-2" />
                        Start
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleReset}
                    size="lg"
                    variant="outline"
                    className="px-6 py-3 border-[#EAE8E3] dark:border-gray-600 text-[#706C69] dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>

                  {/* 休息时显示跳过按钮 */}
                  {isBreak && !isRunning && (
                    <Button
                      onClick={handleSkipBreak}
                      size="lg"
                      variant="outline"
                      className="px-6 py-3 text-[#1ABC9C] dark:text-blue-400 border-[#EAE8E3] dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <SkipForward className="w-5 h-5 mr-2" />
                      Skip Break
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Task List */}
          <div className="lg:col-span-1 space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <TaskList
                tasks={tasks}
                activeTasks={activeTasks}
                onAddTask={addTask}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onEditTask={editTask}
                onReorderTasks={reorderTasks}
              />
            </Suspense>
          </div>
        </div>

        {/* 任务完成确认对话框 */}
        <Suspense fallback={null}>
          <TaskCompletionDialog
            isOpen={showConfirmation}
            currentTaskName={currentTask}
            currentTaskType={currentTaskType}
            timeLeft={confirmationTimeLeft}
            onExtend={extendCurrentTask}
            onBreak={confirmBreak}
          />
        </Suspense>

        {/* 板块一：为何有效 - 建立信任 */}
        <section className="max-w-5xl mx-auto py-20 px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-3">Why It Works</span>
            <h2 className="text-4xl font-bold text-[#3A3532] dark:text-white mb-4">
              Game-Changer for Neurodivergent Minds
            </h2>
            <p className="max-w-2xl mx-auto text-[#706C69] dark:text-gray-400">
              Our dual-task approach is specifically designed to work with your brain's natural patterns, not against them.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#3A3532] dark:text-white">Combats Boredom</h3>
                <p className="text-[#706C69] dark:text-gray-400">
                  Switching tasks provides the novelty your brain craves, keeping you engaged and preventing focus fatigue.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#3A3532] dark:text-white">Builds Momentum</h3>
                <p className="text-[#706C69] dark:text-gray-400">
                  Use an easy task to build momentum, making it simpler to tackle a more challenging one next.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="pt-8 pb-6 px-6 text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-green-500 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#3A3532] dark:text-white">Digital Body Doubling</h3>
                <p className="text-[#706C69] dark:text-gray-400">
                  The structured rotation simulates a "body double" effect, helping you stay on track and accountable.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 板块二：如何使用 - 清晰引导 */}
        <section className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block bg-[#1ABC9C] text-white text-sm font-medium px-4 py-1.5 rounded-full mb-3">Quick Start</span>
              <h2 className="text-4xl font-bold text-[#3A3532] dark:text-white mb-4">
                Get Started in 3 Simple Steps
              </h2>
              <p className="max-w-2xl mx-auto text-[#706C69] dark:text-gray-400">
                You're just moments away from a more effective, brain-friendly productivity system.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute left-9 top-0 h-full w-1 bg-gradient-to-b from-[#1ABC9C] to-blue-500 rounded-full hidden md:block"></div>
                
                <div className="space-y-12">
                  <div className="relative flex flex-col md:flex-row md:items-center">
                    <div className="flex-shrink-0 mb-5 md:mb-0">
                      <div className="bg-gradient-to-br from-[#1ABC9C] to-teal-600 w-20 h-20 rounded-full flex items-center justify-center shadow-lg z-10 relative">
                        <ListTodo className="w-10 h-10 text-white" />
                        <div className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow">
                          <span className="text-[#1ABC9C] font-bold">1</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:ml-10">
                      <Card className="border-none shadow-lg bg-white dark:bg-gray-800">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-[#3A3532] dark:text-white mb-2">Add Your Tasks</h3>
                          <p className="text-[#706C69] dark:text-gray-400">
                            Populate your Task List on the right with at least two tasks for the day. Be specific about what you want to accomplish.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="relative flex flex-col md:flex-row md:items-center">
                    <div className="flex-shrink-0 mb-5 md:mb-0">
                      <div className="bg-gradient-to-br from-teal-500 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center shadow-lg z-10 relative">
                        <ToggleLeft className="w-10 h-10 text-white" />
                        <div className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow">
                          <span className="text-blue-500 font-bold">2</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:ml-10">
                      <Card className="border-none shadow-lg bg-white dark:bg-gray-800">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-[#3A3532] dark:text-white mb-2">Enable Dual-Task Mode</h3>
                          <p className="text-[#706C69] dark:text-gray-400">
                            Ensure the "Dual-Task Mode" toggle is on in settings. The timer will automatically pick your first two tasks.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="relative flex flex-col md:flex-row md:items-center">
                    <div className="flex-shrink-0 mb-5 md:mb-0">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center shadow-lg z-10 relative">
                        <PlayCircle className="w-10 h-10 text-white" />
                        <div className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow">
                          <span className="text-purple-500 font-bold">3</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:ml-10">
                      <Card className="border-none shadow-lg bg-white dark:bg-gray-800">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-[#3A3532] dark:text-white mb-2">Press Start & Flow</h3>
                          <p className="text-[#706C69] dark:text-gray-400">
                            Hit the start button and immerse yourself in the current task. When the timer switches, so do you. Relax during breaks!
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 板块三：常见问题FAQ - SEO金矿 */}
        <section className="max-w-5xl mx-auto py-20 px-6" itemScope itemType="https://schema.org/FAQPage">
          <div className="text-center mb-14">
            <span className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-3">FAQ</span>
            <h2 className="text-4xl font-bold text-[#3A3532] dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="max-w-2xl mx-auto text-[#706C69] dark:text-gray-400">
              Everything you need to know about our Dual-Task Pomodoro approach
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 itemProp="name" className="text-xl font-bold text-[#3A3532] dark:text-white flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-500" />
                    Is this Pomodoro timer free to use?
                  </h3>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 mt-1">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <p itemProp="text" className="text-[#706C69] dark:text-gray-400">
                    Yes, all core tools on MyMindfulKit, including the Dual-Task Pomodoro Timer, are completely free to use. No hidden fees or premium features.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 itemProp="name" className="text-xl font-bold text-[#3A3532] dark:text-white flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-500" />
                    Do I need an account to use it?
                  </h3>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 mt-1">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <p itemProp="text" className="text-[#706C69] dark:text-gray-400">
                    No account or sign-up is required. All your tasks and settings are saved securely in your own browser's local storage.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 itemProp="name" className="text-xl font-bold text-[#3A3532] dark:text-white flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-500" />
                    How is this different from regular Pomodoro timers?
                  </h3>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 mt-1">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <p itemProp="text" className="text-[#706C69] dark:text-gray-400">
                    Our dual-task mode automatically switches between two tasks, providing the novelty and momentum that ADHD brains need. Traditional timers focus on one task, which can lead to boredom and burnout.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 itemProp="name" className="text-xl font-bold text-[#3A3532] dark:text-white flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-500" />
                    Can I use this for studying?
                  </h3>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 mt-1">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <p itemProp="text" className="text-[#706C69] dark:text-gray-400">
                    Absolutely! Many students use it to alternate between different subjects or study methods. For example, you could switch between "Math Practice" and "Reading Notes" to keep your brain engaged and maximize learning.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 itemProp="name" className="text-xl font-bold text-[#3A3532] dark:text-white flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-500" />
                    What if I only want to work on one task?
                  </h3>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 mt-1">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <p itemProp="text" className="text-[#706C69] dark:text-gray-400">
                    Simply turn off "Dual-Task Mode" in the settings. The timer will then work like a traditional Pomodoro timer, focusing on one task at a time while still maintaining the beneficial break structure.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
} 