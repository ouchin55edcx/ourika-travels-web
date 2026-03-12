"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useDictionary } from "@/hooks/useDictionary";
import {
  Heart,
  Users,
  Leaf,
  Handshake,
  Shield,
  Eye,
  Search,
  MessageCircle,
  MapPin,
} from "lucide-react";

export default function OurikaAboutPage() {
  const { dictionary } = useDictionary();
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqItems = dictionary.about.faq.questions.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  const whoReveal = useScrollReveal(0.1);
  const valuesReveal = useScrollReveal(0.1);
  const bookReveal = useScrollReveal(0.1);
  const faqReveal = useScrollReveal(0.1);

  return (
    <div className="min-h-screen bg-white selection:bg-[#34e0a1] selection:text-black">
      <Navbar />

      <div className="max-w-7xl mx-auto md:px-5 lg:px-9 flex flex-col gap-2 md:mt-4 pb-12">
        {/* Hero Section */}
        <section className="relative text-[#004f32] mx-auto md:rounded-3xl overflow-hidden px-6 sm:px-12 lg:px-16 py-16 sm:py-24 lg:py-32 w-full">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="/video/abou.mp4" type="video/mp4" />
          </video>
          {/* Overlay for text readability */}
          {/* <div className="absolute inset-0 bg-[#CDDC39]/80 z-10"></div> */}
          <div className="relative z-20 text-center max-w-3xl mx-auto space-y-6">
            {/* Logo */}
            {/* <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#004f32] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-[14px] leading-[1.4]">OT</span>
            </div>
            <span className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] font-semibold text-[#004f32] leading-[1.5]">Ourika Travels</span>
          </div> */}

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 md:mb-6">
              {dictionary.about.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-xl text-white max-w-2xl mx-auto leading-relaxed font-medium opacity-90">
              {dictionary.about.hero.subtitle}
            </p>

            {/* CTA Button */}
            <div className="pt-4 space-y-2">
              <button className="bg-[#004f32] text-white px-8 py-3 rounded-full font-semibold text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16px] xl:text-[18px] tracking-[0.05em] hover:bg-[#003d27] transition-colors shadow-lg active:scale-95 transition-all">
                {dictionary.about.hero.bookButton}
              </button>
              <p className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[16px] text-white leading-[1.4] md:leading-[1.5]">
                {dictionary.about.hero.freeCancellation}
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section
          ref={whoReveal.elementRef as any}
          className={`py-10 md:py-16 bg-white md:border border-gray-100 md:rounded-3xl px-5 sm:px-7 md:px-10 reveal ${whoReveal.isVisible ? 'reveal-visible' : ''}`}
        >
          <div className="mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Title - First on mobile, first column first row on desktop */}
              <h2 className="text-2xl md:text-[28px] font-black text-[#004f32] leading-tight mb-1 order-1">
                {dictionary.about.whoWeAre.title}
              </h2>

              {/* Picture - Second on mobile, second column spans both rows on desktop */}
              <div className="relative h-64 sm:h-80 lg:h-full rounded-2xl overflow-hidden shadow-xl order-2 lg:row-span-2">
                <Image
                  src="/about.png"
                  alt="Ourika Valley"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content - Third on mobile, first column second row on desktop */}
              <div className="flex flex-col order-3">
                <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] text-gray-700 leading-[1.6] md:leading-[1.7] mb-4">
                  {dictionary.about.whoWeAre.description}
                </p>
                <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] text-gray-700 leading-[1.6] md:leading-[1.7]">
                  {dictionary.about.whoWeAre.description2}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section
          ref={valuesReveal.elementRef as any}
          className={`py-10 md:py-16 bg-white md:border border-gray-100 md:rounded-3xl px-5 sm:px-7 md:px-10 reveal ${valuesReveal.isVisible ? 'reveal-visible' : ''}`}
        >
          <div className="mx-auto">
            <h2 className="text-2xl md:text-[28px] font-black text-[#004f32] leading-tight mb-1">
              {dictionary.about.values.title}
            </h2>
            <p className="text-gray-600 text-sm md:text-[15px] font-medium opacity-80 mb-8">
              Guiding principles that define our commitment to you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {dictionary.about.values.items.map((value, index) => {
                // Map each value to its corresponding icon
                const icons = [
                  Heart, // Authenticité
                  Users, // Communauté d'Abord
                  Leaf, // Responsabilité Environnementale
                  Handshake, // Respect Culturel
                  Shield, // Sécurité & Professionnalisme
                  Eye, // Transparence
                ];
                const IconComponent = icons[index] || Heart;

                return (
                  <div
                    key={index}
                    className={`flex gap-4 group reveal ${valuesReveal.isVisible ? 'reveal-visible' : ''}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#CDDC39] flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <IconComponent className="w-6 h-6 text-gray-900 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 transition-all duration-300 group-hover:translate-x-1">
                      <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-900 mb-2 transition-all duration-300 group-hover:text-[#004f32]">
                        {value.title}
                      </h3>
                      <p className="text-[14px] sm:text-[15px] text-gray-600 leading-[1.6]">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How to Book Section */}
        <section
          ref={bookReveal.elementRef as any}
          className={`py-10 md:py-16 bg-white md:border border-gray-100 md:rounded-3xl px-5 sm:px-7 md:px-10 reveal ${bookReveal.isVisible ? 'reveal-visible' : ''}`}
        >
          <div className="mx-auto">
            <h2 className="text-2xl md:text-[28px] font-black text-[#004f32] leading-tight mb-1">
              {dictionary.about.howToBook.title}
            </h2>
            <p className="text-gray-600 text-sm md:text-[15px] font-medium opacity-80 mb-8">
              Your journey starts here. Simple steps to your next experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dictionary.about.howToBook.steps.map((step, index) => {
                // Map each step to its corresponding icon
                const icons = [
                  Search, // Index 0: Choose Your Adventure
                  MessageCircle, // Index 1: Book Online or WhatsApp
                  MapPin, // Index 2: Meet Your Guide & Explore
                ];
                const IconComponent = icons[index] || Search;

                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border-2 border-transparent hover:border-[#CDDC39] hover:shadow-lg transition-all duration-300 hover:scale-105 reveal ${bookReveal.isVisible ? 'reveal-visible' : ''}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#CDDC39] flex items-center justify-center mb-4 flex-shrink-0">
                      <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900" />
                    </div>
                    <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[14px] sm:text-[15px] text-gray-600 leading-[1.6]">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          ref={faqReveal.elementRef as any}
          className={`py-10 md:py-16 bg-white md:border border-gray-100 md:rounded-3xl px-0 md:px-10 mb-8 reveal ${faqReveal.isVisible ? 'reveal-visible' : ''}`}
        >
          <div className="w-full">
            <h2 className="text-2xl md:text-[28px] font-black text-gray-900 leading-tight mb-8 text-center px-5">
              {dictionary.about.faq.title}
            </h2>

            <div className="space-y-0 md:space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 md:border md:rounded-lg overflow-hidden last:border-b-0 md:last:border-b"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-[18px] sm:text-[19px] md:text-[20px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] font-bold text-gray-900 text-left leading-[1.3]">
                      {item.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${openFAQ === index ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16px] xl:text-[18px] text-gray-600 leading-[1.5] md:leading-[1.6]">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 text-[12px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-gray-600 space-y-2 leading-1.4 md:leading-1.5 px-5">
              <p>{dictionary.about.faq.disclaimer1}</p>
              <p>{dictionary.about.faq.disclaimer2}</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
