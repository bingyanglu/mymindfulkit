export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
  completedAt?: string
  totalTime: number // 累计耗时，以分钟为单位
  completedToday?: boolean // 新增：当天是否完成
  dualTaskType?: "A" | "B" // 新增：双任务模式下的任务类型
}
