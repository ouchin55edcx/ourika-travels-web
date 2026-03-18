"use client";

import { useState } from "react";
import Image from "next/image";
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
      <div className="mx-auto flex max-w-7xl flex-col gap-2 pb-12 md:mt-4 md:px-5 lg:px-9">
        {/* Hero Section */}
        <section className="relative mx-auto w-full overflow-hidden px-6 py-16 text-[#004f32] sm:px-12 sm:py-24 md:rounded-3xl lg:px-16 lg:py-32">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 z-0 h-full w-full object-cover"
          >
            <source src="/video/abou.mp4" type="video/mp4" />
          </video>
          {/* Overlay for text readability */}
          {/* <div className="absolute inset-0 bg-[#CDDC39]/80 z-10"></div> */}
          <div className="relative z-20 mx-auto max-w-3xl space-y-6 text-center">
            {/* Logo */}
            {/* <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#004f32] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-[14px] leading-[1.4]">OT</span>
            </div>
            <span className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] font-semibold text-[#004f32] leading-[1.5]">Ourika Travels</span>
          </div> */}

            {/* Heading */}
            <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:mb-6 md:text-6xl">
              {dictionary.about.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-base leading-relaxed font-medium text-white opacity-90 md:text-xl">
              {dictionary.about.hero.subtitle}
            </p>

            {/* CTA Button */}
            <div className="space-y-2 pt-4">
              <button className="rounded-full bg-[#004f32] px-8 py-3 text-[14px] font-semibold tracking-[0.05em] text-white shadow-lg transition-all transition-colors hover:bg-[#081f12] active:scale-95 sm:text-[15px] md:text-[16px] lg:text-[16px] xl:text-[18px]">
                {dictionary.about.hero.bookButton}
              </button>
              <p className="text-[12px] leading-[1.4] text-white sm:text-[13px] md:text-[14px] md:leading-[1.5] lg:text-[14px] xl:text-[16px]">
                {dictionary.about.hero.freeCancellation}
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section
          ref={whoReveal.elementRef as any}
          className={`reveal border-gray-100 bg-white px-5 py-10 sm:px-7 md:rounded-3xl md:border md:px-10 md:py-16 ${whoReveal.isVisible ? "reveal-visible" : ""}`}
        >
          <div className="mx-auto">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Title - First on mobile, first column first row on desktop */}
              <h2 className="order-1 mb-1 text-2xl leading-tight font-black text-[#004f32] md:text-[28px]">
                {dictionary.about.whoWeAre.title}
              </h2>

              {/* Picture - Second on mobile, second column spans both rows on desktop */}
              <div className="relative order-2 h-64 overflow-hidden rounded-2xl shadow-xl sm:h-80 lg:row-span-2 lg:h-full">
                <Image src="/about.png" alt="Ourika Valley" fill className="object-cover" />
              </div>

              {/* Content - Third on mobile, first column second row on desktop */}
              <div className="order-3 flex flex-col">
                <p className="mb-4 text-[14px] leading-[1.6] text-gray-700 sm:text-[15px] md:text-[16px] md:leading-[1.7] lg:text-[18px]">
                  {dictionary.about.whoWeAre.description}
                </p>
                <p className="text-[14px] leading-[1.6] text-gray-700 sm:text-[15px] md:text-[16px] md:leading-[1.7] lg:text-[18px]">
                  {dictionary.about.whoWeAre.description2}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section
          ref={valuesReveal.elementRef as any}
          className={`reveal border-gray-100 bg-white px-5 py-10 sm:px-7 md:rounded-3xl md:border md:px-10 md:py-16 ${valuesReveal.isVisible ? "reveal-visible" : ""}`}
        >
          <div className="mx-auto">
            <h2 className="mb-1 text-2xl leading-tight font-black text-[#004f32] md:text-[28px]">
              {dictionary.about.values.title}
            </h2>
            <p className="mb-8 text-sm font-medium text-gray-600 opacity-80 md:text-[15px]">
              Guiding principles that define our commitment to you.
            </p>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
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
                    className={`group reveal flex gap-4 ${valuesReveal.isVisible ? "reveal-visible" : ""}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#CDDC39] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <IconComponent className="h-6 w-6 text-gray-900 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 transition-all duration-300 group-hover:translate-x-1">
                      <h3 className="mb-2 text-[18px] font-bold text-gray-900 transition-all duration-300 group-hover:text-[#004f32] sm:text-[20px]">
                        {value.title}
                      </h3>
                      <p className="text-[14px] leading-[1.6] text-gray-600 sm:text-[15px]">
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
          className={`reveal border-gray-100 bg-white px-5 py-10 sm:px-7 md:rounded-3xl md:border md:px-10 md:py-16 ${bookReveal.isVisible ? "reveal-visible" : ""}`}
        >
          <div className="mx-auto">
            <h2 className="mb-1 text-2xl leading-tight font-black text-[#004f32] md:text-[28px]">
              {dictionary.about.howToBook.title}
            </h2>
            <p className="mb-8 text-sm font-medium text-gray-600 opacity-80 md:text-[15px]">
              Your journey starts here. Simple steps to your next experience.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                    className={`reveal flex flex-col items-center rounded-2xl border-2 border-transparent bg-gray-50 p-6 text-center transition-all duration-300 hover:scale-105 hover:border-[#CDDC39] hover:shadow-lg ${bookReveal.isVisible ? "reveal-visible" : ""}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="mb-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#CDDC39] sm:h-20 sm:w-20">
                      <IconComponent className="h-8 w-8 text-gray-900 sm:h-10 sm:w-10" />
                    </div>
                    <h3 className="mb-2 text-[18px] font-bold text-gray-900 sm:text-[20px]">
                      {step.title}
                    </h3>
                    <p className="text-[14px] leading-[1.6] text-gray-600 sm:text-[15px]">
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
          className={`reveal mb-8 border-gray-100 bg-white px-0 py-10 md:rounded-3xl md:border md:px-10 md:py-16 ${faqReveal.isVisible ? "reveal-visible" : ""}`}
        >
          <div className="w-full">
            <h2 className="mb-8 px-5 text-center text-2xl leading-tight font-black text-gray-900 md:text-[28px]">
              {dictionary.about.faq.title}
            </h2>

            <div className="space-y-0 md:space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="overflow-hidden border-b border-gray-200 last:border-b-0 md:rounded-lg md:border md:last:border-b"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="flex w-full items-center justify-between bg-white p-6 transition-colors hover:bg-gray-50"
                  >
                    <span className="text-left text-[18px] leading-[1.3] font-bold text-gray-900 sm:text-[19px] md:text-[20px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]">
                      {item.question}
                    </span>
                    <svg
                      className={`h-5 w-5 flex-shrink-0 text-gray-600 transition-transform ${
                        openFAQ === index ? "rotate-180" : ""
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
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                      <p className="text-[14px] leading-[1.5] text-gray-600 sm:text-[15px] md:text-[16px] md:leading-[1.6] lg:text-[16px] xl:text-[18px]">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="leading-1.4 mt-12 space-y-2 border-t border-gray-200 px-5 pt-8 text-[12px] text-gray-600 sm:text-[12px] md:text-[13px] md:leading-1.5 lg:text-[14px]">
              <p>{dictionary.about.faq.disclaimer1}</p>
              <p>{dictionary.about.faq.disclaimer2}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
