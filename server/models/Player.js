// server/models/Player.js
const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  point: { type: Number, default: 0 },
  color: { type: String, default: 'blue' }
});

const StaminaSchema = new mongoose.Schema({
  current: { type: Number, default: 20 },
  max: { type: Number, default: 20 }
});

const CouponSchema = new mongoose.Schema({
  id: { type: String, required: true },
  code: { type: String, required: true },
  discount: { type: String, required: true },
  expiry: { type: String },
  image: { type: String },
  isUsed: { type: Boolean, default: false }
});

const CharacterSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'] },
  discount: { type: String },
  isUsing: { type: Boolean, default: false },
  company: { type: String }
});

const PlayerSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  score: { 
    type: Number, 
    default: 0 
  },
  coins: { 
    type: Number, 
    default: 0 
  },
  stores: [StoreSchema],
  selectedStore: StoreSchema,
  stamina: StaminaSchema,
  drawCount: { 
    type: Number, 
    default: 0 
  },
  remainingDraws: { 
    type: Number, 
    default: 0 
  },
  characters: [CharacterSchema],
  coupons: [CouponSchema],
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Player', PlayerSchema, 'user_info');