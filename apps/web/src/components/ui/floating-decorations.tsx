"use client";

interface FloatingDecoration {
  emoji: string;
  position: string;
  rotation?: string;
  size?: string;
  opacity?: string;
  animate?: boolean;
}

interface FloatingDecorationsProps {
  decorations: FloatingDecoration[];
}

export function FloatingDecorations({ decorations }: FloatingDecorationsProps) {
  return (
    <>
      {decorations.map((decoration, index) => (
        <div
          key={index}
          className={`absolute ${decoration.position} ${decoration.size || 'text-3xl'} ${decoration.opacity || 'opacity-15'} ${decoration.rotation || ''} ${decoration.animate ? 'animate-pulse' : ''}`}
        >
          {decoration.emoji}
        </div>
      ))}
    </>
  );
}

export const readyToCookDecorations: FloatingDecoration[] = [
  { emoji: "🍳", position: "top-12 left-[10%]", size: "text-4xl", opacity: "opacity-20", rotation: "rotate-12", animate: true },
  { emoji: "🥄", position: "top-24 right-[15%]", rotation: "-rotate-12" },
  { emoji: "🧂", position: "bottom-16 left-[8%]", rotation: "rotate-6" },
  { emoji: "🍴", position: "bottom-24 right-[10%]", size: "text-4xl", opacity: "opacity-20", rotation: "-rotate-6", animate: true },
  { emoji: "🥘", position: "top-1/2 left-[5%]", size: "text-2xl", opacity: "opacity-10", rotation: "rotate-45" },
  { emoji: "🍽️", position: "top-1/3 right-[5%]", size: "text-2xl", opacity: "opacity-10", rotation: "-rotate-45" },
];
