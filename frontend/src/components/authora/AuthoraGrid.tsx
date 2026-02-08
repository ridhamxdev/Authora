'use client';

import Link from 'next/link';

const collections = [
    {
        title: "POS GO",
        description: "The all-in-one mobile POS.",
        image: "https://cdn.shopify.com/s/files/1/0029/7422/0401/files/POS_Go_Dock_700x.png?v=1664478832",
        link: "/shop?cat=pos-go"
    },
    {
        title: "RETAIL KIT",
        description: "Complete iPad stand kit.",
        image: "https://cdn.shopify.com/s/files/1/0029/7422/0401/products/Retail_Kit_iPad_10.2_Black_700x.png?v=1629845686",
        link: "/shop?cat=retail-kit"
    },
    {
        title: "CARD READER",
        description: "Tap, chip, and swipe.",
        image: "https://cdn.shopify.com/s/files/1/0029/7422/0401/products/Tap_Chip_Reader_Black_Dock_700x.png?v=1605030438",
        link: "/shop?cat=card-reader"
    }
];

export default function AuthoraGrid() {
    return (
        <section className="bg-black py-20 px-6">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-white text-3xl font-bold tracking-tight">LATEST DROPS</h2>
                    <Link href="/shop" className="text-gray-400 hover:text-white text-sm font-mono uppercase tracking-widest border-b border-transparent hover:border-white transition-all pb-1">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-800 border border-gray-800">
                    {collections.map((item, i) => (
                        <Link key={i} href={item.link} className="group relative bg-[#111] aspect-[3/4] overflow-hidden block">
                            <div className="absolute inset-0 flex items-center justify-center p-10 transition-transform duration-700 group-hover:scale-105">
                                <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                            </div>

                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-white text-xl font-bold tracking-tight mb-1">{item.title}</h3>
                                <p className="text-gray-400 text-sm font-mono">{item.description}</p>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 border-[3px] border-white/0 lg:group-hover:border-white/10 transition-colors pointer-events-none" />
                        </Link>
                    ))}
                </div>

                {/* Horizontal Marquee / Info Strip */}
                <div className="mt-20 border-y border-white/10 py-6 overflow-hidden">
                    <div className="flex justify-between items-center text-gray-500 font-mono text-xs md:text-sm uppercase tracking-widest whitespace-nowrap">
                        <span>Free Shipping on Orders $500+</span>
                        <span className="hidden md:inline">•</span>
                        <span>30-Day Return Policy</span>
                        <span className="hidden md:inline">•</span>
                        <span>24/7 Support</span>
                        <span className="hidden md:inline">•</span>
                        <span>Global Warranty</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
