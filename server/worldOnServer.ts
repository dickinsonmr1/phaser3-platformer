import { PlayerOnServer } from "./playerOnServer";
import { EnemyOnServer } from "./enemyOnServer";

export class WorldOnServer {
    public name: string;
    public players: Array<PlayerOnServer>;
    public enemies: Array<EnemyOnServer>;
    // bullets
    // spaceships
    // effects


    // animations

    movePlayer() {
        console.log("WorldOnServer.movePlayer()");
    }

    removeTile() {
        console.log("WorldOnServer.removeTile()");
    }
}