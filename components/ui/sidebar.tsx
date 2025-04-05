"use client"

import * as React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SidebarContextProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextProps>({
  collapsed: false,
  setCollapsed: () => {},
})

interface SidebarProviderProps {
  children: ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [collapsed, setCollapsed] = useState(false)

  return <SidebarContext.Provider value={{ collapsed, setCollapsed }}>{children}</SidebarContext.Provider>
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: "icon" | boolean
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsible, children, ...props }, ref) => {
    const { collapsed } = useContext(SidebarContext)

    const baseClassName = "flex flex-col h-screen border-r"

    const collapsibleClassName = collapsible ? (collapsed ? "w-16" : "w-64") : "w-64"

    return (
      <div ref={ref} className={cn(baseClassName, collapsibleClassName, className)} {...props}>
        {children}
      </div>
    )
  },
)
Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex-shrink-0", className)} {...props}></div>
  },
)
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex-1 overflow-y-auto", className)} {...props}></div>
  },
)
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex-shrink-0", className)} {...props}></div>
  },
)
SidebarFooter.displayName = "SidebarFooter"

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => {
    return <ul ref={ref} className={cn("space-y-1", className)} {...props}></ul>
  },
)
SidebarMenu.displayName = "SidebarMenu"

interface SidebarMenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {}

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(({ className, ...props }, ref) => {
  return <li ref={ref} className={cn("", className)} {...props}></li>
})
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  tooltip?: string
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, tooltip, children, ...props }, ref) => {
    const { collapsed } = useContext(SidebarContext)

    return (
      <button
        ref={ref}
        className={cn(
          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-foreground",
          isActive && "bg-secondary text-foreground",
          collapsed && "justify-center",
          className,
        )}
        {...props}
      >
        {children}
        {tooltip && !collapsed && <span className="ml-auto opacity-0 group-hover:opacity-100">{tooltip}</span>}
      </button>
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { collapsed } = useContext(SidebarContext)

    return (
      <div
        ref={ref}
        className={cn("flex-1 p-4", collapsed ? "ml-16" : "ml-64", "transition-all duration-300", className)}
        {...props}
      >
        {props.children}
      </div>
    )
  },
)
SidebarInset.displayName = "SidebarInset"

