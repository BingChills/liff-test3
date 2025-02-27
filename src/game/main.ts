import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game, Types, Scale } from "phaser";

const config: Types.Core.GameConfig = {
    type: AUTO,
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        width: 360,         // Standard 16:9 width
        height: 640,        // Standard 16:9 height
        zoom: 1,
        expandParent: true, // Automatically expand the parent container
        autoRound: true     // Round pixel values to prevent blurring
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: [MainGame],
    render: {
        pixelArt: true,     // Makes pixel art look sharp
        antialias: false,   // Disable antialiasing for crisp pixels
        roundPixels: true   // Round pixel positions to prevent sub-pixel rendering
    }
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;