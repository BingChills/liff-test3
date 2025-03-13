# Linkz Gameplay

A gamified loyalty platform. The main features in include coupon collection and character summoning application built with Next.js, React, and Phaser. Users can collect points from different stores, summon characters, and redeem coupons.

## Tech Stack

- **Frontend Framework**: [Next.js 14.2.3](https://github.com/vercel/next.js)
- **UI Library**: [React](https://reactjs.org/) with TypeScript 5
- **Game Engine**: [Phaser 3.87.0](https://github.com/phaserjs/phaser)
- **Styling**: Tailwind CSS
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

3. **Run the Development Server**

   ```bash
   npm run dev
   ```

   This will start the development server at `http://localhost:8080`.

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

## Features

- **Store Management**: Switch between different stores, each with their own point balances
- **Character Summoning**: Spend points to summon characters (100 points per character)
- **Coupon Collection**: Collect and redeem coupons from different stores
- **Rarity System**: Characters have different rarities (common, rare, epic, legendary)
- **React-Phaser Integration**: Seamless communication between React UI and Phaser game using EventBus

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch development server at http://localhost:8080 |
| `npm run build` | Create production build in the `dist` folder |
| `npm run dev-nolog` | Run development server without analytics |

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

1. **Port already in use**: If port 8080 is already in use, you can modify the port in `next.config.mjs`
2. **Node version**: Make sure you're using Node.js v16+ for optimal compatibility

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