"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { Task } from "../types/task"

// 递归查找任务的辅助函数
const findTaskById = (tasks: Task[], id: string): Task | null => {
  for (const task of tasks) {
    if (task.id === id) return task
    if (task.children && task.children.length > 0) {
      const found = findTaskById(task.children, id)
      if (found) return found
    }
  }
  return null
}

// 递归查找任务及其父任务的辅助函数
const findTaskAndParent = (tasks: Task[], id: string, parent: Task | null = null): [Task | null, Task | null] => {
  for (const task of tasks) {
    if (task.id === id) return [task, parent]
    if (task.children && task.children.length > 0) {
      const [found, foundParent] = findTaskAndParent(task.children, id, task)
      if (found) return [found, foundParent]
    }
  }
  return [null, null]
}

// 递归更新任务的辅助函数
const updateTaskInTree = (tasks: Task[], updatedTask: Task): Task[] => {
  return tasks.map(task => {
    if (task.id === updatedTask.id) {
      return updatedTask
    }
    if (task.children && task.children.length > 0) {
      return {
        ...task,
        children: updateTaskInTree(task.children, updatedTask)
      }
    }
    return task
  })
}

// 递归删除任务的辅助函数
const deleteTaskFromTree = (tasks: Task[], id: string): Task[] => {
  return tasks.filter(task => {
    if (task.id === id) return false
    if (task.children && task.children.length > 0) {
      task.children = deleteTaskFromTree(task.children, id)
    }
    return true
  })
}

// 递归获取所有任务ID的辅助函数
const getAllTaskIds = (tasks: Task[]): string[] => {
  return tasks.reduce((ids, task) => {
    ids.push(task.id)
    if (task.children && task.children.length > 0) {
      ids = [...ids, ...getAllTaskIds(task.children)]
    }
    return ids
  }, [] as string[])
}

// 递归展平任务树的辅助函数，用于排序和展示
const flattenTaskTree = (tasks: Task[], parentCompleted = false): Task[] => {
  return tasks.reduce((flat, task) => {
    // 如果父任务已完成，所有子任务也应该被标记为已完成
    const effectiveTask = parentCompleted ? { ...task, completed: true } : task
    flat.push(effectiveTask)
    if (task.children && task.children.length > 0) {
      flat = [...flat, ...flattenTaskTree(task.children, effectiveTask.completed)]
    }
    return flat
  }, [] as Task[])
}

// 检查任务是否为叶子节点（没有子任务）
const isLeafTask = (task: Task): boolean => {
  return !task.children || task.children.length === 0
}

// 检查任务是否可以被标记为完成（所有子任务都已完成）
const canMarkAsCompleted = (task: Task): boolean => {
  if (isLeafTask(task)) return true
  return task.children.every(child => child.completed)
}

// 更新父任务的完成状态
const updateParentTaskStatus = (tasks: Task[], childId: string): Task[] => {
  // 找到子任务的父任务
  let parentTask: Task | null = null
  let parentTaskIndex = -1
  
  // 查找父任务
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]
    if (task.children && task.children.some(child => child.id === childId)) {
      parentTask = task
      parentTaskIndex = i
      break
    }
    
    // 递归查找
    if (task.children && task.children.length > 0) {
      const updatedChildren = updateParentTaskStatus(task.children, childId)
      if (updatedChildren !== task.children) {
        tasks[i] = { ...task, children: updatedChildren }
        
        // 检查当前任务是否应该被标记为完成
        if (tasks[i].children.every(child => child.completed) && !tasks[i].completed) {
          tasks[i] = { 
            ...tasks[i], 
            completed: true,
            completedAt: new Date().toISOString()
          }
        } else if (tasks[i].children.some(child => !child.completed) && tasks[i].completed) {
          tasks[i] = { 
            ...tasks[i], 
            completed: false,
            completedAt: undefined
          }
        }
        
        return [...tasks]
      }
    }
  }
  
  // 如果找到了父任务，更新其状态
  if (parentTask && parentTaskIndex !== -1) {
    const allChildrenCompleted = parentTask.children.every(child => child.completed)
    if (allChildrenCompleted && !parentTask.completed) {
      tasks[parentTaskIndex] = { 
        ...parentTask, 
        completed: true,
        completedAt: new Date().toISOString()
      }
    } else if (!allChildrenCompleted && parentTask.completed) {
      tasks[parentTaskIndex] = { 
        ...parentTask, 
        completed: false,
        completedAt: undefined
      }
    }
  }
  
  return tasks
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [dragOrder, setDragOrder] = useState<string[]>([]) // 新增：跟踪拖拽顺序
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null) // 新增：当前专注的任务ID

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("pomodoro-tasks")
      const savedDragOrder = localStorage.getItem("pomodoro-drag-order")
      
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks)
        // 确保每个任务都有 children 字段
        const migratedTasks = parsedTasks.map((task: Task) => ({
          ...task,
          children: task.children || [],
          level: task.level || 0
        }))
        setTasks(migratedTasks)
        
        // 加载拖拽顺序，如果没有保存的则使用任务ID数组
        if (savedDragOrder) {
          setDragOrder(JSON.parse(savedDragOrder))
        } else {
          // 获取所有任务ID（包括子任务）
          setDragOrder(getAllTaskIds(migratedTasks))
        }
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error)
      setTasks([])
      setDragOrder([])
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem("pomodoro-tasks", JSON.stringify(tasks))
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error)
    }
  }, [tasks])

  // Save drag order to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("pomodoro-drag-order", JSON.stringify(dragOrder))
    } catch (error) {
      console.error("Error saving drag order to localStorage:", error)
    }
  }, [dragOrder])

  // 添加顶级任务
  const addTask = (title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      totalTime: 0,
      children: [],
      parentId: null,
      level: 0
    }
    setTasks((prev) => [...prev, newTask])
    setDragOrder((prevOrder) => [...prevOrder, newTask.id])
  }

  // 添加子任务
  const addChildTask = (parentId: string, title: string) => {
    const newChildTask: Task = {
      id: `child-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      totalTime: 0,
      children: [],
      parentId: parentId,
      level: 0 // 临时值，将在下面更新
    }
    
    setTasks(prevTasks => {
      // 递归查找父任务并添加子任务
      const addChildToParent = (tasks: Task[]): Task[] => {
        return tasks.map(task => {
          if (task.id === parentId) {
            // 更新子任务的层级
            newChildTask.level = (task.level || 0) + 1
            return {
              ...task,
              children: [...task.children, newChildTask]
            }
          }
          if (task.children && task.children.length > 0) {
            return {
              ...task,
              children: addChildToParent(task.children)
            }
          }
          return task
        })
      }
      
      const updatedTasks = addChildToParent(prevTasks)
      return updatedTasks
    })
    
    // 更新拖拽顺序
    setDragOrder(prevOrder => [...prevOrder, newChildTask.id])
  }

  // 切换任务完成状态
  const toggleTask = (id: string) => {
    setTasks(prevTasks => {
      // 递归查找并更新任务
      const toggleTaskById = (tasks: Task[]): Task[] => {
        return tasks.map(task => {
          if (task.id === id) {
            // 只有叶子节点任务才能被直接切换状态
            if (!isLeafTask(task)) {
              return task // 如果不是叶子节点，不允许直接切换
            }
            
            const newStatus = !task.completed
            return {
              ...task,
              completed: newStatus,
              completedAt: newStatus ? new Date().toISOString() : undefined
            }
          }
          
          if (task.children && task.children.length > 0) {
            const updatedChildren = toggleTaskById(task.children)
            
            // 如果子任务有变化，更新父任务
            if (updatedChildren.some((child, i) => child !== task.children[i])) {
              return {
                ...task,
                children: updatedChildren
              }
            }
          }
          
          return task
        })
      }
      
      let updatedTasks = toggleTaskById(prevTasks)
      
      // 更新父任务的状态
      updatedTasks = updateParentTaskStatus(updatedTasks, id)
      
      return updatedTasks
    })
  }

  // 删除任务
  const deleteTask = (id: string) => {
    // 找到要删除的任务，以便获取其所有子任务ID
    const taskToDelete = findTaskById(tasks, id)
    const idsToRemove = taskToDelete ? [id, ...getAllTaskIds(taskToDelete.children)] : [id]
    
    // 从任务树中删除任务
    setTasks(prevTasks => deleteTaskFromTree(prevTasks, id))
    
    // 从拖拽顺序中移除所有相关ID
    setDragOrder(prevOrder => prevOrder.filter(taskId => !idsToRemove.includes(taskId)))
  }

  // 编辑任务
  const editTask = (id: string, newTitle: string) => {
    setTasks(prevTasks => {
      const task = findTaskById(prevTasks, id)
      if (!task) return prevTasks
      
      const updatedTask = { ...task, title: newTitle.trim() }
      return updateTaskInTree(prevTasks, updatedTask)
    })
  }

  // 添加时间到任务
  const addTimeToTask = (taskTitle: string, minutes: number) => {
    setTasks(prevTasks => {
      // 查找匹配标题的任务
      const updateTimeByTitle = (tasks: Task[]): [Task[], boolean] => {
        let updated = false
        const updatedTasks = tasks.map(task => {
          if (task.title === taskTitle) {
            updated = true
            return {
              ...task,
              totalTime: task.totalTime + minutes
            }
          }
          
          if (task.children && task.children.length > 0) {
            const [updatedChildren, childUpdated] = updateTimeByTitle(task.children)
            if (childUpdated) {
              updated = true
              return {
                ...task,
                children: updatedChildren
              }
            }
          }
          
          return task
        })
        
        return [updatedTasks, updated]
      }
      
      const [updatedTasks, _] = updateTimeByTitle(prevTasks)
      return updatedTasks
    })
  }

  // 重新排序任务
  const reorderTasks = useCallback(
    (startIndex: number, endIndex: number) => {
      setDragOrder((prevDragOrder) => {
        // 获取未完成的顶级任务ID
        const incompleteTaskIds = prevDragOrder.filter((id) => {
          const task = findTaskById(tasks, id)
          return task && !task.completed && (!task.parentId || task.parentId === null)
        })

        if (
          startIndex < 0 ||
          startIndex >= incompleteTaskIds.length ||
          endIndex < 0 ||
          endIndex >= incompleteTaskIds.length
        ) {
          return prevDragOrder
        }

        const draggedId = incompleteTaskIds[startIndex]
        const droppedOnId = incompleteTaskIds[endIndex]

        const newOrder = [...prevDragOrder]
        const fromIndex = newOrder.indexOf(draggedId)
        const toIndex = newOrder.indexOf(droppedOnId)

        if (fromIndex === -1 || toIndex === -1) {
          return prevDragOrder
        }

        const [removed] = newOrder.splice(fromIndex, 1)
        newOrder.splice(toIndex, 0, removed)

        return newOrder
      })
    },
    [tasks],
  )

  // 移动任务到新的父任务下或调整同级任务顺序
  const moveTask = useCallback(
    (taskId: string, targetTaskId: string, position: 'before' | 'after' | 'inside' = 'after') => {
      setTasks(prevTasks => {
        // 0. 创建一个深拷贝，避免直接修改状态
        let updatedTasks = JSON.parse(JSON.stringify(prevTasks)) as Task[];
        
        // 1. 找到被拖动的任务和它的父任务
        const [originalDraggedTask, originalDraggedParent] = findTaskAndParent(prevTasks, taskId)
        
        // 如果找不到任务，不做任何改变
        if (!originalDraggedTask) return prevTasks
        
        // 2. 找到目标任务和它的父任务
        const [originalTargetTask, originalTargetParent] = findTaskAndParent(prevTasks, targetTaskId)
        
        // 如果找不到目标任务，不做任何改变
        if (!originalTargetTask) return prevTasks
        
        // 3. 检查是否试图将任务拖到其子任务中（这会导致循环引用）
        const isTargetDescendantOfDragged = (task: Task, potentialAncestorId: string): boolean => {
          if (task.id === potentialAncestorId) return true
          if (!task.children || task.children.length === 0) return false
          return task.children.some(child => isTargetDescendantOfDragged(child, potentialAncestorId))
        }
        
        if (position === 'inside' && isTargetDescendantOfDragged(originalDraggedTask, targetTaskId)) {
          console.warn("不能将任务拖到其子任务中")
          return prevTasks
        }
        
        // 4. 从深拷贝中找到对应的任务和父任务
        const [draggedTask, draggedParent] = findTaskAndParent(updatedTasks, taskId)
        const [targetTask, targetParent] = findTaskAndParent(updatedTasks, targetTaskId)
        
        if (!draggedTask || !targetTask) return prevTasks
        
        // 5. 从原位置移除任务
        if (draggedParent) {
          // 如果有父任务，从父任务的子任务中移除
          draggedParent.children = draggedParent.children.filter(child => child.id !== taskId)
        } else {
          // 如果是顶级任务，从顶级任务列表中移除
          updatedTasks = updatedTasks.filter(task => task.id !== taskId)
        }
        
        // 6. 根据位置添加到新位置
        if (position === 'inside') {
          // 更新任务的父ID和层级
          draggedTask.parentId = targetTask.id
          draggedTask.level = (targetTask.level || 0) + 1
          
          // 添加为目标任务的子任务
          targetTask.children.push(draggedTask)
        } else {
          if (targetParent) {
            // 如果目标任务有父任务
            const targetIndex = targetParent.children.findIndex(child => child.id === targetTaskId)
            
            // 更新任务的父ID和层级
            draggedTask.parentId = targetParent.id
            draggedTask.level = (targetParent.level || 0) + 1
            
            // 插入到目标任务前面或后面
            const insertIndex = position === 'before' ? targetIndex : targetIndex + 1
            targetParent.children.splice(insertIndex, 0, draggedTask)
          } else {
            // 如果目标任务是顶级任务
            const targetIndex = updatedTasks.findIndex(task => task.id === targetTaskId)
            
            // 更新任务的父ID和层级
            draggedTask.parentId = null
            draggedTask.level = 0
            
            // 插入到目标任务前面或后面
            const insertIndex = position === 'before' ? targetIndex : targetIndex + 1
            updatedTasks.splice(insertIndex, 0, draggedTask)
          }
        }
        
        // 7. 更新拖拽顺序
        const allTaskIds = getAllTaskIds(updatedTasks)
        setDragOrder(allTaskIds)
        
        return updatedTasks
      })
    },
    [],
  )

  // 获取所有任务的扁平列表（用于UI展示）
  const flattenedTasks = flattenTaskTree(tasks)
  
  // 获取排序后的任务列表
  const sortedTasks = [...flattenedTasks].sort((a, b) => {
    // 首先按完成状态排序：未完成的在前
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    // 如果都是未完成的任务，按拖拽顺序排序
    if (!a.completed && !b.completed) {
      const aIndex = dragOrder.indexOf(a.id)
      const bIndex = dragOrder.indexOf(b.id)
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex
      }
    }
    
    // 如果都是已完成的任务，按创建时间排序
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  // 获取下一个要专注的任务
  const getNextFocusTask = useCallback((): Task | null => {
    // 查找第一个未完成的任务（不限于叶子节点）
    const findFirstUncompletedTask = (tasks: Task[]): Task | null => {
      // 先检查顶层任务
      for (const task of tasks) {
        if (!task.completed) {
          return task
        }
      }
      
      // 如果顶层没有未完成的任务，再递归查找子任务
      for (const task of tasks) {
        if (task.children && task.children.length > 0) {
          const childTask = findFirstUncompletedTask(task.children)
          if (childTask) return childTask
        }
      }
      
      return null
    }
    
    return findFirstUncompletedTask(tasks)
  }, [tasks])

  // 获取当前专注的任务
  const getFocusedTask = useCallback((): Task | null => {
    if (!focusedTaskId) {
      return getNextFocusTask()
    }
    return findTaskById(tasks, focusedTaskId)
  }, [focusedTaskId, tasks, getNextFocusTask])

  // 获取前两个未完成的任务
  const activeTasks = useMemo(() => {
    const focusedTask = getFocusedTask()
    if (focusedTask) {
      return [focusedTask, ...sortedTasks
        .filter(task => !task.completed && task.id !== focusedTask.id)
        .slice(0, 1)]
    }
    return sortedTasks
      .filter(task => !task.completed)
      .slice(0, 2)
  }, [sortedTasks, getFocusedTask])

  return {
    tasks: sortedTasks,
    activeTasks,
    addTask,
    addChildTask, // 新增：添加子任务
    toggleTask,
    deleteTask,
    editTask,
    addTimeToTask,
    reorderTasks,
    moveTask, // 新增：移动任务
    getNextFocusTask, // 新增：获取下一个要专注的任务
    isLeafTask, // 新增：判断是否为叶子节点
    flattenedTasks, // 新增：扁平化的任务列表
    focusedTaskId, // 新增：当前专注的任务ID
    setFocusedTaskId, // 新增：设置当前专注的任务
  }
}
