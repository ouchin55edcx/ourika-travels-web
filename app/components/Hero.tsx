import { SearchIcon } from "lucide-react";

export default function Hero() {
    return (
        <div className="flex flex-col items-center justify-center pt-10 pb-8 px-6 md:pt-20 md:pb-12">
            <h1 className="text-4xl md:text-6xl font-black text-[#004f32] tracking-tight mb-8 md:mb-12 text-center">
                Where to?
            </h1>
            <div className="w-full max-w-7xl">
                {/* Search Bar */}
                <div className="relative group max-w-4xl mx-auto">
                    <div className="flex items-center bg-white border border-gray-100 shadow-xl md:shadow-2xl group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 rounded-full p-1.5 md:p-2 pl-6 md:pl-8 h-16 md:h-20">
                        <SearchIcon className="w-5 h-5 md:w-7 md:h-7 text-gray-400 mr-3 md:mr-5 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search places, activities..."
                            className="flex-1 text-base md:text-xl outline-none placeholder:text-gray-400 font-medium min-w-0"
                        />
                        <button className="bg-[#00ef9d] hover:bg-[#00dd8e] text-black font-black h-full px-6 md:px-14 rounded-full transition-all duration-300 text-base md:text-xl shadow-inner active:scale-95 whitespace-nowrap">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
