"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BulletOnServer {
    constructor(bulletId, x, y, playerId, flipX, damage, velocityX, key) {
        this.bulletId = bulletId;
        this.x = x;
        this.y = y;
        this.playerId = playerId;
        this.flipX = flipX;
        this.damage = damage;
        this.velocityX = velocityX;
        this.key = key;
    }
}
exports.BulletOnServer = BulletOnServer;
