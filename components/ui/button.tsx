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
          bg-gradient-to-r from-green-600 to-green-700 
          text-white 
          shadow-lg 
          hover:shadow-xl 
          hover:from-green-700 
          hover:to-green-800
          border border-green-600/30
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
          bg-gradient-to-r from-amber-50/80 to-yellow-50/60 
          border-2 border-amber-200/50 
          text-amber-800 
          shadow-md
          hover:bg-gradient-to-r hover:from-amber-100/90 hover:to-yellow-100/70 
          hover:border-amber-300/60
          hover:shadow-lg
          backdrop-blur-sm
        `,
        secondary: `
          bg-gradient-to-r from-stone-100 to-amber-50 
          text-stone-700 
          shadow-md
          hover:bg-gradient-to-r hover:from-stone-200 hover:to-amber-100
          border border-stone-200/50
        `,
        ghost: `
          bg-transparent 
          text-green-700 
          hover:bg-gradient-to-r hover:from-green-50/80 hover:to-emerald-50/60
          hover:text-green-800
          hover:backdrop-blur-sm
        `,
        link: `
          text-green-700 
          underline-offset-4 
          hover:underline
          hover:text-green-800
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
