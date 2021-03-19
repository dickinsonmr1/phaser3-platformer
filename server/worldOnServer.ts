import { PlayerOnServer } from "./playerOnServer";
import { EnemyOnServer } from "./enemyOnServer";
import { BulletOnServer } from "./bulletOnServer";

export class WorldOnServer {
    public name: string;
    public players: Array<PlayerOnServer>;
    public enemies: Array<EnemyOnServer>;
    public bullets: Array<BulletOnServer>;
    
    // spaceships
    // effects
    // animations

    constructor() {
        this.players = new Array<PlayerOnServer>();
        this.enemies = new Array<EnemyOnServer>();
        this.bullets = new Array<BulletOnServer>();
    }

    movePlayer() {
        console.log("WorldOnServer.movePlayer()");
    }

    removeTile() {
        console.log("WorldOnServer.removeTile()");
    }
}