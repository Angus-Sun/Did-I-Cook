"use client";

import { 
  RecipeCard, 
  BackgroundPattern, 
  FloatingDecorations, 
  readyToCookDecorations,
  FormInput,
  FormSelect,
  Button
} from "@/components/ui";

const topicOptions = [
  "Pineapple on pizza: yes or no?",
  "Cats vs Dogs",
  "Morning person vs Night owl",
  "Random topic",
];

export function ReadyToCookSection() {
  return (
    <section 
      id="ready-to-cook" 
      className="w-full py-20 bg-gradient-to-b from-white via-amber-50/50 to-orange-50/30 relative overflow-hidden scroll-mt-4"
    >
      <BackgroundPattern imageUrl="/forkknife.png" />
      <FloatingDecorations decorations={readyToCookDecorations} />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Ready to Cook?
          </h2>
          <div className="flex items-center justify-center gap-4 mt-2 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-400" />
            <div className="w-2 h-2 rotate-45 bg-orange-400" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange-400" />
          </div>
          <p className="text-lg text-gray-600">
            Start a new debate or join an existing one
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <RecipeCard title="Create Room" variant="amber" stamp="📋">
            <div className="space-y-5">
              <FormSelect label="Topic" options={topicOptions} variant="amber" />
              <Button fullWidth>Create Room</Button>
            </div>
          </RecipeCard>
          <RecipeCard title="Join Room" variant="orange" stamp="🥄">
            <div className="space-y-5">
              <FormInput label="Room Code" placeholder="Enter room code" variant="orange" />
              <FormInput label="Your Name" placeholder="Enter your name" variant="orange" />
              <Button fullWidth>Join Room</Button>
            </div>
          </RecipeCard>
        </div>
      </div>
    </section>
  );
}
