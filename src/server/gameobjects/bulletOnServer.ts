import {v4 as uuidv4} from 'uuid';

export class BulletOnServer {
    public x: number;  
    public y: number;
    public playerId: string;
    public flipX: boolean;
    public damage: number;
    public velocityX: number;
    public bulletId: uuidv4;
    public key: string;

    constructor(bulletId: uuidv4, x: number, y: number, playerId: string, flipX: boolean, damage: number, velocityX: number, key: string) {
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