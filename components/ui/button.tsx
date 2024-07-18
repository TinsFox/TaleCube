import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow ',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm',
        outline: 'border border-input bg-background shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm',
        ghost: '',
        link: 'text-primary underline-offset-4'
      },
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'size-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
const ConfirmButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        {...props}
        className={cn(
          buttonVariants({ variant, size, className }),
          'rounded-full bg-[#68DE7C] text-center text-lg font-semibold leading-7 text-white hover:bg-[#68DE7C] hover:text-white'
        )}
      />
    )
  }
)
ConfirmButton.displayName = 'ConfirmButton'

const IdeaButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        {...props}
        className={cn(
          buttonVariants({ variant, size, className }),
          'rounded-full bg-primary text-center text-lg font-semibold leading-7 text-white hover:bg-primary hover:text-white'
        )}
      />
    )
  }
)
IdeaButton.displayName = 'IdeaButton'
export { Button, buttonVariants, ConfirmButton, IdeaButton }
