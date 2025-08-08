import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 nature-hover relative overflow-hidden",
  {
    variants: {
      variant: {
        default: `
          bg-gradient-to-r from-violet-600 to-cyan-500
          text-white
          shadow-lg
          hover:shadow-xl
          hover:from-violet-500
          hover:to-cyan-400
          border border-violet-500/30
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:pointer-events-none
        `,
        destructive: `
          bg-gradient-to-r from-red-500 to-red-600 
          text-white 
          shadow-lg 
          hover:shadow-xl 
          hover:from-red-600 
          hover:to-red-700
          border border-red-500/30
        `,
        outline: `
          bg-gradient-to-r from-zinc-900/40 to-zinc-800/20
          border-2 border-zinc-700/50
          text-foreground
          shadow-md
          hover:bg-gradient-to-r hover:from-zinc-900/60 hover:to-zinc-800/40
          hover:border-zinc-600/60
          hover:shadow-lg
          backdrop-blur-sm
        `,
        secondary: `
          bg-gradient-to-r from-cyan-500/20 to-emerald-500/20
          text-foreground
          shadow-md
          hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-emerald-500/30
          border border-cyan-400/30
        `,
        ghost: `
          bg-transparent
          text-foreground
          hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-cyan-500/10
          hover:text-foreground
          hover:backdrop-blur-sm
        `,
        link: `
          text-violet-400 
          underline-offset-4 
          hover:underline
          hover:text-violet-300
        `,
      },
      size: {
        default: "h-11 px-6 py-2 text-base",
        sm: "h-9 rounded-md px-4 text-sm",
        lg: "h-12 rounded-lg px-8 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
