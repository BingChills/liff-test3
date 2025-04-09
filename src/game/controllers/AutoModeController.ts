import { Scene, GameObjects } from 'phaser';
import { Player } from '../entities/Player';
import { ChestManager } from '../managers/ChestManager';

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
        // Create a container for the button - position it higher in the right side
        this.autoModeButton = this.scene.add.container(
            this.scene.cameras.main.width - 70,
            this.scene.cameras.main.height - 120 // Moved up from -50 to -120
        );

        // Create a rounded rectangle background (pill shape) for the button
        const bgWidth = 80;
        const bgHeight = 36;
        const radius = bgHeight / 2;
        const bgColor = this.isAutoMode ? 0x4ade80 : 0x374151; // Green when active, gray when inactive (matching PageHeader)

        // Create a rounded rectangle with shadow
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.2); // Shadow
        bg.fillRoundedRect(-bgWidth / 2 + 2, -bgHeight / 2 + 2, bgWidth, bgHeight, radius);
        bg.fillStyle(bgColor, 1);
        bg.fillRoundedRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, radius);

        // Create an icon circle for the button (similar to the resource icons in PageHeader)
        const iconCircle = this.scene.add.graphics();
        iconCircle.fillStyle(0xffffff, 0.9);
        iconCircle.fillCircle(-bgWidth / 2 + radius, 0, 12); // Position circle on the left side

        // Create an icon for the auto mode (using a play symbol)
        const icon = this.scene.add.graphics();
        icon.fillStyle(this.isAutoMode ? 0x374151 : 0x4ade80, 1); // Dark when inactive, green when active
        // Draw a play triangle icon
        icon.fillTriangle(
            -bgWidth / 2 + radius - 3,
            -5, // Top point
            -bgWidth / 2 + radius - 3,
            5, // Bottom point
            -bgWidth / 2 + radius + 5,
            0 // Right point
        );

        // Create text for the button
        const text = this.scene.add
            .text(2, 0, 'AUTO', {
                fontSize: '13px',
                fontFamily: 'Arial, sans-serif',
                fontStyle: 'bold',
                color: '#FFFFFF',
            })
            .setOrigin(0, 0.5); // Left-aligned text

        // Add components to the container
        this.autoModeButton.add([bg, iconCircle, icon, text]);

        // Create interactive area for the entire button
        const hitArea = new Phaser.Geom.Rectangle(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight);
        this.autoModeButton.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        // Add hover effects
        this.autoModeButton.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0x000000, 0.25); // Darker shadow on hover
            bg.fillRoundedRect(-bgWidth / 2 + 2, -bgHeight / 2 + 2, bgWidth, bgHeight, radius);
            bg.fillStyle(this.isAutoMode ? 0x3ecd6d : 0x2c3440, 1); // Slightly darker on hover
            bg.fillRoundedRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, radius);
        });

        this.autoModeButton.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0x000000, 0.2); // Normal shadow
            bg.fillRoundedRect(-bgWidth / 2 + 2, -bgHeight / 2 + 2, bgWidth, bgHeight, radius);
            bg.fillStyle(this.isAutoMode ? 0x4ade80 : 0x374151, 1); // Normal colors
            bg.fillRoundedRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, radius);
        });

        // Add click event
        this.autoModeButton.on('pointerdown', () => {
            this.toggleAutoMode();
        });

        // Make sure the button is on top of other game elements
        this.autoModeButton.setDepth(100);
    }

    public toggleAutoMode(): void {
        this.isAutoMode = !this.isAutoMode;

        // Update button appearance based on state
        this.updateButtonAppearance();

        if (this.isAutoMode) {
            console.log('Auto mode activated');

            // If not already attacking a chest, find and attack the nearest one
            if (!this.player.isPlayerAttacking() && !this.player.isPlayerMoving()) {
                this.findAndAttackNearestChest();
            }
        } else {
            console.log('Auto mode deactivated');

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

    private updateButtonAppearance(): void {
        if (!this.autoModeButton) return;

        // Get the background and icon components
        const bg = this.autoModeButton.getAt(0) as Phaser.GameObjects.Graphics;
        const iconCircle = this.autoModeButton.getAt(1) as Phaser.GameObjects.Graphics;
        const icon = this.autoModeButton.getAt(2) as Phaser.GameObjects.Graphics;

        // Get dimensions for consistent drawing
        const bgWidth = 80;
        const bgHeight = 36;
        const radius = bgHeight / 2;

        // Update background color based on state
        bg.clear();
        bg.fillStyle(0x000000, 0.2); // Shadow
        bg.fillRoundedRect(-bgWidth / 2 + 2, -bgHeight / 2 + 2, bgWidth, bgHeight, radius);
        bg.fillStyle(this.isAutoMode ? 0x4ade80 : 0x374151, 1); // Green when active, gray when inactive
        bg.fillRoundedRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, radius);

        // Update icon color based on state
        icon.clear();
        icon.fillStyle(this.isAutoMode ? 0x374151 : 0x4ade80, 1); // Dark when active, green when inactive
        // Redraw the triangle icon
        icon.fillTriangle(
            -bgWidth / 2 + radius - 3,
            -5, // Top point
            -bgWidth / 2 + radius - 3,
            5, // Bottom point
            -bgWidth / 2 + radius + 5,
            0 // Right point
        );
    }

    public isInAutoMode(): boolean {
        return this.isAutoMode;
    }

    public update(): void {
        // Check if we need to find a new chest in auto mode
        if (this.isAutoMode && !this.player.isPlayerAttacking() && !this.player.isPlayerMoving()) {
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
                            this.player.getSprite().play('ninjaTurtle_idle', true);
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
                            this.player.getSprite().play('ninjaTurtle_idle', true);
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
                paused: false,
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
