'use client'
import { createContext, useContext, ReactNode } from 'react'
import type { Liff } from '@line/liff'

// Type for the decoded ID token from LINE LIFF
export interface UserInformation {
   iss: string // Issuer
   sub: string // Subject (LINE user ID)
   aud: string // Audience
   exp: number // Expiration time
   iat: number // Issued at time
   amr: string[] // Authentication methods
   name: string // User display name
   picture: string // Profile picture URL
}

// Main user data structure matching the MongoDB schema
export interface PlayerType {
   userId: string
   displayName: string | null
   pictureUrl?: string | null
   statusMessage?: string | null
   score: number
   stores: Array<{
      name: string
      point: number
      color: string
      _id?: string
   }>
   selectedStore: {
      name: string
      point: number
      color: string
      _id?: string
   }
   stamina: {
      current: number
      max: number
      _id?: string
   }
   characters: any[]
   coupons: any[]
   createdAt?: Date
   updatedAt?: Date
   __v?: number
}

// User profile from LIFF SDK
export interface UserProfile {
   userId: string
   displayName: string
   pictureUrl?: string
   statusMessage?: string
}

// Props for the LIFF context provider
export interface LiffContextProps {
   liff: Liff | null
   liffError: string | null
   liffIDToken: string | null
   userProfile: UserProfile | null
}

const LiffContext = createContext<LiffContextProps>({
   liff: null,
   liffError: null,
   liffIDToken: null,
   userProfile: null
})

export const useLiff = () => useContext(LiffContext)

export const LiffProvider = ({ children, value }: { children: ReactNode; value: LiffContextProps }) => {
   return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>
}
