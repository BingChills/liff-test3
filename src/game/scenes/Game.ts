import { Scene } from "phaser";
import { Events } from "phaser";
import { Player } from "../entities/Player";
import { ChestManager } from "../managers/ChestManager";
import { AutoModeController } from "../controllers/AutoModeController";
import { Coupon as GameCoupon, GameConfig } from "../types/GameTypes";
import { EventBus } from "../EventBus";
import { Coupon as UICoupon } from "../../state/gameState";

export class Game extends Scene {
    // Core components
    private player!: Player;
    private chestManager!: ChestManager;
    private autoModeController!: AutoModeController;

    // UI elements
    private score: number = 0;

    // Audio
    private backgroundMusic!: Phaser.Sound.BaseSound;

    // Event system
    private gameEventBus: Phaser.Events.EventEmitter;

    // Current attack state
    private currentAttackTimer?: Phaser.Time.TimerEvent;

    // Available coupons
    private coupons: GameCoupon[] = [
        {
            id: "1",
            brand: "McDonald's",
            logo: "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=200&q=80",
            discount: "50% Discount",
            expiresIn: 7,
            qrCode: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=300&q=80",
            storeName: "McDonald's"
        },
        // ... (rest of your coupons array)
    ];

    constructor() {
        super("Game");
        this.gameEventBus = new Events.EventEmitter();
    }

    preload() {
        try {
            // Don't set baseURL - let it use the default which is the root of the site

            // Set the path manually to make sure we use the correct path in all environments
            this.load.setPath("assets"); // No leading slash - use a relative path

            // Log the loading path for debugging
            console.log(
                "Loading assets from:",
                window.location.origin + "/" + this.load.path
            );

            // Add error handlers with detailed logging
            this.load.on("loaderror", (fileObj: any) => {
                console.error("Asset loading error:", {
                    src: fileObj.src,
                    key: fileObj.key,
                    url: window.location.href,
                });
            });

            // Add complete handler to verify loading
            this.load.on("complete", () => {
                console.log("All assets loaded successfully");
            });

            // Character assets - ninja turtle
            this.load.spritesheet(
                "ninjaTurtle_walk",
                "characters/ninja-turtle/walk.png",
                {
                    frameWidth: 64,
                    frameHeight: 64,
                }
            );
            this.load.spritesheet(
                "ninjaTurtle_idle",
                "characters/ninja-turtle/idle.png",
                {
                    frameWidth: 64,
                    frameHeight: 64,
                }
            );

            // Character assets - hedgehog
            this.load.image("hedgehog", "characters/hedgehog/idle.png");
            this.load.spritesheet(
                "hedgehog_walk",
                "characters/hedgehog/walk-south.png",
                {
                    frameWidth: 64,
                    frameHeight: 64,
                }
            );
            this.load.spritesheet(
                "hedgehog_idle",
                "characters/hedgehog/idle.png",
                {
                    frameWidth: 64,
                    frameHeight: 64,
                }
            );

            // Item assets
            this.load.image("chest", "items/chest.png");

            // Background assets
            this.load.image("background", "backgrounds/grass-bg.png");
            this.load.image("background2", "backgrounds/grass-bg2.png");

            // Audio assets
            this.load.audio("bgMusic", ["audio/background-music.mp3"]);
            this.load.audio("collectPointSound", ["audio/collect.mp3"]);

            // Chest variants
            this.load.image("chest_common", "items/chests/common.png");
            this.load.image("chest_rare", "items/chests/rare.png");
            this.load.image("chest_epic", "items/chests/epic.png");
            this.load.image("chest_legendary", "items/chests/legendary.png");

            // Points and collectibles
            this.load.image("point_orb", "items/point-orb.png");
        } catch (error) {
            console.error("Error during asset preloading:", error);
        }
    }

    create() {
        // Add background with proper scaling
        const bg = this.add.image(0, 0, "background");
        bg.setOrigin(0, 0);
        bg.setDisplaySize(360, 640);

        // Add and play background music
        this.backgroundMusic = this.sound.add("bgMusic", {
            volume: 0.1,
            loop: true,
        });
        this.backgroundMusic.play();

        // Create animations
        this.createAnimations();

        // Set world bounds for 360x640
        this.physics.world.setBounds(0, 0, 360, 640);

        // Initialize player
        this.player = new Player(this, 360 * 0.5, 640 * 0.6);
        this.player.createAnimations();

        // Initialize chest manager
        const gameConfig: GameConfig = {
            eventBus: this.gameEventBus,
        };

        this.chestManager = new ChestManager(
            this,
            this.player,
            gameConfig,
            this.coupons,
            (newScore: number) => {
                this.score = newScore;

                // Emit score update event to UI
                EventBus.emit("scoreUpdated", newScore);
            }
        );

        // Setup colliders
        this.chestManager.setupColliders();

        // Spawn initial chests
        this.chestManager.spawnInitialChests(4);

        // Initialize auto mode controller
        this.autoModeController = new AutoModeController(
            this,
            this.player,
            this.chestManager
        );

        // Create auto mode button
        this.autoModeController.createAutoModeButton();

        // Setup input listener for movement and chest interaction
        this.setupPlayerInput();

        // Setup event listeners for coupon collection and point updates
        this.setupEventListeners();

        // Notify the React component that this scene is ready
        EventBus.emit("current-scene-ready", this);
    }

    // Method to set up event listeners for game events
    private setupEventListeners(): void {
        // Listen for chest opened event
        this.gameEventBus.on(
            "chestOpened",
            (data: { coupon: GameCoupon; coins: number }) => {
                // Convert game coupon to UI coupon format
                const uiCoupon: UICoupon = {
                    storeName: data.coupon.storeName,
                    id: data.coupon.id,
                    code: data.coupon.id, // Using ID as code for simplicity
                    discount: data.coupon.discount,
                    expiry: data.coupon.expiresIn
                        ? `${data.coupon.expiresIn} days`
                        : undefined,
                    isUsed: false,
                };

                // Emit coupon collected event to UI
                EventBus.emit("couponCollected", uiCoupon);

                // Emit coins collected event to UI if coins were awarded
                if (data.coins > 0) {
                    EventBus.emit("coinsCollected", data.coins);
                }
            }
        );
    }

    private createAnimations(): void {
        // NinjaTurtle animations
        this.anims.create({
            key: "ninjaTurtle_walk",
            frames: this.anims.generateFrameNumbers("ninjaTurtle_walk", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "ninjaTurtle_idle",
            frames: this.anims.generateFrameNumbers("ninjaTurtle_idle", {
                start: 0,
                end: 3,
            }),
            frameRate: 4,
            repeat: -1,
        });

        // Hedgehog animations
        this.anims.create({
            key: "hedgehog_walk",
            frames: this.anims.generateFrameNumbers("hedgehog_walk", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "hedgehog_idle",
            frames: this.anims.generateFrameNumbers("hedgehog_idle", {
                start: 0,
                end: 3,
            }),
            frameRate: 4,
            repeat: -1,
        });
    }

    private setupPlayerInput(): void {
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            // Ignore clicks in the auto button area
            // Auto button is positioned at bottom right corner
            const autoButtonX = this.cameras.main.width - 70;
            const autoButtonY = this.cameras.main.height - 50;
            const buttonRadius = 40; // Slightly larger than the actual button for better UX

            // Calculate distance from click to button center
            const distanceToButton = Phaser.Math.Distance.Between(
                pointer.x,
                pointer.y,
                autoButtonX,
                autoButtonY
            );

            // If clicked on or near the button, ignore the click for player movement
            if (distanceToButton < buttonRadius) {
                return;
            }

            // Stop any existing attack timer
            if (this.currentAttackTimer) {
                this.currentAttackTimer.destroy();
                this.player.setIsAttacking(false);
            }

            // Check if clicked on a chest
            const chests = this.chestManager.getChests();
            const clickedChest = chests.getChildren().find((chest) => {
                const spriteChest = chest as Phaser.Physics.Arcade.Sprite;
                const bounds = spriteChest.getBounds();
                return bounds.contains(pointer.x, pointer.y);
            });

            if (clickedChest) {
                const chest = clickedChest as Phaser.Physics.Arcade.Sprite;

                // Move player to position near the chest
                this.player.moveTowardObject(chest, 35);

                // Attack when close enough
                this.currentAttackTimer = this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        const distance = Phaser.Math.Distance.Between(
                            this.player.getSprite().x,
                            this.player.getSprite().y,
                            chest.x,
                            chest.y
                        );
                        if (distance < 50 && chest.active) {
                            // Increased attack range
                            this.player.setIsAttacking(true);
                            this.player.setIsMoving(false);
                            this.player.getSprite().setVelocity(0, 0);
                            this.chestManager.attackChest(chest);
                        } else if (!chest.active) {
                            this.currentAttackTimer?.destroy();
                            this.player.setIsAttacking(false);
                            if (!this.player.isPlayerMoving()) {
                                this.player
                                    .getSprite()
                                    .play("ninjaTurtle_idle", true);
                            }
                        }
                    },
                    loop: true,
                    paused: false,
                });
            } else {
                // Normal movement - click to move
                this.player.moveToPosition(pointer.x, pointer.y);
            }
        });
    }

    update() {
        // Update player
        this.player.update();

        // Update auto mode controller
        this.autoModeController.update();
    }
}
