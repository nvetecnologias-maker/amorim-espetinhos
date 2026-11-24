import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root
const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn('no-scrollbar inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.03] p-1', className)} {...props} />
))
TabsList.displayName = 'TabsList'
const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn('inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold text-bege/60 transition data-[state=active]:bg-bege data-[state=active]:text-profundo hover:text-bege', className)} {...props} />
))
TabsTrigger.displayName = 'TabsTrigger'
const TabsContent = TabsPrimitive.Content
export { Tabs, TabsContent, TabsList, TabsTrigger }
