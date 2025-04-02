const mongoose = require("mongoose");

// Store schema - each store has a unique point system
const StoreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    point: { type: Number, default: 0 },
    color: { type: String, default: "blue" },
});

// Stamina schema
const StaminaSchema = new mongoose.Schema({
    current: { type: Number, default: 20 },
    max: { type: Number, default: 20 },
});
t;
// Coupon schema - resets monthly with limited quantity per store
const CouponSchema = new mongoose.Schema({
    id: { type: String, required: true },
    code: { type: String, required: true },
    discount: { type: String, required: true },
    expiry: { type: Date }, // Actual expiry date
    image: { type: String },
    isUsed: { type: Boolean, default: false },
    storeName: { type: String, required: true }, // Store this coupon belongs to
    totalQuantity: { type: Number }, // How many of this coupon type are available this month
    remainingQuantity: { type: Number }, // How many are left
    resetDate: { type: Date, default: Date.now }, // When this coupon was last reset
    couponType: { type: String }, // Type of coupon (e.g. discount, free item, etc.)
});

// Character schema
const CharacterSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    rarity: { type: String, enum: ["common", "rare", "epic", "legendary"] },
    dropRate: { type: Number }, // Base chance to drop a coupon
    isUsing: { type: Boolean, default: false },
    storeName: { type: String, required: true }, // Store this character belongs to
});

// Main Player schema
const PlayerSchema = new mongoose.Schema(
    {
        u_id: {
            type: String,
            required: true,
            unique: true,
        },
        profile_picture: {
            type: String,
            default: null, // URL for the LINE profile picture
        },
        score: {
            type: Number,
            default: 0,
        },
        stores: [StoreSchema], // Store-specific points
        selectedStore: StoreSchema,
        stamina: StaminaSchema,
        characters: [CharacterSchema],
        coupons: [CouponSchema],
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Player", PlayerSchema, "user_info");
