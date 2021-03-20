// https://labs.phaser.io/edit.html?src=src\games\topdownShooter\topdown_combatMechanics.js
import "phaser";
import { Scene } from "phaser";
import { Constants } from "../constants";

export class Bullet extends Phaser.GameObjects.Sprite {

    public damage: number;
    public velocityX: number;

    constructor(params)
    {
        super(params.scene, params.x, params.y, params.key);

        this.scene.add.existing(this);
               
        this.flipX = params.flipX;
        this.damage = params.damage;       
        this.velocityX = params.velocityX;

        this.scene.physics.world.enable(this);
       
        this.setAlpha(1.0);
        this.setDepth(Constants.depthBullets);
    }

    public getScene(): Scene {
        return this.scene;
    }

    public init()
    {       
       
    }

    preUpdate(time, delta): void {
        super.preUpdate(time, delta);

        var body = <Phaser.Physics.Arcade.Body>this.body;

        body.setVelocityX(this.velocityX);
        body.setVelocityY(0);
    }
}