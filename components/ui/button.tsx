import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2, type Icon } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 shadow-sm hover:shadow",
        gradient: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      fullWidth: {
        true: "w-full",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
      loading: {
        true: "cursor-wait opacity-70 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      fullWidth: false,
      loading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  icon?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  href?: string
  target?: string
  rel?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    rounded,
    asChild = false,
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    icon,
    children,
    disabled,
    onClick,
    href,
    target,
    rel,
    type = "button",
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : (href ? "a" : "button")
    
    const isDisabled = disabled || loading
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        event.preventDefault()
        return
      }
      onClick?.(event)
    }

    // If icon is provided and no children, render as icon button
    const isIconOnly = icon && !children
    
    // Determine content based on loading state
    const content = loading ? (
      <>
        <Loader2 className="animate-spin" />
        {loadingText || children}
      </>
    ) : (
      <>
        {leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {icon && !children ? icon : children}
        {rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </>
    )

    // If href is provided, render as anchor
    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : rel}
          className={cn(
            buttonVariants({ variant, size, fullWidth, rounded, loading }),
            isIconOnly && "p-0",
            className
          )}
          ref={ref as React.Ref<HTMLAnchorElement>}
          aria-disabled={isDisabled}
          {...(isDisabled && { onClick: (e) => e.preventDefault() })}
          {...props}
        >
          {content}
        </a>
      )
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, fullWidth, rounded, loading }),
          isIconOnly && "p-0",
          className
        )}
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        type={type}
        aria-busy={loading}
        aria-disabled={isDisabled}
        data-loading={loading || undefined}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// Add compound components for common button patterns
const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical"
    spaced?: boolean
  }
>(({ className, orientation = "horizontal", spaced = false, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        orientation === "horizontal" 
          ? "flex-row" 
          : "flex-col",
        spaced && orientation === "horizontal" && "space-x-2",
        spaced && orientation === "vertical" && "space-y-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
ButtonGroup.displayName = "ButtonGroup"

// Add IconButton variant for convenience
const IconButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "icon" | "children"> & { icon: React.ReactNode }>(
  ({ icon, size = "icon", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        icon={icon}
        {...props}
      />
    )
  }
)
IconButton.displayName = "IconButton"

export { Button, ButtonGroup, IconButton, buttonVariants }
