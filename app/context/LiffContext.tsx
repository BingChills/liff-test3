"use client";
import { createContext, useContext, ReactNode } from "react";
import type { Liff } from "@line/liff";

interface LiffContextProps {
  liff: Liff | null;
  liffError: string | null;
  liffIDToken: string | null;
  liffUserID: string | null;
}

const LiffContext = createContext<LiffContextProps>({
  liff: null,
  liffError: null,
  liffIDToken: null,
  liffUserID: null,
});

export const useLiff = () => useContext(LiffContext);

export const LiffProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: LiffContextProps;
}) => {
  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>;
};
