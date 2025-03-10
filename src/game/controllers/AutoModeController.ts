import { Scene, GameObjects } from "phaser";
import { Player } from "../entities/Player";
import { ChestManager } from "../managers/ChestManager";

export class AutoModeController {
    private scene: Scene;
    private player: Player;
    private chestManager: ChestManager;
    private isAutoMode: boolean = false;
    private autoModeButton!: GameObjects.Container;
    private currentAttackTimer?: Phaser.Time.TimerEvent;
    
    constructor(scene: Scene, player: Player, chestManager: ChestManager) {
        this.scene = scene;
        this.player = player;
        this.chestManager = chestManager;
    }
    
    public createAutoModeButton(): void {
        // Create a container for the button
        this.autoModeButton = this.scene.add.container(320, 600);
        
        // Create background for the button
        const bg = this.scene.add.circle(0, 0, 25, 0x333333, 0.7);
        
        // Create text for the button
        const text = this.scene.add.text(0, 0, "AUTO", {
            fontSize: "12px",
            fontStyle: "bold",
            color: "#FFFFFF",
        }).setOrigin(0.5);
        
        // Add components to the container
        this.autoModeButton.add([bg, text]);
        
        // Make the button interactive
        bg.setInteractive({ useHandCursor: true });
        
        // Add click event
        bg.on('pointerdown', () => {
            this.toggleAutoMode();
        });
        
        // Make sure the button is on top of other game elements
        this.autoModeButton.setDepth(100);
    }
    
    public toggleAutoMode(): void {
        this.isAutoMode = !this.isAutoMode;
        
        // Update button appearance based on state
        const bg = this.autoModeButton.getAt(0) as GameObjects.Shape;
        
        if (this.isAutoMode) {
            bg.setFillStyle(0x00ff00, 0.7); // Green when active
            
            // If not already attacking a chest, find and attack the nearest one
            if (!this.player.isPlayerAttacking() && !this.player.isPlayerMoving()) {
                this.findAndAttackNearestChest();
            }
        } else {
            bg.setFillStyle(0x333333, 0.7); // Gray when inactive
            
            // Stop current attack if any
            if (this.currentAttackTimer) {
                this.currentAttackTimer.destroy();
                this.player.setIsAttacking(false);
            }
            
            // Stop movement
            if (this.player.isPlayerMoving()) {
                this.player.stopMovement();
            }
        }
    }
    
    public isInAutoMode(): boolean {
        return this.isAutoMode;
    }
    
    public update(): void {
        // Check if we need to find a new chest in auto mode
        if (this.isAutoMode && 
            !this.player.isPlayerAttacking() && 
            !this.player.isPlayerMoving()) {
            this.findAndAttackNearestChest();
        }
    }
    
    public findAndAttackNearestChest(): void {
        if (!this.isAutoMode) return;
        
        // Find the nearest chest
        const nearestChest = this.chestManager.getNearestChest();
        
        // If we found a chest, move to it and attack
        if (nearestChest) {
            // Store chest coordinates for reference
            const chestX = nearestChest.x;
            const chestY = nearestChest.y;
            
            // Stop any existing attack timer
            if (this.currentAttackTimer) {
                this.currentAttackTimer.destroy();
                this.currentAttackTimer = undefined;
            }
            
            // Move player toward the chest
            this.player.moveTowardObject(nearestChest, 35);
            
            // Attack when close enough
            this.currentAttackTimer = this.scene.time.addEvent({
                delay: 500, // Check more frequently
                callback: () => {
                    // Safety check - if auto mode is turned off, stop the timer
                    if (!this.isAutoMode) {
                        if (this.currentAttackTimer) {
                            this.currentAttackTimer.destroy();
                            this.currentAttackTimer = undefined;
                        }
                        this.player.setIsAttacking(false);
                        if (!this.player.isPlayerMoving()) {
                            this.player.getSprite().play("ninjaTurtle_idle", true);
                        }
                        return;
                    }
                    
                    // Find the chest by position
                    const currentChest = this.chestManager.findActiveChestAt(chestX, chestY);
                    
                    // If chest is not found or no longer active, find the next one
                    if (!currentChest) {
                        if (this.currentAttackTimer) {
                            this.currentAttackTimer.destroy();
                            this.currentAttackTimer = undefined;
                        }
                        
                        this.player.setIsAttacking(false);
                        
                        // If auto mode is still on, find the next chest
                        if (this.isAutoMode) {
                            this.scene.time.delayedCall(300, () => {
                                this.findAndAttackNearestChest();
                            });
                        } else if (!this.player.isPlayerMoving()) {
                            this.player.getSprite().play("ninjaTurtle_idle", true);
                        }
                        return;
                    }
                    
                    const currentDistance = Phaser.Math.Distance.Between(
                        this.player.getSprite().x,
                        this.player.getSprite().y,
                        currentChest.x,
                        currentChest.y
                    );
                    
                    if (currentDistance < 50) {
                        // We're close enough to attack
                        this.player.setIsAttacking(true);
                        this.player.setIsMoving(false);
                        this.player.getSprite().setVelocity(0, 0);
                        this.chestManager.attackChest(currentChest);
                    }
                },
                loop: true,
                paused: false
            });
        } else {
            // No valid chest found, try again after a short delay
            this.scene.time.delayedCall(1000, () => {
                if (this.isAutoMode) {
                    this.findAndAttackNearestChest();
                }
            });
        }
    }
}
