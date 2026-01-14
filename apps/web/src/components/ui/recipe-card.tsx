"use client";

import { ReactNode } from "react";

interface RecipeCardProps {
  title: string;
  children: ReactNode;
  variant: "amber" | "orange";
  stamp?: string;
}

const variants = {
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    lines: "#d4a574",
    corner: "from-amber-100 to-amber-200",
    tape: "bg-orange-200/80 rotate-[-2deg]",
    title: "text-amber-900",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    lines: "#e5a87a",
    corner: "from-orange-100 to-orange-200",
    tape: "bg-amber-200/80 rotate-[2deg]",
    title: "text-orange-900",
  },
};

export function RecipeCard({ title, children, variant, stamp }: RecipeCardProps) {
  const styles = variants[variant];
  return (
    <div 
      className={`relative ${styles.bg} border-2 ${styles.border} rounded-sm p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
      style={{
        backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${styles.lines} 28px)`,
        backgroundSize: '100% 28px',
      }}
    >
      <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl ${styles.corner} rounded-bl-lg shadow-inner`} />
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[48px] border-l-transparent border-t-[48px] border-t-white" />
      <div className={`absolute -top-2 left-8 w-16 h-6 ${styles.tape} shadow-sm`} />
      <div className="relative">
        <h3 className={`text-xl font-bold ${styles.title} mb-6`}>{title}</h3>
        {children}
        {stamp && (
          <div className="absolute -bottom-2 -right-2 text-4xl opacity-20 rotate-12">{stamp}</div>
        )}
      </div>
    </div>
  );
}
