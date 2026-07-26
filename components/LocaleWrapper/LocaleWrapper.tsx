'use client';
import React, { useEffect } from "react";
import LocaleContext, { LocaleValue } from "@/contexts/LocaleContext";
import { IntlProvider } from "react-intl";

import enMessages from "@/locales/en.json";
import gaMessages from "@/locales/ga.json";
import zhMessages from "@/locales/zh.json";
import roMessages from "@/locales/ro.json";
import ukMessages from "@/locales/uk.json";
import plMessages from "@/locales/pl.json";
import ltMessages from "@/locales/lt.json";
import ptMessages from "@/locales/pt.json";
import esMessages from "@/locales/es.json";
import frMessages from "@/locales/fr.json";
import deMessages from "@/locales/de.json";

const messagesMap: Record<LocaleValue, Record<string, string>> = {
  enUs: enMessages as Record<string, string>,
  ga: gaMessages as Record<string, string>,
  zhCn: zhMessages as Record<string, string>,
  ro: roMessages as Record<string, string>,
  uk: ukMessages as Record<string, string>,
  pl: plMessages as Record<string, string>,
  lt: ltMessages as Record<string, string>,
  pt: ptMessages as Record<string, string>,
  es: esMessages as Record<string, string>,
  fr: frMessages as Record<string, string>,
  de: deMessages as Record<string, string>,
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
  const [locale, setLocale] = React.useState<LocaleValue>(initialLocale);

  useEffect(() => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }, [locale]);

  const messages = messagesMap[locale] || enMessages;
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
