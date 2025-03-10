import { GameObjects, Physics, Scene } from "phaser";

export class Player {
    private scene: Scene;
    private sprite: Physics.Arcade.Sprite;
    private targetX: number = 0;
    private targetY: number = 0;
    private isMoving: boolean = false;
    private isAttacking: boolean = false;
    private attackDamage: number = 10;

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        
        // Create player sprite
        this.sprite = scene.physics.add
            .sprite(x, y, "ninjaTurtle_idle")
            .setScale(1);
            
        // Set smaller collision box for player
        this.sprite.setSize(this.sprite.width * 0.5, this.sprite.height * 0.5);
        this.sprite.setOffset(this.sprite.width * 0.25, this.sprite.height * 0.25);
        
        // Configure physics
        this.sprite.setCollideWorldBounds(true);
        
        // Play idle animation by default
        this.sprite.play("ninjaTurtle_idle");
    }

    public getSprite(): Physics.Arcade.Sprite {
        return this.sprite;
    }

    public isPlayerMoving(): boolean {
        return this.isMoving;
    }

    public isPlayerAttacking(): boolean {
        return this.isAttacking;
    }

    public setIsMoving(isMoving: boolean): void {
        this.isMoving = isMoving;
    }

    public setIsAttacking(isAttacking: boolean): void {
        this.isAttacking = isAttacking;
    }

    public getAttackDamage(): number {
        return this.attackDamage;
    }

    public getTargetPosition(): { x: number, y: number } {
        return { x: this.targetX, y: this.targetY };
    }

    public createAnimations(): void {
        // Create player animations if they don't exist
        if (!this.scene.anims.exists('ninjaTurtle_walk')) {
            this.scene.anims.create({
                key: "ninjaTurtle_walk",
                frames: this.scene.anims.generateFrameNumbers("ninjaTurtle_walk", {
                    start: 0,
                    end: 3,
                }),
                frameRate: 10,
                repeat: -1,
            });
        }

        if (!this.scene.anims.exists('ninjaTurtle_idle')) {
            this.scene.anims.create({
                key: "ninjaTurtle_idle",
                frames: this.scene.anims.generateFrameNumbers("ninjaTurtle_idle", {
                    start: 0,
                    end: 3,
                }),
                frameRate: 4,
                repeat: -1,
            });
        }
    }

    public moveToPosition(x: number, y: number, speed: number = 150): void {
        // Clamp position to world bounds
        this.targetX = Phaser.Math.Clamp(x, 32, 328);
        this.targetY = Phaser.Math.Clamp(y, 32, 608);
        
        this.isMoving = true;
        this.scene.physics.moveTo(this.sprite, this.targetX, this.targetY, speed);
        
        // Play walking animation
        this.sprite.play("ninjaTurtle_walk", true);
        
        // Flip sprite based on movement direction
        if (x < this.sprite.x) {
            this.sprite.setFlipX(true);
        } else {
            this.sprite.setFlipX(false);
        }
    }

    public moveTowardObject(object: Physics.Arcade.Sprite, distance: number, speed: number = 150): void {
        // Calculate angle between player and object
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, 
            this.sprite.y, 
            object.x, 
            object.y
        );
        
        // Calculate position near the object
        this.targetX = object.x - Math.cos(angle) * distance;
        this.targetY = object.y - Math.sin(angle) * distance;
        
        // Clamp the target position to world bounds
        this.targetX = Phaser.Math.Clamp(this.targetX, 32, 328);
        this.targetY = Phaser.Math.Clamp(this.targetY, 32, 608);
        
        this.isMoving = true;
        this.scene.physics.moveTo(this.sprite, this.targetX, this.targetY, speed);
        
        // Play walking animation
        this.sprite.play("ninjaTurtle_walk", true);
        
        // Flip sprite based on movement direction
        if (object.x < this.sprite.x) {
            this.sprite.setFlipX(true);
        } else {
            this.sprite.setFlipX(false);
        }
    }

    public stopMovement(): void {
        this.sprite.setVelocity(0, 0);
        this.isMoving = false;
        
        if (!this.isAttacking) {
            this.sprite.play("ninjaTurtle_idle", true);
        }
    }

    public update(): void {
        // Check if we're close to target position
        if (this.isMoving) {
            const distance = Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                this.targetX,
                this.targetY
            );
            
            if (distance < 5) {
                this.stopMovement();
            }
        }
    }
}
