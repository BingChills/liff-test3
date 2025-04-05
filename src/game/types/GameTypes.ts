export interface Coupon {
    id: string;
    brand: string;
    logo: string;
    discount: string;
    expiresIn: number;
    isUsed?: boolean;
    qrCode: string;
    storeName: string; // Added this property
}
import { Events } from 'phaser';

export interface Coupon {
    id: string;
    brand: string;
    logo: string;
    discount: string;
    expiresIn: number;
    isUsed?: boolean;
    qrCode: string;
    storeName: string;
}

export interface ChestRarity {
    type: 'common' | 'rare' | 'epic' | 'legendary';
    pointRange: [number, number]; // [min, max]
    couponDropChance: number;
    hp: number; // Add base HP for each rarity
}

export interface GameConfig {
    eventBus: Events.EventEmitter;
}
