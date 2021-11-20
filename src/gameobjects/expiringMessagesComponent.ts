/**
 * @author       Mark Dickinson
 * @copyright    2020 Mark Dickinson
 * @license      none
 */

/// <reference path="../../node_modules/phaser/types/phaser.d.ts"/>
//import { BodyFactory } from "matter";
import "phaser";
import { Constants } from "../client/constants";
import { MainScene } from "../client/scenes/mainScene";

import { ExpiringText } from "./expiringText";

export class ExpiringMessagesComponent {
    expiringMessagesGroup: Array<ExpiringText>;
    //expiringMessagesGroup: Phaser.GameObjects.Group;
    expiringMessagesNextIndex: number;
    scene: MainScene;

    constructor(scene: MainScene){
        this.scene = scene;
        //super(params.scene, params.x, params.y)
        this.expiringMessagesGroup = new Array<ExpiringText>();
        /*
        this.expiringMessagesGroup = scene.physics.add.group({
            allowGravity: false
        });
        this.expiringMessagesGroup.setDepth(Constants.depthExpiringMessages);
        */
    }

    init(): void {
        //this.expiringMessagesGroup = new Array<ExpiringText>();
        for(var i = 0; i < 10; i++) {
            this.expiringMessagesGroup.push(new ExpiringText({scene: this.scene, x: 0, y: 0, text: "test" }));            
        }
        this.expiringMessagesNextIndex = 0;
    }
    
    emitExpiringText(x: number, y: number, text: string, ) {    
                
        var message = <ExpiringText>this.expiringMessagesGroup[this.expiringMessagesNextIndex];
        message.init(x, y, text, 1000);   
        
        if(++this.expiringMessagesNextIndex >= this.expiringMessagesGroup.length)
            this.expiringMessagesNextIndex = 0;
        /*
        this.hudComponent.expiringMessagesGroup.getChildren().forEach(messageInGroup => {
            
            var message = <ExpiringText> messageInGroup;
            message.init(x, y, 1000);
            /*var message = <Phaser.GameObjects.Text> x;
            message.setAlpha(message.alpha);
            
            //var body = <Phaser.Physics.Arcade.Body>message.body;

            //body.setVelocity(0, -200);
            message.alpha -= 0.02;

            if(message.alpha <= 0)
                message.destroy();

        });
        */
        /*
        var expiringText = new ExpiringText({
            scene: this,
            x: x,
            y: y,
            text: text
            });       
            
            expiringText.init(1000);
        this
        .hudComponent.expiringMessagesGroup.add(expiringText);
        */
    }
    
    update(): void {
        this.expiringMessagesGroup.forEach(x => {

            x.update();
            /*var message = <Phaser.GameObjects.Text> x;
            message.setAlpha(message.alpha);
            
            //var body = <Phaser.Physics.Arcade.Body>message.body;

            //body.setVelocity(0, -200);
            message.alpha -= 0.02;

            if(message.alpha <= 0)
                message.destroy();
            */
        });
    }
}