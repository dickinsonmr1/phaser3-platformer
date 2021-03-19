export class BulletOnServer {
    public x: number;  
    public y: number;
    public playerId: string;
    public flipX: boolean;
    public damage: number;
    public velocityX: number;
    
    constructor(x: number, y: number, playerId: string, flipX: boolean, damage: number, velocityX: number) {
      this.x = x;
      this.y = y;
      this.playerId = playerId;
      this.flipX = flipX;
      this.damage = damage;
      this.velocityX = velocityX;
    }
}