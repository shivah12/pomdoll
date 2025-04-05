import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Log the environment variables to help with debugging
console.log("Supabase URL:", supabaseUrl ? "Set" : "Not set")
console.log("Supabase Anon Key:", supabaseAnonKey ? "Set" : "Not set")

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export type Task = {
  id: string
  user_id: string
  title: string
  completed: boolean
  tags: string[]
  priority: "low" | "medium" | "high" | null
  created_at: string
}

export type FocusSession = {
  id: string
  user_id: string
  duration: number
  created_at: string
}

// Cache for user profiles
const profileCache: {
  [key: string]: {
    data: UserProfile
    timestamp: number
  }
} = {}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("No user found in getUserProfile")
      return null
    }

    // Check cache first
    const cacheKey = `profile_${user.id}`
    const cachedData = profileCache[cacheKey]
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Returning cached profile')
      return cachedData.data
    }

    console.log("User found in auth:", user.id)

    // Create a basic profile from auth data
    const profile = {
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      created_at: user.created_at || new Date().toISOString(),
    } as UserProfile

    // Update cache
    profileCache[cacheKey] = {
      data: profile,
      timestamp: Date.now()
    }

    return profile
  } catch (error) {
    console.error("Error in getUserProfile:", error)
    return null
  }
}

// Cache for tasks
const taskCache: {
  [key: string]: {
    data: Task[]
    timestamp: number
  }
} = {}

export async function getUserTasks(): Promise<Task[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return []

    // Check cache first
    const cacheKey = `tasks_${user.id}`
    const cachedData = taskCache[cacheKey]
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Returning cached tasks')
      return cachedData.data
    }

    // Check if table exists
    const { error: tableError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1)

    if (tableError) {
      console.error('Tasks table might not exist:', tableError)
      return []
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tasks:", error)
      return []
    }

    const tasks = data as Task[] || []

    // Update cache
    taskCache[cacheKey] = {
      data: tasks,
      timestamp: Date.now()
    }

    return tasks
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return []
  }
}

export async function createTask(task: Omit<Task, "id" | "user_id" | "created_at">): Promise<Task | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          ...task,
          user_id: user.id,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return data as Task
  } catch (error) {
    console.error("Error creating task:", error)
    return null
  }
}

export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, "id" | "user_id" | "created_at">>,
): Promise<Task | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // First verify the task belongs to the user
    const { data: taskData } = await supabase.from("tasks").select("*").eq("id", id).eq("user_id", user.id).single()

    if (!taskData) return null

    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id) // Ensure we only update the user's own tasks
      .select()
      .single()

    if (error) throw error

    return data as Task
  } catch (error) {
    console.error("Error updating task:", error)
    return null
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id) // Ensure we only delete the user's own tasks

    if (error) throw error

    return true
  } catch (error) {
    console.error("Error deleting task:", error)
    return false
  }
}

export async function recordFocusSession(duration: number): Promise<FocusSession | null> {
  try {
    console.log('Starting to record focus session with duration:', duration)
    
    // Validate duration
    if (!duration || duration <= 0) {
      console.error('Invalid duration:', duration)
      return null
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log('No user found, cannot record focus session')
      return null
    }

    console.log('Inserting focus session into Supabase for user:', user.id)
    
    // First check if the table exists
    const { error: tableCheckError } = await supabase
      .from('focus_sessions')
      .select('id')
      .limit(1)

    if (tableCheckError) {
      console.error('Error checking focus_sessions table:', tableCheckError)
      if (tableCheckError.message.includes('does not exist')) {
        console.error('focus_sessions table does not exist!')
        throw new Error('focus_sessions table does not exist')
      }
    }

    // Try to insert the focus session
    const { data, error } = await supabase
      .from("focus_sessions")
      .insert([
        {
          user_id: user.id,
          duration: Math.round(duration), // Ensure duration is a whole number
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error from Supabase:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw error
    }

    if (!data) {
      console.error('No data returned from Supabase after insert')
      return null
    }

    console.log('Focus session recorded successfully:', data)
    return data as FocusSession
  } catch (error) {
    console.error("Error recording focus session:", error)
    throw error // Re-throw the error to be handled by the caller
  }
}

// Cache for weekly stats
const weeklyStatsCache: {
  [key: string]: {
    data: any
    timestamp: number
  }
} = {}

export async function getWeeklyStats(): Promise<{
  completedTasks: number
  focusSessions: number
  focusTime: number
  dailyCompletions: Record<string, number>
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log('No user found, cannot get weekly stats')
      return { completedTasks: 0, focusSessions: 0, focusTime: 0, dailyCompletions: {} }
    }

    // Check cache first
    const cacheKey = `weekly_stats_${user.id}`
    const cachedData = weeklyStatsCache[cacheKey]
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Returning cached weekly stats')
      return cachedData.data
    }

    // Get one week ago date
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const oneWeekAgoStr = oneWeekAgo.toISOString()

    console.log('Fetching fresh stats since:', oneWeekAgoStr)

    // First check if tables exist
    const { error: tasksTableError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1)

    const { error: sessionsTableError } = await supabase
      .from('focus_sessions')
      .select('id')
      .limit(1)

    if (tasksTableError || sessionsTableError) {
      console.log('Tables might not exist, returning empty stats')
      return { completedTasks: 0, focusSessions: 0, focusTime: 0, dailyCompletions: {} }
    }

    // Fetch tasks and focus sessions in parallel
    const [tasksResult, sessionsResult] = await Promise.all([
      supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('created_at', oneWeekAgoStr),
      supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', oneWeekAgoStr)
    ])

    // Handle errors gracefully
    if (tasksResult.error) {
      console.error("Error fetching tasks:", tasksResult.error)
      // Don't throw, just use empty array
    }

    if (sessionsResult.error) {
      console.error("Error fetching focus sessions:", sessionsResult.error)
      // Don't throw, just use empty array
    }

    const tasks = tasksResult.data || []
    const sessions = sessionsResult.data || []

    // Process the data
    const completedTasks = tasks.length
    const focusSessions = sessions.length
    const focusTime = sessions.reduce((sum, session) => sum + (session.duration || 0), 0)

    // Calculate daily completions
    const dailyCompletions: Record<string, number> = {}
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    days.forEach(day => dailyCompletions[day] = 0)

    // Process tasks for daily completions
    tasks.forEach(task => {
      const date = new Date(task.created_at)
      const day = days[date.getDay()]
      dailyCompletions[day] = (dailyCompletions[day] || 0) + 1
    })

    const stats = {
      completedTasks,
      focusSessions,
      focusTime,
      dailyCompletions
    }

    // Update cache
    weeklyStatsCache[cacheKey] = {
      data: stats,
      timestamp: Date.now()
    }

    console.log('Returning fresh stats:', stats)
    return stats
  } catch (error) {
    console.error("Error in getWeeklyStats:", error)
    // Return empty stats instead of throwing
    return { completedTasks: 0, focusSessions: 0, focusTime: 0, dailyCompletions: {} }
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

