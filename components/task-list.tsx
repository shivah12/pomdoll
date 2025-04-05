"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, TagIcon, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { TaskDialog } from "@/components/task-dialog"

type TaskColor = "violet" | "pink" | "yellow" | "red" | "green" | "black"

interface TaskListProps {
  theme: "barbie" | "kawaii" | "pookie"
  onTaskComplete?: () => void
  tasks: any[]
  setTasks: React.Dispatch<React.SetStateAction<any[]>>
}

export function TaskList({ theme, onTaskComplete, tasks, setTasks }: TaskListProps) {
  const { toast } = useToast()
  const [showTagInput, setShowTagInput] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [isLoading, setIsLoading] = useState(false)
  const [pendingTaskIds] = useState(new Set<string>())

  const themeColor = theme === "barbie" ? "pink" : theme === "kawaii" ? "purple" : "blue"

  const availableTags = Array.from(new Set(tasks.map(task => task.tags).filter(Boolean))).sort()

  const addTask = async (taskData: { title: string; tags: string; priority: "low" | "medium" | "high" | "none"; color: TaskColor }) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error adding task",
          description: "You must be logged in to add tasks",
          variant: "destructive",
        })
        return
      }

      // Create task in Supabase first
      const { data: newTaskData, error: insertError } = await supabase
        .from("tasks")
        .insert([
          {
            title: taskData.title,
            user_id: user.id,
            tags: taskData.tags,
            priority: taskData.priority !== "none" ? taskData.priority : null,
            color: taskData.color,
            completed: false,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.error("Error saving task to database:", insertError)
        toast({
          title: "Error adding task",
          description: "Could not save task to database. Please try again.",
          variant: "destructive",
        })
        return
      }

      if (!newTaskData) {
        toast({
          title: "Error adding task",
          description: "Could not create task. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Update local state with the task from Supabase
      setTasks((prevTasks) => [newTaskData, ...prevTasks])

      toast({
        title: "Task added",
        description: "Your new task has been added successfully",
      })

    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "Error adding task",
        description: "Please try again",
        variant: "destructive",
      })
      throw error // Re-throw the error so the dialog knows the operation failed
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const newCompleted = !task.completed

    try {
      // Update local state first
      setTasks(
        tasks.map((task) => {
          if (task.id === id) {
            // Call the onTaskComplete callback if provided and task is being completed
            if (newCompleted && onTaskComplete) {
              onTaskComplete()
            }

            return { ...task, completed: newCompleted }
          }
          return task
        }),
      )

      // Try to update in Supabase if the table exists
      try {
        const { error } = await supabase.from("tasks").update({ completed: newCompleted }).eq("id", id)

        if (error && !error.message.includes("does not exist")) {
          console.error("Error updating task in database:", error)
        }
      } catch (error) {
        console.log("Task table might not exist yet, continuing with local storage")
      }

      if (newCompleted) {
        toast({
          title: "Task completed",
          description: "Great job! Keep up the good work!",
        })
      }
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error updating task",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const deleteTask = async (id: string) => {
    try {
      // Update local state first
      setTasks(tasks.filter((task) => task.id !== id))

      // Try to delete from Supabase if the table exists
      try {
        const { error } = await supabase.from("tasks").delete().eq("id", id)

        if (error && !error.message.includes("does not exist")) {
          console.error("Error deleting task from database:", error)
        }
      } catch (error) {
        console.log("Task table might not exist yet, continuing with local storage")
      }

      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error deleting task",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const addTagToTask = async (taskId: string, tag: string) => {
    if (!tag.trim()) return

    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const updatedTags = [...(task.tags || []), tag]

    try {
      // Update local state first
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, tags: updatedTags } : task)))

      // Try to update in Supabase if the table exists
      try {
        const { error } = await supabase.from("tasks").update({ tags: updatedTags }).eq("id", taskId)

        if (error && !error.message.includes("does not exist")) {
          console.error("Error updating task tags in database:", error)
        }
      } catch (error) {
        console.log("Task table might not exist yet, continuing with local storage")
      }
    } catch (error) {
      console.error("Error adding tag to task:", error)
      toast({
        title: "Error adding tag",
        description: "Please try again",
        variant: "destructive",
      })
    }

    setShowTagInput(null)
  }

  const removeTagFromTask = async (taskId: string, tagToRemove: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const updatedTags = (task.tags || []).filter((tag) => tag !== tagToRemove)

    try {
      // Update local state first
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, tags: updatedTags } : task)))

      // Try to update in Supabase if the table exists
      try {
        const { error } = await supabase.from("tasks").update({ tags: updatedTags }).eq("id", taskId)

        if (error && !error.message.includes("does not exist")) {
          console.error("Error removing tag from task in database:", error)
        }
      } catch (error) {
        console.log("Task table might not exist yet, continuing with local storage")
      }
    } catch (error) {
      console.error("Error removing tag from task:", error)
      toast({
        title: "Error removing tag",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const getTagColor = (tag: string) => {
    const tagColors: Record<string, string> = {
      work: "blue",
      personal: "green",
      urgent: "red",
      health: "purple",
    }

    return tagColors[tag] || "gray"
  }

  const getPriorityColor = (priority?: "low" | "medium" | "high" | null) => {
    switch (priority) {
      case "high":
        return "red"
      case "medium":
        return "yellow"
      case "low":
        return "green"
      default:
        return "gray"
    }
  }

  const editTask = async (id: string, taskData: { title: string; tags: string; priority: "low" | "medium" | "high" | "none"; color: TaskColor }) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    try {
      // Update local state first
      setTasks(tasks.map((t) => (t.id === id ? { ...t, ...taskData } : t)))

      // Try to update in Supabase if the table exists
      try {
        const { error } = await supabase
          .from("tasks")
          .update({
            title: taskData.title,
            tags: taskData.tags,
            priority: taskData.priority !== "none" ? taskData.priority : null,
            color: taskData.color,
          })
          .eq("id", id)

        if (error && !error.message.includes("does not exist")) {
          console.error("Error updating task in database:", error)
          toast({
            title: "Warning",
            description: "Task updated locally but couldn't be saved to the database",
            variant: "default",
          })
        }
      } catch (error) {
        console.log("Task table might not exist yet, continuing with local storage")
      }

      toast({
        title: "Task updated",
        description: "Your task has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error updating task",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={filter} onValueChange={(value: "all" | "active" | "completed") => setFilter(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <TaskDialog theme={theme} onAddTask={addTask} availableTags={availableTags} />
      </div>

      <AnimatePresence>
        {tasks
          .filter((task) => {
            if (filter === "active") return !task.completed
            if (filter === "completed") return task.completed
            return true
          })
          .map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                task.completed ? "bg-gray-50" : 
                task.color === "violet" ? "bg-violet-50/30" :
                task.color === "pink" ? "bg-pink-50/30" :
                task.color === "yellow" ? "bg-yellow-50/30" :
                task.color === "red" ? "bg-red-50/30" :
                task.color === "green" ? "bg-green-50/30" :
                task.color === "black" ? "bg-black/5" :
                `bg-${themeColor}-50/30`
              } ${
                task.color === "violet" ? "border-violet-200" :
                task.color === "pink" ? "border-pink-200" :
                task.color === "yellow" ? "border-yellow-200" :
                task.color === "red" ? "border-red-200" :
                task.color === "green" ? "border-green-200" :
                task.color === "black" ? "border-black/20" :
                theme === "barbie" ? "border-pink-200" :
                theme === "kawaii" ? "border-purple-200" :
                "border-blue-200"
              } shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className={`rounded-full ${
                    task.completed 
                      ? task.color === "violet" ? "bg-violet-500 border-violet-500" :
                        task.color === "pink" ? "bg-pink-500 border-pink-500" :
                        task.color === "yellow" ? "bg-yellow-500 border-yellow-500" :
                        task.color === "red" ? "bg-red-500 border-red-500" :
                        task.color === "green" ? "bg-green-500 border-green-500" :
                        task.color === "black" ? "bg-black border-black" :
                        `bg-${themeColor}-500 border-${themeColor}-500`
                      : ""
                  }`}
                />
                <div className="flex flex-col">
                  <span className={`${task.completed ? "line-through text-gray-400" : ""} font-quicksand`}>
                    {task.title}
                  </span>
                  {task.priority && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`h-2 w-2 rounded-full bg-${getPriorityColor(task.priority)}-500`}></div>
                      <span className="text-xs text-muted-foreground capitalize">{task.priority} priority</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {task.tags && (
                  <Badge
                    variant="outline"
                    className={`bg-${getTagColor(task.tags)}-100 text-${getTagColor(task.tags)}-700 border-${getTagColor(task.tags)}-200 hover:bg-${getTagColor(task.tags)}-200 rounded-full font-quicksand`}
                  >
                    {task.tags}
                  </Badge>
                )}

                <TaskDialog
                  theme={theme}
                  onAddTask={addTask}
                  onEditTask={editTask}
                  availableTags={availableTags}
                  task={task}
                  mode="edit"
                  trigger={
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 rounded-full"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  }
                />

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:text-red-500 rounded-full"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  )
}

