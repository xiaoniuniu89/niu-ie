'use client';
import React, { useEffect, useState } from "react";
import LocaleContext, { LocaleValue } from "@/contexts/LocaleContext";
import { IntlProvider } from "react-intl";

import enMessages from "@/locales/en.json";

const fileMap: Record<LocaleValue, string> = {
  enUs: "en",
  ga: "ga",
  zhCn: "zh",
  ro: "ro",
  uk: "uk",
  pl: "pl",
  lt: "lt",
  pt: "pt",
  es: "es",
  fr: "fr",
  de: "de",
};

const localeCodeMap: Record<LocaleValue, string> = {
  enUs: "en",
  ga: "ga",
  zhCn: "zh",
  ro: "ro",
  uk: "uk",
  pl: "pl",
  lt: "lt",
  pt: "pt",
  es: "es",
  fr: "fr",
  de: "de",
};

const LocaleUpdateContext = React.createContext<
  React.Dispatch<React.SetStateAction<LocaleValue>> | undefined
>(undefined);

export const LocaleClientWrapper = ({ 
    children, 
    initialLocale = "enUs" 
}: { 
    children: React.ReactNode,
    initialLocale?: LocaleValue 
}) => {
  const [locale, setLocale] = useState<LocaleValue>(initialLocale);
  const [messages, setMessages] = useState<Record<string, string>>(
    enMessages as Record<string, string>
  );

  useEffect(() => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;

    if (locale === "enUs") {
      setMessages(enMessages as Record<string, string>);
      return;
    }

    const fileName = fileMap[locale] || "en";
    import(`@/locales/${fileName}.json`)
      .then((mod) => {
        setMessages(mod.default as Record<string, string>);
      })
      .catch((err) => {
        console.error(`Failed to load locale file for ${locale}:`, err);
        setMessages(enMessages as Record<string, string>);
      });
  }, [locale]);

  const langCode = localeCodeMap[locale] || "en";

  return (
    <LocaleContext.Provider value={locale}>
      <LocaleUpdateContext.Provider value={setLocale}>
        <IntlProvider locale={langCode} messages={messages} defaultLocale="en">
          {children}
        </IntlProvider>
      </LocaleUpdateContext.Provider>
    </LocaleContext.Provider>
  );
};

export const useSetLocale = () => {
  const context = React.useContext(LocaleUpdateContext);
  if (!context) {
    throw new Error("useSetLocale must be used within LocaleClientWrapper");
  }
  return context;
};
