import Image from "next/image";

export default function TouristHighlight() {
    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-10 md:py-16">
            <div className="bg-[#004f32] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
                {/* Image Section */}
                <div className="w-full lg:w-[48%] relative h-[300px] sm:h-[400px] lg:h-[550px] m-4 sm:m-5 lg:m-6 rounded-[1.5rem] overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1200&auto=format&fit=crop"
                        alt="Happy tourist enjoying Ourika"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 48vw"
                    />
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-16 flex flex-col justify-center text-white">
                    <div className="flex items-center gap-3 mb-5 lg:mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#00ef9d] flex items-center justify-center p-1.5 shadow-sm shrink-0">
                            <div className="w-full h-full rounded-full border-2 border-[#004f32] flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-[#004f32]"></div>
                            </div>
                        </div>
                        <span className="text-[13px] md:text-[15px] font-black tracking-wider uppercase opacity-90">Ourika Travels Insights</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-[900] mb-6 lg:mb-8 leading-[1.1] lg:leading-[1.05] tracking-tight">
                        Happy Guests,<br />
                        Unforgettable<br />
                        Stories
                    </h2>

                    <p className="text-base sm:text-[17px] lg:text-[19px] font-medium text-gray-100 mb-8 lg:mb-10 opacity-80 max-w-[400px]">
                        The travel experiences shaping the memories of our adventurers in Ourika.
                    </p>

                    <button className="bg-white text-black font-black px-10 lg:px-12 py-3.5 lg:py-4 rounded-full w-full sm:w-fit hover:bg-[#00ef9d] transition-all duration-300 text-base lg:text-[17px] shadow-lg active:scale-95">
                        Read more
                    </button>
                </div>
            </div>
        </section>
    );
}
