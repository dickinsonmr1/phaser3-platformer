"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BulletOnServer {
    constructor(bulletId, x, y, playerId, flipX, damage, velocityX) {
        this.bulletId = bulletId;
        this.x = x;
        this.y = y;
        this.playerId = playerId;
        this.flipX = flipX;
        this.damage = damage;
        this.velocityX = velocityX;
    }
}
exports.BulletOnServer = BulletOnServer;
