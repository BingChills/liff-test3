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
    hp: number; // Add base HP for each rarity
}

export class Game extends Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private chests!: Phaser.Physics.Arcade.Group;
    private items!: Phaser.Physics.Arcade.Group;
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private backgroundMusic!: Phaser.Sound.BaseSound;
    private eventBus: Phaser.Events.EventEmitter;
    private playerAttackDamage: number = 10; // Base attack damage
    private hpBars: Map<Phaser.Physics.Arcade.Sprite, Phaser.GameObjects.Container> = new Map();
    private currentAttackTimer?: Phaser.Time.TimerEvent;
    private isAttacking: boolean = false;
    private targetX: number = 0;
    private targetY: number = 0;
    private isMoving: boolean = false;

    // Chest rarity configuration
    private chestRarities: ChestRarity[] = [
        { type: 'common', pointRange: [10, 50], couponDropChance: 0.1, hp: 30 },
        { type: 'rare', pointRange: [50, 150], couponDropChance: 0.25, hp: 60 },
        { type: 'epic', pointRange: [150, 300], couponDropChance: 0.5, hp: 100 },
        { type: 'legendary', pointRange: [300, 500], couponDropChance: 0.75, hp: 150 }
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

        this.load.spritesheet(
            "ninjaTurtle_walk",
            "NinjaTurtle/ninjaTurtle-Walk.png",
            {
                frameWidth: 64,
                frameHeight: 64,
            }
        );
        this.load.spritesheet("ninjaTurtle_idle", "NinjaTurtle/ninjaTurtle-Idle.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.image("hedgehog", "hedgehog.png");
        this.load.spritesheet(
            "hedgehog_walk",
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
        this.load.image("chest", "chest.png");
        this.load.image("background", "grass_bg.png");
        this.load.image("background2", "grass_bg2.png");
        this.load.audio("bgMusic", ["8-bit-arcade.mp3"]);
        this.load.audio("collectPointSound", ["collect.mp3"]);

        // Load chest variants
        this.load.image("chest_common", "chests/chest_common.png");
        this.load.image("chest_rare", "chests/chest_rare.png");
        this.load.image("chest_epic", "chests/chest_epic.png");
        this.load.image("chest_legendary", "chests/chest_legendary.png");
        
        // Load point sprite
        this.load.image("point_orb", "items/point_orb.png");
    }

    create() {
        // Add background with proper scaling
        const bg = this.add.image(0, 0, "background");
        bg.setOrigin(0, 0);
        bg.setDisplaySize(360, 640);

        // Add and play background music
        this.backgroundMusic = this.sound.add("bgMusic", {
            volume: 0.2,
            loop: true,
        });
        this.backgroundMusic.play();

        // Add player sprite
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

        // Player
        this.player = this.physics.add
            .sprite(360 * 0.5, 640 * 0.6, "ninjaTurtle_idle")
            .setScale(1);
        
        // Set smaller collision box for player
        this.player.setSize(this.player.width * 0.5, this.player.height * 0.5);
        this.player.setOffset(this.player.width * 0.25, this.player.height * 0.25);

        // Set world bounds for 360x640
        this.physics.world.setBounds(0, 0, 360, 640);
        this.player.setCollideWorldBounds(true);

        // Play idle animation by default
        this.player.play("ninjaTurtle_idle");

        // Create a group for chests with collision
        this.chests = this.physics.add.group({
            collideWorldBounds: true,
            immovable: true
        });

        // Enable collision between player and chests
        this.physics.add.collider(
            this.player,
            this.chests,
            function(this: Game, object1: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) {
                // When collision occurs, check if we're trying to attack this chest
                if (this.currentAttackTimer && this.isMoving) {
                    this.isMoving = false;
                    const playerSprite = object1 as Phaser.Physics.Arcade.Sprite;
                    playerSprite.setVelocity(0, 0);
                    
                    // Start attacking if this is the chest we clicked
                    const clickedChest = object2 as Phaser.Physics.Arcade.Sprite;
                    const distance = Phaser.Math.Distance.Between(
                        playerSprite.x,
                        playerSprite.y,
                        clickedChest.x,
                        clickedChest.y
                    );
                    if (distance < 50) {
                        this.isAttacking = true;
                        this.attackChest(clickedChest);
                    }
                }
            } as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // Create a group for items
        this.items = this.physics.add.group();

        // Spawn 4 chest at random positions
        for (let i = 0; i < 4; i++) {
            this.spawnChest();
        }

        // Add score text - positioned for new resolution
        this.scoreText = this.add.text(20, 40, "Score: 0", {
            fontSize: "20px",
            fontStyle: "bold",
            color: "#000",
            stroke: "#fff",
            strokeThickness: 4,
        });

        // Input listener for movement and chest interaction
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            // Stop any existing attack timer
            if (this.currentAttackTimer) {
                this.currentAttackTimer.destroy();
                this.isAttacking = false;
            }

            // Check if clicked on a chest
            const clickedChest = this.chests.getChildren().find((chest) => {
                const spriteChest = chest as Phaser.Physics.Arcade.Sprite;
                const bounds = spriteChest.getBounds();
                return bounds.contains(pointer.x, pointer.y);
            });

            if (clickedChest) {
                const chest = clickedChest as Phaser.Physics.Arcade.Sprite;
                // Calculate position near the chest
                const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, chest.x, chest.y);
                const distance = 35; // Adjusted distance to stop from chest
                this.targetX = chest.x - Math.cos(angle) * distance;
                this.targetY = chest.y - Math.sin(angle) * distance;
                
                // Clamp the target position to world bounds
                this.targetX = Phaser.Math.Clamp(this.targetX, 32, 328);
                this.targetY = Phaser.Math.Clamp(this.targetY, 32, 608);
                
                this.isMoving = true;
                this.physics.moveTo(this.player, this.targetX, this.targetY, 150);
                
                // Attack when close enough
                this.currentAttackTimer = this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        const distance = Phaser.Math.Distance.Between(
                            this.player.x,
                            this.player.y,
                            chest.x,
                            chest.y
                        );
                        if (distance < 50 && chest.active) { // Increased attack range
                            this.isAttacking = true;
                            this.isMoving = false;
                            this.player.setVelocity(0, 0);
                            this.attackChest(chest);
                        } else if (!chest.active) {
                            this.currentAttackTimer?.destroy();
                            this.isAttacking = false;
                            if (!this.isMoving) {
                                this.player.play("ninjaTurtle_idle", true);
                            }
                        }
                    },
                    loop: true,
                    paused: false
                });
            } else {
                // Normal movement
                this.targetX = Phaser.Math.Clamp(pointer.x, 32, 328);
                this.targetY = Phaser.Math.Clamp(pointer.y, 32, 608);
                this.isMoving = true;
                this.isAttacking = false;
                this.physics.moveTo(this.player, this.targetX, this.targetY, 150);
            }

            // Play walking animation
            this.player.play("ninjaTurtle_walk", true);

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
        // Check if we're close to target position
        if (this.isMoving) {
            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.targetX,
                this.targetY
            );
            
            if (distance < 5) {
                this.player.setVelocity(0, 0);
                this.isMoving = false;
                if (!this.isAttacking) {
                    this.player.play("ninjaTurtle_idle", true);
                }
            }
        }
    }

    private getRandomChestRarity(): ChestRarity {
        const rand = Math.random();
        if (rand < 0.6) return this.chestRarities[0]; // 60% common
        if (rand < 0.85) return this.chestRarities[1]; // 25% rare
        if (rand < 0.95) return this.chestRarities[2]; // 10% epic
        return this.chestRarities[3]; // 5% legendary
    }

    private createHPBar(x: number, y: number, maxHP: number): Phaser.GameObjects.Container {
        // Create container for HP bar
        const hpBar = this.add.container(x, y - 20);

        // Background bar (gray)
        const bgBar = this.add.rectangle(0, 0, 32, 5, 0x808080);
        
        // Health bar (green)
        const bar = this.add.rectangle(0, 0, 32, 5, 0x00ff00);
        
        // Add both bars to container
        hpBar.add([bgBar, bar]);
        
        // Initially hide the HP bar
        hpBar.setVisible(false);
        
        return hpBar;
    }

    private attackChest(chest: Phaser.Physics.Arcade.Sprite) {
        const currentHP = chest.getData('currentHP');
        const maxHP = chest.getData('maxHP');
        
        if (currentHP <= 0) return;

        // Reduce HP
        const newHP = currentHP - this.playerAttackDamage;
        chest.setData('currentHP', newHP);

        // Flash effect
        this.tweens.add({
            targets: chest,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                chest.setAlpha(1);
            }
        });

        // Update HP bar
        const hpBar = this.hpBars.get(chest);
        if (hpBar) {
            // Show and position HP bar
            hpBar.setVisible(true);
            hpBar.setPosition(chest.x, chest.y - 20);

            // Update bar width and color
            const bar = hpBar.getAt(1) as Phaser.GameObjects.Rectangle;
            const width = (newHP / maxHP) * 32;
            bar.width = width;
            
            // Change color based on HP percentage
            if (newHP / maxHP > 0.6) {
                bar.setFillStyle(0x00ff00); // Green
            } else if (newHP / maxHP > 0.3) {
                bar.setFillStyle(0xffff00); // Yellow
            } else {
                bar.setFillStyle(0xff0000); // Red
            }
        }

        // If HP is depleted, destroy the chest and HP bar
        if (newHP <= 0) {
            if (hpBar) {
                hpBar.destroy();
                this.hpBars.delete(chest);
            }
            this.collectChest(this.player, chest);
        }
    }

    private spawnChest() {
        const rarity = this.getRandomChestRarity();
        if (!rarity) {
            console.error('Failed to get chest rarity');
            return;
        }

        const chest = this.chests.create(
            Phaser.Math.Between(40, 320), // 360 - 40
            Phaser.Math.Between(40, 600), // 640 - 40
            `chest_${rarity.type}`
        ) as Phaser.Physics.Arcade.Sprite;
        
        chest.setScale(1);
        // Set a smaller collision body for the chest
        chest.setSize(chest.width * 0.6, chest.height * 0.6);
        chest.setOffset(chest.width * 0.2, chest.height * 0.2);
        
        // Explicitly set all chest data
        chest.setData({
            rarity: rarity,
            currentHP: rarity.hp,
            maxHP: rarity.hp
        });
        
        // Create and store HP bar
        const hpBar = this.createHPBar(chest.x, chest.y, rarity.hp);
        this.hpBars.set(chest, hpBar);
    }

    collectChest = (
        object1: Phaser.GameObjects.GameObject,
        object2: Phaser.GameObjects.GameObject
    ) => {
        const chestSprite = object2 as Phaser.Physics.Arcade.Sprite;
        
        // Remove HP bar if it exists
        const hpBar = this.hpBars.get(chestSprite);
        if (hpBar) {
            hpBar.destroy();
            this.hpBars.delete(chestSprite);
        }

        // Get chest data
        const chestData = chestSprite.data?.get('rarity');
        if (!chestData) {
            console.error('No chest data found');
            chestSprite.destroy();
            this.spawnChest();
            return;
        }

        const rarity = chestData as ChestRarity;
        const chestX = chestSprite.x;
        const chestY = chestSprite.y;
        
        // Destroy the chest
        chestSprite.destroy();

        // Generate points based on rarity
        const pointAmount = Phaser.Math.Between(
            rarity.pointRange[0],
            rarity.pointRange[1]
        );
        
        // Spawn point orbs
        const numOrbs = Math.min(20, Math.floor(pointAmount / 5)); // 1 orb per 5 points, max 20
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

    private spawnPointOrb(x: number, y: number, amount: number) {
        const pointOrb = this.items.create(x, y, 'point_orb') as Phaser.Physics.Arcade.Sprite;
        pointOrb.setScale(0.5);
        pointOrb.setData('type', 'point');
        pointOrb.setData('amount', amount);
        
        // Enable physics on the sprite
        this.physics.world.enable(pointOrb);
        
        // Add initial velocity for a bouncy effect
        const angle = Math.random() * Math.PI * 2;
        const speed = 100;
        pointOrb.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Add some angular velocity for rotation
        pointOrb.setAngularVelocity(300);

        // Add a small bounce factor
        pointOrb.setBounce(0.6);

        // After 1 second, start moving towards the player
        this.time.delayedCall(500, () => {
            // Create a tween to move towards the player
            this.tweens.add({
                targets: pointOrb,
                x: this.player.x,
                y: this.player.y,
                duration: 500,
                ease: 'Cubic.easeIn',
                onComplete: () => {
                    if (pointOrb.active) {
                        // Play collection sound
                        this.sound.play("collectPointSound", {
                            volume: 0.1,
                        });
                        
                        // Add points
                        const pointAmount = pointOrb.getData('amount');
                        this.score += pointAmount;
                        this.scoreText.setText("Score: " + this.score);
                        
                        // Destroy the orb
                        pointOrb.destroy();
                    }
                }
            });
        });
    }
}