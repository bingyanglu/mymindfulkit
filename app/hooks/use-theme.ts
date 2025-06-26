"use client"

import { useTheme as useNextTheme } from "next-themes"
import { useEffect, useState } from "react"

export type Theme = "light" | "dark"

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  // 确保组件已挂载
  useEffect(() => {
    setMounted(true)
  }, [])

  // 如果组件未挂载，返回默认值
  if (!mounted) {
    return {
      theme: "light" as Theme,
      toggleTheme: () => {},
    }
  }

  // 获取当前实际主题（考虑系统主题）
  const currentTheme = theme === "system" ? systemTheme : theme

  const toggleTheme = () => {
    if (currentTheme === "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  return { 
    theme: (currentTheme || "light") as Theme, 
    toggleTheme 
  }
}
