import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { 
  useSidebar, 
  SidebarProvider, 
  SIDEBAR_WIDTH, 
  SIDEBAR_WIDTH_MOBILE, 
  SIDEBAR_WIDTH_ICON 
} from "./sidebar-context"

import {
  Sidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent
} from "./sidebar-components"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent
} from "./sidebar-group"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "./sidebar-menu"

// Wrap SidebarProvider with TooltipProvider
const EnhancedSidebarProvider = ({ 
  className, 
  style, 
  children, 
  ...props 
}: React.ComponentPropsWithoutRef<typeof SidebarProvider>) => {
  return (
    <SidebarProvider {...props}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
            className
          )}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarProvider>
  )
}
EnhancedSidebarProvider.displayName = "SidebarProvider"

export {
  EnhancedSidebarProvider as SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
