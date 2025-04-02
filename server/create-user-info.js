// Script to create sample user_info data
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

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

// Main Player schema - exactly matching the model in Player.js
const PlayerSchema = new mongoose.Schema(
    {
        u_id: {
            type: String,
            required: true,
            unique: true,
        },
        displayName: {
            type: String,
            default: "Player", // Default name if LINE doesn't provide one
        },
        profilePicture: {
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

// Create the model with the exact same name and collection as Player.js
const Player = mongoose.model("Player", PlayerSchema, "user_info");

// Helper functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create sample player data for user_info collection
async function createUserInfoSampleData() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/linkz-gameplay';
    
    console.log('Connecting to MongoDB...');
    console.log(`Using connection string: ${MONGO_URI.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://***:***@')}`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data (optional)
    await Player.deleteMany({});
    console.log('Cleared existing user_info data');
    
    // Create sample stores for all users
    const stores = [
      { name: "Parabola", point: 1600, color: "emerald" },
      { name: "KFC", point: 850, color: "red" },
      { name: "Pizza Company", point: 1200, color: "blue" },
      { name: "Pizza Hut", point: 950, color: "orange" },
    ];
    
    // Create sample users matching the Player schema
    const samplePlayers = [
      {
        u_id: 'test-user-123',  // Note the use of u_id instead of userId
        displayName: 'Test User',
        profilePicture: 'https://placehold.co/400x400/orange/white?text=User',
        score: 100,
        stores: stores,
        selectedStore: stores[0],
        stamina: { current: 18, max: 20 },
        characters: [
          {
            id: "char-parabola-1",
            name: "Epic Parabola Character",
            image: "https://placehold.co/400x400/purple/white?text=EP",
            rarity: "epic",
            dropRate: 0.09,
            isUsing: true,
            storeName: "Parabola",
          },
          {
            id: "char-kfc-1",
            name: "Rare KFC Character",
            image: "https://placehold.co/400x400/blue/white?text=KFC",
            rarity: "rare",
            dropRate: 0.05,
            isUsing: false,
            storeName: "KFC",
          }
        ],
        coupons: [
          {
            id: "coupon-parabola-1",
            code: "PARA50",
            discount: "50% off",
            expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            image: "https://example.com/coupon1.jpg",
            isUsed: false,
            storeName: "Parabola",
            totalQuantity: 100,
            remainingQuantity: 87,
            resetDate: new Date(),
            couponType: "percentage_discount",
          }
        ],
        lastUpdated: new Date()
      },
      {
        u_id: 'second-user-456',
        displayName: 'Second User',
        profilePicture: 'https://placehold.co/400x400/blue/white?text=User2',
        score: 50,
        stores: stores,
        selectedStore: stores[1],
        stamina: { current: 20, max: 20 },
        characters: [
          {
            id: "char-kfc-2",
            name: "Common KFC Character",
            image: "https://placehold.co/400x400/gray/white?text=KFC",
            rarity: "common",
            dropRate: 0.02,
            isUsing: true,
            storeName: "KFC",
          }
        ],
        coupons: [],
        lastUpdated: new Date()
      },
      {
        u_id: 'U12345678901234567890123456789012', // Example LINE format userId
        displayName: 'LINE User',
        profilePicture: 'https://placehold.co/400x400/green/white?text=LINE',
        score: 150,
        stores: stores,
        selectedStore: stores[2],
        stamina: { current: 15, max: 20 },
        characters: [
          {
            id: "char-pizza-1",
            name: "Legendary Pizza Character",
            image: "https://placehold.co/400x400/yellow/black?text=PIZZA",
            rarity: "legendary",
            dropRate: 0.15,
            isUsing: true,
            storeName: "Pizza Company",
          }
        ],
        coupons: [
          {
            id: "coupon-pizza-1",
            code: "PIZZA1FREE",
            discount: "Buy 1 Get 1 Free",
            expiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
            image: "https://example.com/coupon3.jpg",
            isUsed: false,
            storeName: "Pizza Company",
            totalQuantity: 30,
            remainingQuantity: 12,
            resetDate: new Date(),
            couponType: "bogo",
          }
        ],
        lastUpdated: new Date()
      }
    ];
    
    // Insert the sample data
    await Player.insertMany(samplePlayers);
    console.log('Sample user_info data created successfully!');
    
    // Display the created data
    const players = await Player.find({});
    console.log(`Created ${players.length} player records:`);
    players.forEach(player => {
      console.log(`- Player (${player.u_id}): Score: ${player.score}, Characters: ${player.characters.length}, Coupons: ${player.coupons.length}`);
    });
    
    // Verify the collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
}

// Run the function
createUserInfoSampleData();
