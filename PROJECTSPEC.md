# Linkz Gameplay - Project Specification

## Project Overview

Linkz Gameplay is a web-based game application integrated with LINE Front-end Framework (LIFF). The game allows players to interact with a Phaser-based 2D game environment, collect coupons, earn points, and build their profile. The application syncs player data with a MongoDB database to persist scores, player information, and game progress.

### Key Features
- **2D Gameplay**: Interactive game built with Phaser.js
- **Player Profiles**: Display player information, scores, and stats
- **Score Tracking**: Real-time score updates with database persistence
- **Store Integration**: Multiple store currencies and points tracking
- **Coupon System**: Collect and manage discount coupons
- **Character System**: Collect characters with different rarities
- **LINE Integration**: Login and user identification through LIFF

## Technical Specifications

### Frontend Architecture
- **Framework**: React.js
- **Game Engine**: Phaser 3
- **State Management**: React Context API (via `gameState.ts`)
- **Styling**: Tailwind CSS
- **Networking**: Axios for API calls

### Backend Architecture
- **Server**: Express.js
- **Database**: MongoDB (via Mongoose)
- **API**: RESTful endpoints for player data
- **Serverless**: Vercel serverless functions

### Key Components

#### Frontend Components
1. **Game Components**
   - `Game.ts`: Main Phaser game scene implementation
   - `ChestManager.ts`: Manages game objects and score updates
   - `EventBus.ts`: Facilitates communication between game and React

2. **UI Components**
   - `PageHeader.tsx`: App header with player profile modal
   - Navigation components for tabs and menus

3. **State Management**
   - `gameState.ts`: Central state management for all game data
   - Includes throttled score updates and beforeunload handling

#### Backend Components
1. **API Controllers**
   - `playerController.js`: Handles player data CRUD operations
   - Specific endpoints for score updates

2. **Database Models**
   - `Player.js`: Mongoose schema for player data
   - Includes nested schemas for stores, characters, and coupons

3. **Server Configuration**
   - `server.js`: Express server setup
   - `api/server.js`: Vercel serverless adapter

### Database Schema
The application uses MongoDB with Mongoose for data modeling. The primary schema is:

```javascript
const PlayerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  displayName: { type: String, default: null },
  pictureUrl: { type: String, default: null },
  statusMessage: { type: String, default: null },
  score: { type: Number, default: 0 },
  stores: [StoreSchema],
  characters: [CharacterSchema],
  coupons: [CouponSchema]
});
```

### API Endpoints
- `GET /api/players/:userId`: Retrieve player data
- `POST /api/players`: Create new player
- `PUT /api/players/:userId`: Update all player data
- `PATCH /api/players/:userId/:field`: Update specific field (used for score updates)

### Deployment
- **Platform**: Vercel
- **Configuration**: `vercel.json` for routing and serverless functions
- **Environment Variables**: MongoDB connection URI in `.env`

### Performance Optimizations
- **Score Update Throttling**: Limits database updates to once every 300ms
- **Synchronous Final Save**: Ensures scores are saved when app is closed
- **Event-based Communication**: Uses event bus for game-UI communication

## Development Guidelines

### State Management
- Central state management through React Context
- Automatic state persistence to database
- Throttling for high-frequency updates

### Database Interactions
- Use `updatePlayerField` for single field updates
- Use `updatePlayer` for multi-field updates
- Direct database updates for time-critical operations

### Code Organization
- Keep files under 300 lines
- Split logic into appropriate managers and controllers
- Use the event system for cross-component communication

### Styling
- Use Tailwind CSS for all styling
- Follow existing design patterns for consistency

## Future Enhancements
- Enhanced offline support
- Improved error handling and retries
- Additional game features and levels
- More detailed analytics on player behavior

---

*This specification serves as a reference for the Linkz Gameplay project architecture and implementation details.*
