import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { useRef, useEffect, useState } from 'react';

import { cn } from "@/lib/utils"
import { animatePress, animateRelease, prefersReducedMotion } from '@/lib/animation';

const buttonVariants = cva(
  "btn-duo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "btn-leaf",
        destructive: "btn-berry",
        outline: "btn-white",
        secondary: "btn-white",
        ghost: "rounded-2xl text-foreground active:bg-muted",
        link: "rounded-none text-primary underline-offset-4 hover:underline",
        sky: "btn-sky",
        sun: "btn-sun",
        tangerine: "btn-tangerine",
        grape: "btn-grape",
        mint: "btn-mint",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-12 w-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const btnRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    btnRef.current = ref?.current || btnRef.current;
  }, [ref]);

  const handleMouseDown = (e) => {
    if (props.disabled || prefersReducedMotion()) return;
    animatePress(btnRef.current);
    setIsPressed(true);
    props.onMouseDown?.(e);
  };

  const handleMouseUp = (e) => {
    if (props.disabled || prefersReducedMotion()) return;
    animateRelease(btnRef.current);
    setIsPressed(false);
    props.onMouseUp?.(e);
  };

  const handleMouseLeave = (e) => {
    if (isPressed && !prefersReducedMotion()) {
      animateRelease(btnRef.current);
      setIsPressed(false);
    }
    props.onMouseLeave?.(e);
  };

  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      ref={(el) => { btnRef.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }}
      className={cn(buttonVariants({ variant, size, className }))}
      type={!props.asChild && !props.type ? "button" : props.type}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }