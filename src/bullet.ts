// https://labs.phaser.io/edit.html?src=src\games\topdownShooter\topdown_combatMechanics.js
import "phaser";

export class Bullet extends Phaser.GameObjects.Image {
    public born: number;
    public speed: number;
    public direction: number;
    public xSpeed: number;
    public ySpeed: number;

    constructor(params)
    {
        super(params.scene, params.x, params.y, params.texture, null);

        Phaser.GameObjects.Image.call(this, params.scene, 0, 0, 'bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        //this.setSize(12, 12, true);
    }

    // Fires a bullet from the player to the reticle
    public fire(x: number, y: number, isFacingRight: boolean)
    {       
        this.born = 0; // Time since new bullet spawned
    }

    // Updates the position of the bullet each cycle
    public update(time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }   
}