'use client';
import * as React from "react";

export type LocaleValue = "enUs" | "ga" | "zhCn" | "ro" | "uk" | "pl" | "lt" | "pt" | "es" | "fr" | "de";

export const LocaleContext = React.createContext<LocaleValue | undefined>("enUs");

export function LocaleContextProvider(
  props: React.PropsWithChildren<{ value: LocaleValue | undefined }>
) {
  return (
    <LocaleContext.Provider value={props.value}>
      {props.children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleValue {
  return React.useContext(LocaleContext) || "enUs";
}

export default LocaleContext;
