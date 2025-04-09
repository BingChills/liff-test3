import { Events } from 'phaser'

// A simple event bus to communicate between React and Phaser.
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Events.EventEmitter
export const EventBus = new Events.EventEmitter()
