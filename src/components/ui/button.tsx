import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brasa focus-visible:ring-offset-2 focus-visible:ring-offset-profundo disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:size-[1.1em] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-queimado to-brasa text-white shadow-ember hover:brightness-110 hover:-translate-y-0.5',
        outline: 'border border-white/20 bg-white/5 text-bege backdrop-blur hover:bg-white/10 hover:border-white/40',
        ghost: 'text-bege hover:bg-white/10',
        light: 'bg-bege text-profundo hover:bg-white',
        destructive: 'bg-queimado/15 text-[#ff8a70] hover:bg-queimado/30',
      },
      size: {
        default: 'h-11 px-5 text-sm',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-sm tracking-[0.14em] uppercase',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }
