'use client';

import SupplyNavbar from '@/components/supply/SupplyNavbar';
import SupplyHero from '@/components/supply/SupplyHero';
import SupplyGrid from '@/components/supply/SupplyGrid';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <SupplyNavbar />

      <main>
        <SupplyHero />
        <SupplyGrid />

        {/* Story / About Section */}
        <section className="py-32 px-6 bg-[#050505]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-green-500 font-mono text-sm uppercase tracking-widest mb-6 block">Our Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-white">
              TOOLS FOR THE <br /> MODERN MAKER.
            </h2>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10">
              We believe in the power of physical retail. That's why we build hardware that disappears, letting your brand shine.
              Meticulously crafted, obsessively engineered.
            </p>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black transition-all rounded-full px-10 h-12">
              Read Our Story
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-black border-t border-white/10 py-12 px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <h3 className="text-2xl font-bold tracking-tighter mb-4">Authora<span className="text-gray-600">.</span></h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Premium retail hardware for the next generation of commerce.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm text-gray-400">
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold mb-1">Products</span>
              <a href="#" className="hover:text-white">Hardware</a>
              <a href="#" className="hover:text-white">Accessories</a>
              <a href="#" className="hover:text-white">Kits</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold mb-1">Support</span>
              <a href="#" className="hover:text-white">Help Center</a>
              <a href="#" className="hover:text-white">Warranty</a>
              <a href="#" className="hover:text-white">Returns</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold mb-1">Company</span>
              <a href="#" className="hover:text-white">About</a>
              <a href="#" className="hover:text-white">Careers</a>
              <a href="#" className="hover:text-white">Press</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold mb-1">Legal</span>
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto mt-16 pt-8 border-t border-white/5 flex justify-between text-xs text-gray-600">
          <span>&copy; 2026 Authora Inc.</span>
          <span>Made with precision.</span>
        </div>
      </footer>
    </div>
  );
}
