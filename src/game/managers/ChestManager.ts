import { GameObjects, Physics, Scene } from "phaser";
import { ChestRarity, Coupon, GameConfig } from "../types/GameTypes";
import { Player } from "../entities/Player";

export class ChestManager {
    private scene: Scene;
    private chests: Physics.Arcade.Group;
    private hpBars: Map<Physics.Arcade.Sprite, GameObjects.Container> = new Map();
    private player: Player;
    private eventBus: Phaser.Events.EventEmitter;
    private score: number = 0;
    private onScoreUpdate: (score: number) => void;
    private coupons: Coupon[];

    // Chest rarity configuration
    private chestRarities: ChestRarity[] = [
        { type: 'common', pointRange: [10, 50], couponDropChance: 0.1, hp: 30 },
        { type: 'rare', pointRange: [50, 150], couponDropChance: 0.25, hp: 60 },
        { type: 'epic', pointRange: [150, 300], couponDropChance: 0.5, hp: 100 },
        { type: 'legendary', pointRange: [300, 500], couponDropChance: 0.75, hp: 150 }
    ];

    constructor(scene: Scene, player: Player, config: GameConfig, coupons: Coupon[], onScoreUpdate: (score: number) => void) {
        this.scene = scene;
        this.player = player;
        this.eventBus = config.eventBus;
        this.coupons = coupons;
        this.onScoreUpdate = onScoreUpdate;

        // Create a group for chests with collision
        this.chests = scene.physics.add.group({
            collideWorldBounds: true,
            immovable: true
        });
    }

    public setupColliders(): void {
        // Enable collision between player and chests
        this.scene.physics.add.collider(
            this.player.getSprite(),
            this.chests,
            this.handleCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
    }

    private handleCollision(
        playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
        chestObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
    ): void {
        // When collision occurs, check if player is attacking this chest
        if (this.player.isPlayerMoving()) {
            this.player.setIsMoving(false);
            const playerSprite = playerObj as Physics.Arcade.Sprite;
            playerSprite.setVelocity(0, 0);
            
            // Start attacking if this is the chest we clicked
            const clickedChest = chestObj as Physics.Arcade.Sprite;
            const distance = Phaser.Math.Distance.Between(
                playerSprite.x,
                playerSprite.y,
                clickedChest.x,
                clickedChest.y
            );
            if (distance < 50) {
                this.player.setIsAttacking(true);
                this.attackChest(clickedChest);
            }
        }
    }

    public getChests(): Physics.Arcade.Group {
        return this.chests;
    }

    public getNearestChest(): Physics.Arcade.Sprite | null {
        // Get all active chests
        const chestSprites = this.chests.getChildren();
        if (chestSprites.length === 0) return null;
        
        // Find the nearest chest
        let nearestChest: Physics.Arcade.Sprite | null = null;
        let shortestDistance = Number.MAX_VALUE;
        const playerSprite = this.player.getSprite();
        
        for (let i = 0; i < chestSprites.length; i++) {
            const chestSprite = chestSprites[i] as Physics.Arcade.Sprite;
            
            // Skip inactive chests
            if (!chestSprite || !(chestSprite as any).active) continue;
            
            const distance = Phaser.Math.Distance.Between(
                playerSprite.x,
                playerSprite.y,
                chestSprite.x,
                chestSprite.y
            );
            
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestChest = chestSprite;
            }
        }
        
        return nearestChest;
    }

    public findActiveChestAt(x: number, y: number, tolerance: number = 5): Physics.Arcade.Sprite | null {
        const chestSprites = this.chests.getChildren();
        
        for (let i = 0; i < chestSprites.length; i++) {
            const chest = chestSprites[i] as Physics.Arcade.Sprite;
            
            if (!chest || !(chest as any).active) continue;
            
            // Check if chest is close to the specified position
            const distance = Phaser.Math.Distance.Between(x, y, chest.x, chest.y);
            if (distance <= tolerance) {
                return chest;
            }
        }
        
        return null;
    }

    public spawnInitialChests(count: number): void {
        for (let i = 0; i < count; i++) {
            this.spawnChest();
        }
    }

    public spawnChest(): void {
        const rarity = this.getRandomChestRarity();
        if (!rarity) {
            console.error('Failed to get chest rarity');
            return;
        }

        const chest = this.chests.create(
            Phaser.Math.Between(40, 320), // 360 - 40
            Phaser.Math.Between(40, 600), // 640 - 40
            `chest_${rarity.type}`
        ) as Physics.Arcade.Sprite;
        
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

    private getRandomChestRarity(): ChestRarity {
        const rand = Math.random();
        if (rand < 0.6) return this.chestRarities[0]; // 60% common
        if (rand < 0.85) return this.chestRarities[1]; // 25% rare
        if (rand < 0.95) return this.chestRarities[2]; // 10% epic
        return this.chestRarities[3]; // 5% legendary
    }

    private createHPBar(x: number, y: number, maxHP: number): GameObjects.Container {
        // Create container for HP bar
        const hpBar = this.scene.add.container(x, y - 20);

        // Background bar (gray)
        const bgBar = this.scene.add.rectangle(0, 0, 32, 5, 0x808080);
        
        // Health bar (green)
        const bar = this.scene.add.rectangle(0, 0, 32, 5, 0x00ff00);
        
        // Add both bars to container
        hpBar.add([bgBar, bar]);
        
        // Initially hide the HP bar
        hpBar.setVisible(false);
        
        return hpBar;
    }

    public attackChest(chest: Physics.Arcade.Sprite): void {
        const currentHP = chest.getData('currentHP');
        const maxHP = chest.getData('maxHP');
        
        if (currentHP <= 0) return;

        // Reduce HP by player's attack damage
        const newHP = currentHP - this.player.getAttackDamage();
        chest.setData('currentHP', newHP);

        // Flash effect
        this.scene.tweens.add({
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
            const bar = hpBar.getAt(1) as GameObjects.Rectangle;
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
            this.collectChest(chest);
        }
    }

    private collectChest(chestSprite: Physics.Arcade.Sprite): void {
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
    }

    private spawnPointOrb(x: number, y: number, amount: number): void {
        // Create a separate method or use an ItemManager for this
        const items = this.scene.physics.add.group();
        const pointOrb = items.create(x, y, 'point_orb') as Physics.Arcade.Sprite;
        pointOrb.setScale(0.5);
        pointOrb.setData('type', 'point');
        pointOrb.setData('amount', amount);
        
        // Enable physics on the sprite
        this.scene.physics.world.enable(pointOrb);
        
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
        this.scene.time.delayedCall(500, () => {
            const playerSprite = this.player.getSprite();
            // Create a tween to move towards the player
            this.scene.tweens.add({
                targets: pointOrb,
                x: playerSprite.x,
                y: playerSprite.y,
                duration: 500,
                ease: 'Cubic.easeIn',
                onComplete: () => {
                    if (pointOrb.active) {
                        // Play collection sound
                        this.scene.sound.play("collectPointSound", {
                            volume: 0.1,
                        });
                        
                        // Add points
                        const pointAmount = pointOrb.getData('amount');
                        this.score += pointAmount;
                        
                        // Update score via callback
                        this.onScoreUpdate(this.score);
                        
                        // Destroy the orb
                        pointOrb.destroy();
                    }
                }
            });
        });
    }
}
