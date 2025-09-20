"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface LinkTransitionProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function LinkTransition({ href, children, className, ...props }: LinkTransitionProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        className={className}
        {...props}
      >
        {children}
      </Link>
    </motion.div>
  );
}