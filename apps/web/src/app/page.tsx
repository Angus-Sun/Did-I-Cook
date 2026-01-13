"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import HeroSection from "@/components/hero-section";

export default function Home() {
  const router = useRouter();

  const handleStartClick = () => {
    router.push("/play");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 flex flex-col overflow-x-hidden relative">
      <div className="h-screen w-full relative">
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.25,
            backgroundPosition: ['0px 0px', '120px 120px']
          }}
          transition={{
            opacity: { duration: 1.5, ease: "easeOut" },
            backgroundPosition: { duration: 10, repeat: Infinity, ease: "linear" }
          }}
          style={{
            backgroundImage: `url("/forkknife.png")`,
            backgroundSize: '120px 120px',
            backgroundRepeat: 'repeat',
          }}
        />
        
        {/* Decorative background pattern */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-orange-100/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-yellow-100/40 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Hero content */}
        <div className="h-full z-10 relative">
          <HeroSection onStartClick={handleStartClick} />
        </div>
        
        {/* Gradient fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white pointer-events-none z-20" />
      </div>

      {/* How It Works Section */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              A battle of wits, scored by AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div 
              className="relative group p-8 rounded-lg bg-white border border-gray-200 shadow-sm hover:border-orange-400 hover:shadow-lg active:scale-[0.98] transition-all duration-500 overflow-hidden cursor-pointer h-full flex flex-col"
              style={{ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)', transition: 'transform 0.5s ease-out' }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (centerY - y) / 10;
                const rotateY = (x - centerX) / 10;
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
              }}
            >
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-orange-400 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-white transition-all duration-300">1</div>
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:translate-x-1 transition-transform duration-300 font-[family-name:var(--font-dm-sans)]">Pick a Topic</h3>
                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600 transition-colors duration-300 flex-1">Choose from predefined debate topics or let the AI surprise you.</p>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-orange-400/5 rounded-br-lg"></div>
            </div>

            {/* Step 2 */}
            <div 
              className="relative group p-8 rounded-lg bg-white border border-gray-200 shadow-sm hover:border-red-400 hover:shadow-lg active:scale-[0.98] transition-all duration-500 overflow-hidden cursor-pointer h-full flex flex-col"
              style={{ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)', transition: 'transform 0.5s ease-out' }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (centerY - y) / 10;
                const rotateY = (x - centerX) / 10;
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
              }}
            >
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-400 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-white transition-all duration-300">2</div>
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:translate-x-1 transition-transform duration-300 font-[family-name:var(--font-dm-sans)]">Make Your Case</h3>
                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600 transition-colors duration-300 flex-1">Take turns presenting arguments. Be logical, clear, and civil!</p>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-red-400/5 rounded-br-lg"></div>
            </div>

            {/* Step 3 */}
            <div 
              className="relative group p-8 rounded-lg bg-white border border-gray-200 shadow-sm hover:border-yellow-400 hover:shadow-lg active:scale-[0.98] transition-all duration-500 overflow-hidden cursor-pointer h-full flex flex-col"
              style={{ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)', transition: 'transform 0.5s ease-out' }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (centerY - y) / 10;
                const rotateY = (x - centerX) / 10;
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
              }}
            >
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-yellow-400 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-white transition-all duration-300">3</div>
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:translate-x-1 transition-transform duration-300 font-[family-name:var(--font-dm-sans)]">Get Scored</h3>
                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600 transition-colors duration-300 flex-1">AI judges each turn on logic, clarity, evidence, and civility.</p>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-yellow-400/5 rounded-br-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Create or Join Section */}
      <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Create Debate Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Create Debate</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Topic</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-gray-400 transition-colors">
                    <option>Pineapple on pizza: yes or no?</option>
                    <option>Cats vs Dogs</option>
                    <option>Morning person vs Night owl</option>
                    <option>Let AI choose...</option>
                  </select>
                </div>
                
                <button className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors">
                  Create Debate
                </button>
              </div>
            </div>

            {/* Join Debate Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Join Debate</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Debate ID</label>
                  <input 
                    type="text" 
                    placeholder="Enter code"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Display Name</label>
                  <input 
                    type="text" 
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                
                <button className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors">
                  Join Debate
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Did I Cook?
          </p>
        </div>
      </footer>
    </div>
  );
}
