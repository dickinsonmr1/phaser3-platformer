export class PlayerOnServer {
    public x: number;  
    public y: number;
    public playerId: string;
    public flipX: boolean;
    
    constructor(x: number, y: number, playerId: string, flipX: boolean) {
      this.x = x;
      this.y = y;
      this.playerId = playerId;
      this.flipX = flipX;
    }
  }