import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 leaf-float relative overflow-hidden backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: `
          border-green-200/60 
          bg-gradient-to-r from-green-100/80 to-emerald-100/60 
          text-green-800 
          hover:bg-gradient-to-r hover:from-green-200/90 hover:to-emerald-200/70
          hover:border-green-300/70
          shadow-sm hover:shadow-md
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:pointer-events-none
        `,
        secondary: `
          border-amber-200/60 
          bg-gradient-to-r from-amber-100/80 to-yellow-100/60 
          text-amber-800 
          hover:bg-gradient-to-r hover:from-amber-200/90 hover:to-yellow-200/70
          hover:border-amber-300/70
          shadow-sm hover:shadow-md
        `,
        destructive: `
          border-red-200/60 
          bg-gradient-to-r from-red-100/80 to-pink-100/60 
          text-red-800 
          hover:bg-gradient-to-r hover:from-red-200/90 hover:to-pink-200/70
          hover:border-red-300/70
          shadow-sm hover:shadow-md
        `,
        outline: `
          bg-gradient-to-r from-stone-50/60 to-amber-50/40 
          text-stone-700 
          border-stone-300/50
          hover:bg-gradient-to-r hover:from-stone-100/80 hover:to-amber-100/60
          hover:border-stone-400/60
          shadow-sm hover:shadow-md
          backdrop-blur-sm
        `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
