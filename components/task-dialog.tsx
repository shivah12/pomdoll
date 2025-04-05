"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { Plus, Pencil } from "lucide-react"

type TaskColor = "violet" | "pink" | "yellow" | "red" | "green" | "black"

interface Task {
  id: string
  title: string
  tags: string
  priority: "low" | "medium" | "high" | "none"
  color: TaskColor
}

interface TaskDialogProps {
  theme: "barbie" | "kawaii" | "pookie"
  onAddTask: (task: Omit<Task, "id">) => void
  onEditTask?: (id: string, task: Omit<Task, "id">) => void
  availableTags: string[]
  task?: Task
  mode?: "create" | "edit"
  trigger?: React.ReactNode
}

export function TaskDialog({ theme, onAddTask, onEditTask, availableTags, task, mode = "create", trigger }: TaskDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [title, setTitle] = React.useState(task?.title || "")
  const [selectedTag, setSelectedTag] = React.useState<string>(task?.tags || "no-tag")
  const [selectedPriority, setSelectedPriority] = React.useState<"low" | "medium" | "high" | "none">(task?.priority || "none")
  const [selectedColor, setSelectedColor] = React.useState<TaskColor>(task?.color || "violet")
  const [newTag, setNewTag] = React.useState("")

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setIsSubmitting(false) // Reset submitting state when dialog closes
      if (task) {
        // If editing, reset to task values
        setTitle(task.title)
        setSelectedTag(task.tags || "no-tag")
        setSelectedPriority(task.priority)
        setSelectedColor(task.color)
      } else {
        // If creating new, reset to defaults
        setTitle("")
        setSelectedTag("no-tag")
        setSelectedPriority("none")
        setSelectedColor("violet")
      }
      setNewTag("")
    }
  }, [open, task])

  const themeColor = theme === "barbie" ? "pink" : theme === "kawaii" ? "purple" : "blue"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isSubmitting) return

    setIsSubmitting(true)

    const taskData = {
      title: title.trim(),
      tags: selectedTag === "new-tag" && newTag.trim() 
        ? newTag.trim()
        : selectedTag !== "no-tag" 
          ? selectedTag
          : "",
      priority: selectedPriority,
      color: selectedColor,
    }

    // Validate new tag doesn't already exist
    if (selectedTag === "new-tag" && newTag.trim()) {
      if (availableTags.includes(newTag.trim())) {
        // If tag already exists, just use the existing tag
        taskData.tags = newTag.trim()
      }
    }

    try {
      if (mode === "edit" && task && onEditTask) {
        await onEditTask(task.id, taskData)
      } else {
        await onAddTask(taskData)
      }
      setOpen(false) // Close dialog only after successful operation
    } catch (error) {
      console.error("Error handling task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Ensure unique tags in the select
  const uniqueTags = React.useMemo(() => {
    return Array.from(new Set(availableTags)).sort()
  }, [availableTags])

  const colorOptions: { value: TaskColor; label: string; bg: string; text: string }[] = [
    { value: "violet", label: "Violet", bg: "bg-violet-500", text: "text-white" },
    { value: "pink", label: "Pink", bg: "bg-pink-500", text: "text-white" },
    { value: "yellow", label: "Yellow", bg: "bg-yellow-500", text: "text-black" },
    { value: "red", label: "Red", bg: "bg-red-500", text: "text-white" },
    { value: "green", label: "Green", bg: "bg-green-500", text: "text-white" },
    { value: "black", label: "Black", bg: "bg-black", text: "text-white" },
  ]

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        // Only allow closing if we're not in the middle of submitting
        if (!isSubmitting) {
          setOpen(newOpen)
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className={`rounded-full bg-gradient-to-r ${
              theme === "barbie"
                ? "from-pink-400 to-pink-600"
                : theme === "kawaii"
                  ? "from-purple-400 to-purple-600"
                  : "from-blue-400 to-blue-600"
            } shadow-md hover:shadow-lg transition-all duration-300 font-quicksand`}
          >
            {mode === "create" ? (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-1" />
                Edit Task
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "Add New Task" : "Edit Task"}</DialogTitle>
            <DialogDescription>
              {mode === "create" ? "Create a new task with tags and priority." : "Modify your task details."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your task..."
                className="col-span-3"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tag">Tag</Label>
              <Select value={selectedTag} onValueChange={setSelectedTag} disabled={isSubmitting}>
                <SelectTrigger id="tag">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="no-tag">No Tag</SelectItem>
                    {uniqueTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                    <SelectItem value="new-tag">+ Add New Tag</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {selectedTag === "new-tag" && (
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter new tag name..."
                  className="mt-2"
                  disabled={isSubmitting}
                />
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority} disabled={isSubmitting}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-8 h-8 rounded-full ${color.bg} ${color.text} flex items-center justify-center
                      ${selectedColor === color.value ? "ring-2 ring-offset-2 ring-black" : ""}
                      transition-all duration-200 hover:scale-110`}
                    disabled={isSubmitting}
                    title={color.label}
                  >
                    {selectedColor === color.value && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className={`rounded-full bg-gradient-to-r ${
                theme === "barbie"
                  ? "from-pink-400 to-pink-600"
                  : theme === "kawaii"
                    ? "from-purple-400 to-purple-600"
                    : "from-blue-400 to-blue-600"
              } shadow-md hover:shadow-lg transition-all duration-300 font-quicksand`}
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting 
                ? mode === "create" ? "Adding..." : "Saving..."
                : mode === "create" ? "Add Task" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 