"use client";

import { useState, useEffect } from "react";
import enDict from "@/dictionaries/en.json";
import frDict from "@/dictionaries/fr.json";

type Dictionary = typeof enDict;

export function useDictionary() {
  const [dictionary, setDictionary] = useState<Dictionary>(enDict);
  const [language, setLanguage] = useState<"en" | "fr">("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Get language from localStorage
    let savedLanguage = localStorage.getItem("preferredLanguage");
    if (!savedLanguage) {
      localStorage.setItem("preferredLanguage", "EN");
      savedLanguage = "EN";
    }

    const langCode = savedLanguage.toLowerCase() as "en" | "fr";
    setLanguage(langCode);
    setDictionary(langCode === "fr" ? frDict : enDict);
    document.cookie = `preferredLanguage=${langCode}; path=/; max-age=31536000; SameSite=Lax`;

    // Listen for language changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "preferredLanguage") {
        const newLang = (e.newValue || "EN").toLowerCase() as "en" | "fr";
        setLanguage(newLang);
        setDictionary(newLang === "fr" ? frDict : enDict);
        document.cookie = `preferredLanguage=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
      }
    };

    const handleLanguageChange = () => {
      const newLang = (localStorage.getItem("preferredLanguage") || "EN").toLowerCase() as
        | "en"
        | "fr";
      setLanguage(newLang);
      setDictionary(newLang === "fr" ? frDict : enDict);
      document.cookie = `preferredLanguage=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  return { dictionary, language };
}
