export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
  completedAt?: string
  totalTime: number // 累计耗时，以分钟为单位
  completedToday?: boolean // 新增：当天是否完成
  dualTaskType?: "A" | "B" // 新增：双任务模式下的任务类型
  children: Task[] // 新增：子任务数组
  parentId?: string | null // 新增：父任务ID
  level?: number // 新增：任务层级深度
}
