"use client";

import { CookbookCard } from "@/components/ui";
import { BackgroundPattern, FloatingDecorations } from "@/components/ui";

const howItWorksDecorations = [
  { emoji: "📖", position: "top-16 left-[8%]", size: "text-4xl", opacity: "opacity-20", rotation: "rotate-12", animate: true },
  { emoji: "✏️", position: "top-28 right-[12%]", size: "text-3xl", opacity: "opacity-15", rotation: "-rotate-12" },
  { emoji: "💡", position: "bottom-20 left-[10%]", size: "text-3xl", opacity: "opacity-15", rotation: "rotate-6" },
  { emoji: "⭐", position: "bottom-12 right-[5%]", size: "text-3xl", opacity: "opacity-15", rotation: "-rotate-6", animate: true },
];

const steps = [
  {
    step: 1,
    title: "Pick a Topic",
    subtitle: "The Appetizer",
    colorScheme: "red" as const,
    ingredients: [
      "Choose from fun debate topics",
      'Or pick "Random" for a surprise',
      "Topics range from silly to serious",
      "Share with a friend to compete!",
    ],
  },
  {
    step: 2,
    title: "Make Your Case",
    subtitle: "The Main Course",
    colorScheme: "orange" as const,
    ingredients: [
      "Take turns making arguments",
      "Be logical and clear",
      "Use evidence when you can",
      "Stay civil - keep it friendly!",
    ],
  },
  {
    step: 3,
    title: "Get Scored",
    subtitle: "The Dessert",
    colorScheme: "yellow" as const,
    ingredients: [
      "AI judges each argument",
      "Scored on logic & clarity",
      "Points for good evidence",
      "Winner = best debater!",
    ],
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-amber-50/80 via-amber-50/50 to-white relative overflow-hidden">
      <BackgroundPattern imageUrl="/forkknife.png" />
      <FloatingDecorations decorations={howItWorksDecorations} />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-400" />
            <div className="w-2 h-2 rotate-45 bg-orange-400" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange-400" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <CookbookCard key={step.step} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
