export class PlayerOnServer {
    public x: number;  
    public y: number;
    public playerId: string;
    public flipX: boolean;
    public animKey: string;
    
    constructor(x: number, y: number, playerId: string, flipX: boolean, animKey: string) {
      this.x = x;
      this.y = y;
      this.playerId = playerId;
      this.flipX = flipX;
      this.animKey = animKey;
    }
  }