# Linkz Gameplay

A gamified loyalty platform. The main features include coupon collection and character summoning application built with Next.js, React, and Phaser. Users can collect points from different stores, summon characters, and redeem coupons.

## Tech Stack

- **Frontend Framework**: [Next.js 14.2.3](https://github.com/vercel/next.js)
- **UI Library**: [React](https://reactjs.org/) with TypeScript 5
- **Game Engine**: [Phaser 3.87.0](https://github.com/phaserjs/phaser)
- **Styling**: Tailwind CSS
- **Backend**: Express.js
- **Database**: MongoDB
- **Node.js**: v18+ recommended

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/BingChills/liff-test3.git
   cd linkz-gameplay
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory with the following variables:
   
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   NODE_ENV=development
   ```

4. **Run the Application**

   **Development Mode (Frontend & Backend Together)**
   ```bash
   npm run dev:full
   ```

   **Run Frontend and Backend Separately**
   ```bash
   # Start Backend (Express Server)
   npm run server
   
   # Start Frontend (Next.js)
   npm run dev
   ```
   
   The servers will be available at:
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:5000/api`

## Project Structure

- `/src` - Contains the Next.js client source code
  - `/components` - React components like SummonPage, PageHeader, etc.
  - `/state` - State management files including gameState.ts
  - `/game` - Phaser game integration
    - `/scenes` - Phaser game scenes
    - `EventBus.ts` - Communication bridge between React and Phaser
    - `PhaserGame.tsx` - React component to initialize Phaser
  - `/pages` - Next.js pages
  - `/styles` - CSS styles, including globals.css
- `/public` - Static assets
  - `/assets` - Game assets (images, audio, etc.)
- `/server` - Backend Express.js server
  - `/config` - Server configuration (database connection)
  - `/controllers` - API controllers
  - `/middleware` - Custom middleware
  - `/models` - MongoDB models
  - `/routes` - API routes
  - `server.js` - Main server file

## Features

- **Store Management**: Switch between different stores, each with their own point balances
- **Character Summoning**: Spend points to summon characters (100 points per character)
- **Coupon Collection**: Collect and redeem coupons from different stores
- **Rarity System**: Characters have different rarities (common, rare, epic, legendary)
- **React-Phaser Integration**: Seamless communication between React UI and Phaser game using EventBus
- **RESTful API**: Backend API for player data management

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/players/:userId` | Get player data by user ID |
| POST | `/api/players` | Create a new player |
| PUT | `/api/players/:userId` | Update entire player data |
| PATCH | `/api/players/:userId/:field` | Update specific player field |

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch frontend development server at http://localhost:8080 |
| `npm run server` | Start backend server at http://localhost:5000 |
| `npm run dev:full` | Run both frontend and backend concurrently |
| `npm run build` | Create production build |
| `npm run dev-nolog` | Run frontend development server without analytics |
| `npm start` | Start the production server |

## Communication Between React and Phaser

The application uses an EventBus system to facilitate communication between React components and the Phaser game:

```javascript
// In React
import { EventBus } from '../game/EventBus';
EventBus.emit('event-name', data);

// In Phaser
EventBus.on('event-name', (data) => {
    // Handle event
});
```

## Environment Setup

The project supports different environments:
- Development
- Testing
- Production

Environment-specific configurations can be set up in `.env` files.

## Browser Compatibility

The application is optimized for modern browsers including Chrome, Firefox, Safari, and Edge.

## Troubleshooting

**Common Issues:**

1. **Port already in use**: 
   - If port 8080 is already in use, you can modify the port in the dev script in `package.json`
   - If port 5000 is already in use, you can modify the PORT value in `.env` file

2. **Node version**: Make sure you're using Node.js v18+ for optimal compatibility

3. **MongoDB Connection**: Ensure your MongoDB connection string in `.env` is correct and the database is accessible

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Open a pull request

---

This project is powered by Next.js, Phaser, and React. For questions or support, please contact the project owner.

## Team Members:

- **Pojsada Pansubkul**: Business Analyst, Project Manager, Developer
Expertise: Management, business development, UX/UI design.
Experience: Roles in business analysis and frontend development using React and React Native.
- **Ravit Chutivisuth**: Game Designer, Developer
Expertise: Game design, marketing, and full-stack development.
Experience: Background in developing interactive and gamified systems.
- **Athip Phunruangsakao**: Release Train Engineer, Business Analyst
Expertise: Business development, data analysis.
Experience: Specialization in analyzing and implementing efficient business solutions.