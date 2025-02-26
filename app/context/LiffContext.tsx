"use client";
import { createContext, useContext, ReactNode } from "react";
import type { Liff } from "@line/liff";
import { UserInformation } from "@/types/types";

export interface User {
  _id?: string;
  u_id: string;
  username: string;
  profile_picture: string;
  points: {
    pointA: number;
    pointB: number;
    pointC: number;
  };
  pets_owned: string[];
  pets_equipped: string[];
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
