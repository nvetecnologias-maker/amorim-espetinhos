import * as React from 'react'
import { cn } from '@/lib/utils'

export const inputClass =
  'flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-bege placeholder:text-bege/35 transition focus-visible:border-brasa/70 focus-visible:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brasa/30 disabled:opacity-50 sm:text-sm'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(inputClass, className)} {...props} />
))
Input.displayName = 'Input'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(inputClass, 'h-auto min-h-[84px] resize-none py-3', className)} {...props} />
))
Textarea.displayName = 'Textarea'

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
  <select ref={ref} className={cn(inputClass, 'appearance-none bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10 [&>option]:bg-carvao', className)}
    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23F3E9D8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
    {...props} />
))
Select.displayName = 'Select'

export { Input, Select, Textarea }
