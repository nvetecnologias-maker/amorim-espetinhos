import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close
const DialogTitle = DialogPrimitive.Title
const DialogDescription = DialogPrimitive.Description

const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn('fixed inset-0 z-50 bg-black/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)}
      {...props}
    />
  ),
)
DialogOverlay.displayName = 'DialogOverlay'

type ContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { side?: 'center' | 'right' | 'bottom-sheet'; hideClose?: boolean }

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, ContentProps>(
  ({ className, children, side = 'center', hideClose, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 border border-white/10 bg-carvao text-bege shadow-deep outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-300',
          side === 'center' &&
            'inset-x-0 bottom-0 max-h-[94dvh] overflow-y-auto rounded-t-3xl data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(920px,94vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:data-[state=open]:slide-in-from-bottom-4 sm:data-[state=open]:fade-in-0 sm:data-[state=closed]:fade-out-0',
          side === 'right' &&
            'inset-0 flex flex-col data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[460px] sm:rounded-l-3xl sm:data-[state=open]:slide-in-from-right sm:data-[state=closed]:slide-out-to-right',
          className,
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-bege backdrop-blur transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brasa">
            <X className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
)
DialogContent.displayName = 'DialogContent'

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger }
