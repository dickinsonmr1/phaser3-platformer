// https://labs.phaser.io/edit.html?src=src\games\topdownShooter\topdown_combatMechanics.js
import "phaser";
import { Scene } from "phaser";
import { Constants } from "../client/constants";
import { MainScene } from "../client/scenes/mainScene";
import { Socket } from "socket.io-client";
import {v4 as uuidv4} from 'uuid';

export class Bullet extends Phaser.GameObjects.Sprite {

    public damage: number;
    public velocityX: number;
    public bulletId: uuidv4;

    constructor(params)
    {
        super(params.scene, params.x, params.y, params.key);

        this.bulletId = uuidv4();

        this.scene.add.existing(this);
               
        this.flipX = params.flipX;
        this.damage = params.damage;       
        this.velocityX = params.velocityX;

        this.scene.physics.world.enable(this);
       
        this.setAlpha(1.0);
        this.setDepth(1);//Constants.depthBullets);
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
        
        /*
        console.log('bulletMovement');

        var socket = this.getSocket();        
        if(socket != null) {
            // sends back to server
            socket.emit('bulletMovement', {bulletId: this.bulletId, x: this.x, y: this.y, velocityX: this.velocityX});                
        }
        */
    }
    getSocket(): Socket {
        let scene = <MainScene>this.scene;            
        return scene.sceneController.socketClient.socket;
    }
}

