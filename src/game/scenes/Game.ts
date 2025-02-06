import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Game extends Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private chests!: Phaser.Physics.Arcade.Group; // Group to manage all chests
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("corgi", "corgi.png");
        this.load.image("chest", "chest.png");
        this.load.image("background", "grass_bg.png");
    }

    create() {
        // Add background
        this.add.image(430 / 2, 932 / 2, "background");

        // Add player sprite
        this.player = this.physics.add
            .sprite(157.5, 600, "corgi")
            .setScale(0.08);

        // Create a group for chests
        // NOTE: make more starts and make respawn system
        this.chests = this.physics.add.group();

        // Spawn 4 chest at random positions
        for (let i = 0; i < 4; i++) {
            const chest = this.chests.create(
                Phaser.Math.Between(20, 410), // X Position
                Phaser.Math.Between(20, 912), // Y Position
                "chest"
            );
            chest.setScale(0.08);
        }

        // Add score text
        this.scoreText = this.add.text(25, 50, "Score: 0", {
            fontSize: "24px",
            fontStyle: "bold", // Makes the text bold
            color: "#000", // Black fill color
            stroke: "#fff", // White outline color
            strokeThickness: 4, // Thickness of the outline
        });

        // Enable collision detection between player and chest
        this.physics.add.overlap(
            this.player,
            this.chests,
            this.collectChest,
            undefined,
            this
        );

        // Input listener for movement
        // NOTE: don't quite understand
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.physics.moveTo(this.player, pointer.x, pointer.y, 150);
        });
        EventBus.emit("current-scene-ready", this);
    }

    update() {
        // Stop player movement when close to the destination
        // NOTE: still buggy
        if (
            Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.input.activePointer.worldX,
                this.input.activePointer.worldY
            ) < 5
        ) {
            this.player.setVelocity(0);
        }
    }

    collectChest = (
        player:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
        chest:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile
    ) => {
        // Since we know these are Sprites, we can safely cast them
        const chestSprite = chest as Phaser.Physics.Arcade.Sprite;

        // Destroy the collected chest
        chestSprite.destroy();

        // Increase the score and update the text
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);

        // Spawn a new chest at a random position
        const newChest = this.chests.create(
            Phaser.Math.Between(40, 410), // X position
            Phaser.Math.Between(40, 912), // Y position
            "chest"
        );
        newChest.setScale(0.08);
    };
}

