import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game, Types, Scale } from "phaser";

// The main **game** entry point. This contains the game configuration and start the game.
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        width: 360,
        height: 640
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: [MainGame]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;