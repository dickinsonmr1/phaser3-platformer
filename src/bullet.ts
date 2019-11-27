// https://labs.phaser.io/edit.html?src=src\games\topdownShooter\topdown_combatMechanics.js
import "phaser";

export class Bullet extends Phaser.GameObjects.Sprite {

    public born: number;
    public speed: number;
    public direction: number;
    public xSpeed: number;
    public ySpeed: number;
    public currentScene: Phaser.Scene;

    constructor(params)
    {
        super(params.scene, params.x, params.y, params.key, params.frame);//, null);

        //Phaser.GameObjects.Image.call(this, params.scene, params.x, params.y, 'bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        //this.setSize(12, 12, true);

        this.currentScene = params.scene;
        this.currentScene.physics.world.enable(this);
        this.displayWidth = 16;
        this.displayHeight = 16;
    }

    // Fires a bullet from the player to the reticle
    public fire(x: number, y: number, isFacingRight: boolean)
    {       
        this.x = x;
        this.y = y;
        this.ySpeed = 0;
        this.xSpeed = isFacingRight ? 200 : 200;
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

    public kill(){
        this.kill();
    }
}