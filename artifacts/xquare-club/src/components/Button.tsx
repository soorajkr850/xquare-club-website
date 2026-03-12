import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-display font-semibold rounded-xl transition-all duration-300 overflow-hidden outline-none";
    
    const variants = {
      primary: `
        bg-primary text-white 
        shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] 
        hover:shadow-[0_0_25px_-2px_rgba(59,130,246,0.7)]
        hover:bg-blue-400
        border border-blue-400/50
      `,
      outline: `
        bg-transparent text-white 
        border-2 border-white/20 
        hover:border-white/50 hover:bg-white/5
      `,
      ghost: `
        bg-transparent text-white/80
        hover:text-white hover:bg-white/10
      `
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0, scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
