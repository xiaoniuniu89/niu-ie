'use client';
import React, { useState, useRef, useEffect } from "react";
import { LocaleValue, useLocale } from "@/contexts/LocaleContext";
import { useSetLocale } from "@/components/LocaleWrapper/LocaleWrapper";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export const languages: { code: LocaleValue; label: string; flag: string }[] = [
  { code: "enUs", label: "English", flag: "🇬🇧" },
  { code: "ga", label: "Gaeilge", flag: "🇮🇪" },
  { code: "zhCn", label: "中文", flag: "🇨🇳" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "lt", label: "Lietuvių", flag: "🇱🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
];

export const LanguageSelector: React.FC = () => {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (langCode: LocaleValue) => {
    setLocale(langCode);
    setIsOpen(false);
    setTimeout(() => router.refresh(), 10);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1.5 bg-foreground/5 hover:bg-foreground/10 px-2.5 py-1.5 rounded-full text-foreground transition-colors focus:outline-none text-xs font-condensed font-medium"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <Globe className="h-3.5 w-3.5 text-primary" />
        <span>{currentLanguage.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 min-w-[150px] bg-background border border-foreground/10 rounded-xl shadow-xl z-50 overflow-hidden py-1">
          <ul className="list-none p-0 m-0">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  className={`flex items-center gap-2.5 w-full px-4 py-2 text-left cursor-pointer transition-colors text-xs font-condensed ${
                    locale === lang.code ? "bg-primary/10 font-bold text-primary" : "text-foreground hover:bg-foreground/5"
                  }`}
                  onClick={() => changeLanguage(lang.code)}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
