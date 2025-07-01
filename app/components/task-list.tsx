"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit2, Trash2, CheckCircle2, Circle, Clock, GripVertical, ChevronDown, ChevronRight, Target } from "lucide-react"
import type { Task } from "../types/task"

interface TaskListProps {
  tasks: Task[]
  activeTasks: Task[]
  onAddTask: (title: string) => void
  onAddChildTask?: (parentId: string, title: string) => void
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void
  onEditTask: (id: string, newTitle: string) => void
  onReorderTasks: (startIndex: number, endIndex: number) => void
  onMoveTask?: (taskId: string, targetTaskId: string, position: 'before' | 'after' | 'inside') => void
  isLeafTask?: (task: Task) => boolean
  focusedTaskId?: string | null
  setFocusedTaskId?: (id: string | null) => void
}

// 任务项组件 - 递归渲染子任务
function TaskItem({
  task,
  level = 0,
  isActive,
  isLeaf,
  onToggle,
  onDelete,
  onEdit,
  onAddChild,
  onMove,
  editingId,
  setEditingId,
  editingTitle,
  setEditingTitle,
  saveEdit,
  cancelEdit,
  handleEditKeyPress,
  isDraggable,
  focusedTaskId,
  setFocusedTaskId,
}: {
  task: Task
  level: number
  isActive: boolean
  isLeaf: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, title: string) => void
  onAddChild?: (parentId: string, title: string) => void
  onMove?: (taskId: string, targetTaskId: string, position: 'before' | 'after' | 'inside') => void
  editingId: string | null
  setEditingId: (id: string | null) => void
  editingTitle: string
  setEditingTitle: (title: string) => void
  saveEdit: () => void
  cancelEdit: () => void
  handleEditKeyPress: (e: React.KeyboardEvent) => void
  isDraggable: boolean
  focusedTaskId?: string | null
  setFocusedTaskId?: (id: string | null) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [addingChild, setAddingChild] = useState(false)
  const [newChildTitle, setNewChildTitle] = useState("")
  const [dragOver, setDragOver] = useState<'none' | 'top' | 'bottom' | 'inside'>('none')
  const [showFocusButton, setShowFocusButton] = useState(false)

  const hasChildren = task.children && task.children.length > 0
  const isFocused = focusedTaskId === task.id

  const handleAddChild = () => {
    if (newChildTitle.trim() && onAddChild) {
      onAddChild(task.id, newChildTitle)
      setNewChildTitle("")
      setAddingChild(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddChild()
    } else if (e.key === "Escape") {
      setAddingChild(false)
      setNewChildTitle("")
    }
  }

  const startEditing = () => {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  const handleSetFocus = () => {
    if (setFocusedTaskId) {
      setFocusedTaskId(task.id)
    }
  }

  // 拖拽处理函数
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = "move"
    e.currentTarget.classList.add("opacity-50")
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const height = rect.height
    
    // 确定拖拽区域
    if (y < height * 0.25) {
      setDragOver('top')
    } else if (y > height * 0.75) {
      setDragOver('bottom')
    } else {
      setDragOver('inside')
    }
  }

  const handleDragLeave = () => {
    setDragOver('none')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const draggedTaskId = e.dataTransfer.getData('text/plain')
    
    if (draggedTaskId === task.id) return // 不能拖到自己身上
    
    if (onMove) {
      onMove(draggedTaskId, task.id, dragOver === 'top' ? 'before' : dragOver === 'bottom' ? 'after' : 'inside')
    }
    
    setDragOver('none')
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50")
    setDragOver('none')
  }

  // 确定拖拽指示器的样式
  const getDragOverClass = () => {
    switch (dragOver) {
      case 'top':
        return 'border-t-2 border-blue-500'
      case 'bottom':
        return 'border-b-2 border-blue-500'
      case 'inside':
        return 'bg-blue-50 dark:bg-blue-900/20'
      default:
        return ''
    }
  }

  return (
    <div className="task-item-container">
      {/* 当前任务项 */}
      <div
        draggable={isDraggable && editingId !== task.id}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => setShowFocusButton(true)}
        onMouseLeave={() => setShowFocusButton(false)}
        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
          isDraggable && editingId !== task.id ? "cursor-move" : ""
        } ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            : "bg-slate-50 dark:bg-gray-700 border-slate-200 dark:border-gray-600"
        } ${
          isFocused ? "ring-2 ring-blue-400 dark:ring-blue-500" : ""
        } ${
          getDragOverClass()
        }`}
        style={{ marginLeft: `${level * 20}px` }}
      >
        {/* 拖拽手柄 */}
        {isDraggable && editingId !== task.id && (
          <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing" />
        )}

        {/* 展开/折叠图标 (仅有子任务的任务) */}
        <div className="w-4 flex-shrink-0">
          {hasChildren && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* 复选框 */}
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="flex-shrink-0"
          disabled={!isLeaf} // 只有叶子节点任务可以直接勾选
        />

        {/* 任务名称和时间 */}
        <div className="flex-1 min-w-0 group">
          {editingId === task.id ? (
            <Input
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyPress={handleEditKeyPress}
              onBlur={saveEdit}
              className="h-8 text-sm dark:bg-gray-600 dark:border-gray-500"
              autoFocus
            />
          ) : (
            <div className="relative">
              <div className="flex items-center">
                <span className={`text-sm truncate ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-slate-800 dark:text-gray-200"}`}>
                  {task.title}
                </span>
                {isFocused && (
                  <Badge variant="outline" className="ml-2 text-xs py-0 px-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700">
                    Current Focus
                  </Badge>
                )}
                {/* Set as focus task button - show on hover */}
                {showFocusButton && !isFocused && !task.completed && setFocusedTaskId && (
                  <button
                    onClick={handleSetFocus}
                    className="ml-2 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Set as Focus Task"
                  >
                    <Target className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {task.totalTime > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-slate-500 dark:text-gray-400" />
                  <span className="text-xs text-slate-500 dark:text-gray-400">
                    {task.totalTime} minutes
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 flex items-center gap-1">
          {/* Add subtask button */}
          {!addingChild && (
            <Button 
              onClick={() => setAddingChild(true)} 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
          
          {/* 编辑按钮 */}
          {editingId === task.id ? (
            <Button onClick={saveEdit} variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-100 dark:hover:bg-gray-700">
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={startEditing} variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-700">
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          
          {/* 删除按钮 */}
          <Button onClick={() => onDelete(task.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add subtask input */}
      {addingChild && (
        <div className="flex gap-2 mt-2 ml-8" style={{ marginLeft: `${level * 20 + 28}px` }}>
          <Input
            placeholder="Add subtask..."
            value={newChildTitle}
            onChange={(e) => setNewChildTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 h-8 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            autoFocus
          />
          <Button onClick={handleAddChild} size="sm" className="h-8 px-2">
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
          <Button onClick={() => setAddingChild(false)} size="sm" variant="ghost" className="h-8 px-2">
            Cancel
          </Button>
        </div>
      )}

      {/* 子任务列表 */}
      {hasChildren && expanded && (
        <div className="ml-4 mt-1 space-y-1">
          {task.children.map((childTask) => (
            <TaskItem
              key={`child-${childTask.id}`}
              task={childTask}
              level={level + 1}
              isActive={isActive}
              isLeaf={isLeaf && (!childTask.children || childTask.children.length === 0)}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onMove={onMove}
              editingId={editingId}
              setEditingId={setEditingId}
              editingTitle={editingTitle}
              setEditingTitle={setEditingTitle}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
              handleEditKeyPress={handleEditKeyPress}
              isDraggable={true}
              focusedTaskId={focusedTaskId}
              setFocusedTaskId={setFocusedTaskId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TaskList({
  tasks,
  activeTasks,
  onAddTask,
  onAddChildTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onReorderTasks,
  onMoveTask,
  isLeafTask = (task) => !task.children || task.children.length === 0,
  focusedTaskId,
  setFocusedTaskId,
}: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle)
      setNewTaskTitle("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask()
    }
  }

  const saveEdit = () => {
    if (editingId && editingTitle.trim()) {
      onEditTask(editingId, editingTitle)
    }
    setEditingId(null)
    setEditingTitle("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle("")
  }

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit()
    } else if (e.key === "Escape") {
      cancelEdit()
    }
  }

  // 拖拽处理函数
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.currentTarget.classList.add("opacity-50")
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null)
    }
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderTasks(draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50")
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // 过滤出顶级任务（没有父任务的任务）
  const rootTasks = tasks.filter(task => !task.parentId)
  
  // 过滤出已完成和未完成的顶级任务
  const completedTasks = rootTasks.filter(task => task.completed)
  const incompleteTasks = rootTasks.filter(task => !task.completed)

  return (
    <Card className="h-fit bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
      {/* 统计信息 */}
      <div className="p-4 border-b border-slate-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tasks.filter(task => task.completedToday).length}</div>
            <div className="text-sm text-slate-600 dark:text-gray-400">
              Today's Pomodoros
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-700 dark:text-gray-300">
              Round {tasks.filter(task => task.completedToday).length === 0 ? 1 : Math.floor((tasks.filter(task => task.completedToday).length - 1) / 2) + 1}
            </div>
            <div className="text-sm text-slate-600 dark:text-gray-400">
              Current Round
            </div>
          </div>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
          <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Task List
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Manage your tasks and track your focus sessions.
          {activeTasks.length > 0 && (
            <div className="flex gap-2 mt-2">
              <Badge className="bg-blue-500 text-white">
                Current Task: {activeTasks[0]?.title}
              </Badge>
            </div>
          )}
          {incompleteTasks.length > 1 && (
            <div className="text-xs text-muted-foreground mt-2 dark:text-gray-500">Drag tasks to adjust order or level</div>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add new task */}
        <div className="flex gap-2">
          <Input
            placeholder="Add new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <Button onClick={handleAddTask} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* 任务列表 */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {/* 未完成的任务 */}
          {incompleteTasks.map((task, index) => (
            <TaskItem
              key={`root-${task.id}`}
              task={task}
              level={0}
              isActive={activeTasks.some(activeTask => activeTask.id === task.id)}
              isLeaf={isLeafTask(task)}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
              onAddChild={onAddChildTask}
              onMove={onMoveTask}
              editingId={editingId}
              setEditingId={setEditingId}
              editingTitle={editingTitle}
              setEditingTitle={setEditingTitle}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
              handleEditKeyPress={handleEditKeyPress}
              isDraggable={incompleteTasks.length > 1 && editingId !== task.id}
              focusedTaskId={focusedTaskId}
              setFocusedTaskId={setFocusedTaskId}
            />
          ))}

          {/* 已完成的任务 */}
          {completedTasks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">Completed Tasks</h4>
              <div className="space-y-1">
                {completedTasks.map(task => (
                  <TaskItem
                    key={`completed-${task.id}`}
                    task={task}
                    level={0}
                    isActive={false}
                    isLeaf={isLeafTask(task)}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                    onEdit={onEditTask}
                    onAddChild={onAddChildTask}
                    onMove={onMoveTask}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    editingTitle={editingTitle}
                    setEditingTitle={setEditingTitle}
                    saveEdit={saveEdit}
                    cancelEdit={cancelEdit}
                    handleEditKeyPress={handleEditKeyPress}
                    isDraggable={false}
                    focusedTaskId={focusedTaskId}
                    setFocusedTaskId={setFocusedTaskId}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
