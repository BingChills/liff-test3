import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Game extends Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private chests!: Phaser.Physics.Arcade.Group;
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private backgroundMusic!: Phaser.Sound.BaseSound;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("corgi", "corgi.png");
        this.load.image("chest", "chest.png");
        this.load.image("background", "grass_bg.png");
        this.load.audio("bgMusic", ["8-bit-arcade.mp3"]);
        this.load.audio("collectSound", ["collect.mp3"]);
    }

    create() {
        // Add background
        this.add.image(430 / 2, 932 / 2, "background");

        // Add and play background music
        this.backgroundMusic = this.sound.add("bgMusic", {
            volume: 0.5,
            loop: true,
        });
        this.backgroundMusic.play();

        // Add player sprite
        this.player = this.physics.add
            .sprite(157.5, 600, "corgi")
            .setScale(0.08);

        // Create a group for chests
        this.chests = this.physics.add.group();

        // Spawn 4 chest at random positions
        for (let i = 0; i < 4; i++) {
            const chest = this.chests.create(
                Phaser.Math.Between(20, 410),
                Phaser.Math.Between(20, 912),
                "chest"
            );
            chest.setScale(0.08);
        }

        // Add score text
        this.scoreText = this.add.text(25, 50, "Score: 0", {
            fontSize: "24px",
            fontStyle: "bold",
            color: "#000",
            stroke: "#fff",
            strokeThickness: 4,
        });

        // Enable collision detection between player and chest
        this.physics.add.overlap(
            this.player,
            this.chests,
            this
                .collectChest as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // Input listener for movement
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.physics.moveTo(this.player, pointer.x, pointer.y, 150);
        });
        EventBus.emit("current-scene-ready", this);
    }

    update() {
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
        object1: Phaser.GameObjects.GameObject,
        object2: Phaser.GameObjects.GameObject
    ) => {
        const chestSprite = object2 as Phaser.Physics.Arcade.Sprite;
        chestSprite.destroy();

        // Play collection sound
        this.sound.play("collectSound", {
            volume: 0.5,
        });

        this.score += 10;
        this.scoreText.setText("Score: " + this.score);

        const newChest = this.chests.create(
            Phaser.Math.Between(40, 410),
            Phaser.Math.Between(40, 912),
            "chest"
        );
        newChest.setScale(0.08);
    };
}

