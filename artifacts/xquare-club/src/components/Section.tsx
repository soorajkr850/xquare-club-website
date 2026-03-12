import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  containerClass?: string;
  darker?: boolean;
}

export function Section({ id, className, children, containerClass, darker = false }: SectionProps) {
  return (
    <section 
      id={id} 
      className={cn(
        "py-24 md:py-32 relative", 
        darker ? "bg-black" : "bg-gradient-to-b from-black to-navy-dark/30",
        className
      )}
    >
      <div className={cn("max-w-7xl mx-auto px-6 md:px-12 relative z-10", containerClass)}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
