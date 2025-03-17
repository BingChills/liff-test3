"use client";
import { createContext, useContext, ReactNode } from "react";
import type { Liff } from "@line/liff";

export interface UserInformation {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  amr: string[];
  name: string;
  picture: string;
}

export interface User {
  _id?: string;
  userId: string;
  score: number;
  coins: number;
  stores: Array<{
    name: string;
    point: number;
    color: string;
    _id?: string;
  }>;
  selectedStore: {
    name: string;
    point: number;
    color: string;
    _id?: string;
  };
  stamina: {
    current: number;
    max: number;
    _id?: string;
  };
  drawCount: number;
  remainingDraws: number;
  characters: any[];
  coupons: any[];
  lastUpdated?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

interface LiffContextProps {
  liff: Liff | null;
  liffError: string | null;
  liffIDToken: string | null;
  liffDecodedIDToken: UserInformation | null;
  user: User | null;
  setUser: (user: User | null) => void;
}

const LiffContext = createContext<LiffContextProps>({
  liff: null,
  liffError: null,
  liffIDToken: null,
  liffDecodedIDToken: null,
  user: null,
  setUser: () => {},
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
