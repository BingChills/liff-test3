import { Scene } from "phaser";
import { Events } from "phaser";

interface Coupon {
    id: string;
    brand: string;
    logo: string;
    discount: string;
    expiresIn: number;
    isUsed?: boolean;
    qrCode: string;
}

interface ChestRarity {
    type: 'common' | 'rare' | 'epic' | 'legendary';
    pointRange: [number, number]; // [min, max]
    couponDropChance: number;
}

export class Game extends Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private chests!: Phaser.Physics.Arcade.Group;
    private items!: Phaser.Physics.Arcade.Group;
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private backgroundMusic!: Phaser.Sound.BaseSound;
    private eventBus: Phaser.Events.EventEmitter;

    // Chest rarity configuration
    private chestRarities: ChestRarity[] = [
        { type: 'common', pointRange: [10, 50], couponDropChance: 0.1 },
        { type: 'rare', pointRange: [50, 150], couponDropChance: 0.25 },
        { type: 'epic', pointRange: [150, 300], couponDropChance: 0.5 },
        { type: 'legendary', pointRange: [300, 500], couponDropChance: 0.75 }
    ];

    // Available coupons
    private coupons: Coupon[] = [
        {
            id: '1',
            brand: "McDonald's",
            logo: "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=200&q=80",
            discount: "50% Discount",
            expiresIn: 7,
            qrCode: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=300&q=80"
        },
        // ... (rest of your coupons array)
    ];

    constructor() {
        super("Game");
        this.eventBus = new Events.EventEmitter();
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("hedgehog", "hedgehog.png");
        this.load.spritesheet(
            "hedgehog_walk",
            //NOTE: Not working
            "Hedgehog/hedgehog-Walk_South.png",
            {
                frameWidth: 64,
                frameHeight: 64,
            }
        );
        this.load.spritesheet("hedgehog_idle", "Hedgehog/hedgehog-Idle.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.image("corgi", "corgi.png");
        this.load.image("chest", "chest.png");
        this.load.image("background", "grass_bg.png");
        this.load.image("background2", "grass_bg2.png");
        this.load.audio("bgMusic", ["8-bit-arcade.mp3"]);
        this.load.audio("collectSound", ["collect.mp3"]);

        // Load chest variants
        this.load.image("chest_common", "chests/chest_common.png");
        this.load.image("chest_rare", "chests/chest_rare.png");
        this.load.image("chest_epic", "chests/chest_epic.png");
        this.load.image("chest_legendary", "chests/chest_legendary.png");
        
        // Load point sprite
        this.load.image("point_orb", "items/point_orb.png");
    }

    create() {
        // Add background
        this.add.image(430 / 2, 932 / 2, "background").setScale(1);

        // Add and play background music
        this.backgroundMusic = this.sound.add("bgMusic", {
            volume: 0.5,
            loop: true,
        });
        this.backgroundMusic.play();

        // Add player sprite
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("hedgehog_walk", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        // Create idle animation
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("hedgehog_idle", {
                start: 0,
                end: 3,
            }),
            frameRate: 4,
            repeat: -1,
        });

        this.player = this.physics.add
            .sprite(157.5, 600, "hedgehog_idle")
            .setScale(1);

        // Play idle animation by default
        this.player.play("idle");

        // Create a group for chests
        this.chests = this.physics.add.group();

        // Create a group for items
        this.items = this.physics.add.group();

        // Spawn 4 chest at random positions
        for (let i = 0; i < 4; i++) {
            this.spawnChest();
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

        // Enable collision detection between player and items
        this.physics.add.overlap(
            this.player,
            this.items,
            this
                .collectItem as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // Input listener for movement
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.physics.moveTo(this.player, pointer.x, pointer.y, 150);

            // Play walking animation
            this.player.play("walk", true);

            // Calculate angle between player and pointer
            const angle = Phaser.Math.Angle.Between(
                this.player.x,
                this.player.y,
                pointer.x,
                pointer.y
            );

            // Flip sprite based on movement direction
            if (pointer.x < this.player.x) {
                this.player.setFlipX(true);
            } else {
                this.player.setFlipX(false);
            }
        });
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
            this.player.play("idle", true);
        }
    }

    private getRandomChestRarity(): ChestRarity {
        const rand = Math.random();
        if (rand < 0.6) return this.chestRarities[0]; // 60% common
        if (rand < 0.85) return this.chestRarities[1]; // 25% rare
        if (rand < 0.95) return this.chestRarities[2]; // 10% epic
        return this.chestRarities[3]; // 5% legendary
    }

    private spawnChest() {
        const rarity = this.getRandomChestRarity();
        const chest = this.chests.create(
            Phaser.Math.Between(40, 410),
            Phaser.Math.Between(40, 912),
            `chest_${rarity.type}`
        );
        chest.setScale(1);
        chest.setData('rarity', rarity);
    }

    private spawnPointOrb(x: number, y: number, amount: number) {
        const pointOrb = this.items.create(x, y, 'point_orb');
        pointOrb.setScale(0.5);
        pointOrb.setData('type', 'point');
        pointOrb.setData('amount', amount);
        
        // Add some physics for a nice effect
        const angle = Math.random() * Math.PI * 2;
        const speed = 100;
        pointOrb.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
    }

    collectChest = (
        object1: Phaser.GameObjects.GameObject,
        object2: Phaser.GameObjects.GameObject
    ) => {
        const chestSprite = object2 as Phaser.Physics.Arcade.Sprite;
        const rarity = chestSprite.getData('rarity') as ChestRarity;
        const chestX = chestSprite.x;
        const chestY = chestSprite.y;
        
        // Destroy the chest
        chestSprite.destroy();

        // Play collection sound
        this.sound.play("collectSound", {
            volume: 0.5,
        });

        // Generate points based on rarity
        const pointAmount = Phaser.Math.Between(
            rarity.pointRange[0],
            rarity.pointRange[1]
        );
        
        // Spawn point orbs
        const numOrbs = Math.min(5, Math.floor(pointAmount / 20)); // 1 orb per 20 points, max 5
        for (let i = 0; i < numOrbs; i++) {
            this.spawnPointOrb(
                chestX + Phaser.Math.Between(-30, 30),
                chestY + Phaser.Math.Between(-30, 30),
                Math.floor(pointAmount / numOrbs)
            );
        }

        // Check for coupon drop
        if (Math.random() < rarity.couponDropChance) {
            // Filter out used coupons
            const availableCoupons = this.coupons.filter(c => !c.isUsed);
            if (availableCoupons.length > 0) {
                const randomCoupon = Phaser.Math.RND.pick(availableCoupons);
                // Emit event for UI to handle coupon collection
                this.eventBus.emit('couponCollected', randomCoupon);
                
                // Mark coupon as used
                const couponIndex = this.coupons.findIndex(c => c.id === randomCoupon.id);
                if (couponIndex !== -1) {
                    this.coupons[couponIndex] = { ...this.coupons[couponIndex], isUsed: true };
                }
            }
        }

        // Spawn a new chest
        this.spawnChest();
    };

    collectItem = (
        object1: Phaser.GameObjects.GameObject,
        object2: Phaser.GameObjects.GameObject
    ) => {
        const itemSprite = object2 as Phaser.Physics.Arcade.Sprite;
        const itemType = itemSprite.getData('type');
        
        if (itemType === 'point') {
            const amount = itemSprite.getData('amount');
            this.score += amount;
            this.scoreText.setText("Score: " + this.score);
        }
        
        // Play collection sound
        this.sound.play("collectSound", {
            volume: 0.3,
        });
        
        itemSprite.destroy();
    };
}
