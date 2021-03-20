/**
 * @author       Mark Dickinson
 * @copyright    2020 Mark Dickinson
 * @license      none
 */

 
 /// <reference path="../../dts/phaser.d.ts"/>
 import { Constants } from "../constants";
 import "phaser";
 import { Scene } from "phaser";
import { HealthBar } from "../scenes/healthBar";
 
 export class Spaceship extends Phaser.GameObjects.Sprite {
     public activated: boolean;
 
     private unmannedAnim: string;
     private mannedAnim: string;

     public transitionTime: number;
     public idleTime: number;

     public weaponTime: number;
     public currentlyFiring: boolean;

     public get maxHealth(): number {return 100;}
     public healthBar: HealthBar;
     public currentHealth;

     private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
     private get emitterOffsetY(): number {return 30;}

     private get healthBarOffsetX(): number {return -55;}
     private get healthBarOffsetY(): number {return -75;}
     private get laserBeam0ffsetX(): number {return -0;}
     private get laserBeamOffsetY(): number {return 10;}
     private get laserBeamPerFrameY(): number {return 20;}
     private get laserBeamMaxHeight(): number {return 300;}

     public static get spaceshipVelocity(): number { return 600; }   
     
     laserBeam: Phaser.GameObjects.Sprite

     constructor(params) {
         super(params.scene, params.x, params.y, params.key); 
     } 
     
     public getScene(): Scene {
         return this.scene;
     }
 
     public init(unmannedAnim: string, mannedAnim: string): void {
         
        this.unmannedAnim = unmannedAnim;
        this.mannedAnim = mannedAnim;

        this.width = 124;
        this.height = 90;

        //this.displayWidth = 93;
        //this.displayHeight = 68;

 
        this.scene.physics.world.enable(this, 0);   

        var body = <Phaser.Physics.Arcade.Body>this.body;

        //body.setSize(93, 68);     
        body.setSize(124, 90);     
        body.moves = false;
        body.allowGravity = true;
        
        this.setScale(0.75, 0.75);

        this.scene.add.existing(this);
            
        this.activated = false;
        this.transitionTime = 0;
        this.anims.play(this.unmannedAnim, true);

        this.laserBeam = this.scene.add.sprite(this.x + this.laserBeam0ffsetX, this.y + this.laserBeamOffsetY, "alienShipLaserSprites", "laserBlue2.png");
        this.laserBeam.setDepth(Constants.depthBullets);
        //this.laserBeam.alpha = 0.6;
        this.laserBeam.setAlpha(1, 1, 0, 0)        
        this.laserBeam.setOrigin(0.5, 0);
        this.laserBeam.setDisplayOrigin(0.5, 0);
        //this.laserBeam.setScale(1, 2);
        this.scene.add.existing(this.laserBeam);
        this.scene.physics.world.enable(this.laserBeam);
        var laserBeamBody = <Phaser.Physics.Arcade.Body>this.laserBeam.body;
        laserBeamBody.allowGravity = false;

        var particles = this.scene.add.particles('engineExhaust');
        particles.setDepth(Constants.depthParticles);

        this.particleEmitter = particles.createEmitter({
            x: this.x,
            y: this.y,
            lifespan: 500,
            speed: { min: 400, max: 400 },
            angle: 90,
            gravityY: 300,
            scaleX: { start: 1, end: 2 },
            scaleY: 0.5,
            quantity: 1,
            blendMode: 'ADD',
            frequency: 100,
            alpha: {start: 0.8, end: 0.0}
            //active: false
        });
        this.particleEmitter.stop();
        //this.turnOff();
        
        this.currentHealth = this.maxHealth;
        this.healthBar = new HealthBar(this.getScene());

        this.healthBar.init(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY,
            this.maxHealth, 
            100, 15);
        this.healthBar.setDepth(Constants.depthHealthBar);

        this.healthBar.hide();
        this.laserBeam.setVisible(false);
        //this.laserBeam.setVisible(false);

        this.idleTime = 0;
        this.weaponTime = 0;
        return;        
     }

    /*
    toggle() {
        if(this.transitionTime == 0) {
            this.scene.sound.play("switchSound");
            if(this.activated) {
                this.turnOff();
                return;
            }
            else {
                this.turnOn();
            }
        }
    }
    */

    getPhysicsBody(): Phaser.Physics.Arcade.Body {
        return <Phaser.Physics.Arcade.Body>this.body;
    }

    turnOff(): void {  

        if(this.activated) {
            this.anims.play(this.unmannedAnim, true);

            this.particleEmitter.stop();
            
            // TODO: fix exception for stopByKey() if sound is disabled
            this.scene.sound.stopByKey('engineSound')

            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.moves = true;
            body.allowGravity = false;
            
            body.setVelocity(0, 0);

            this.activated = false;
            this.transitionTime = 60;
            
            this.healthBar.hide();
            this.laserBeam.setVisible(false);
        }        
    }
      
    turnOn(): void {
        if(!this.activated  && this.transitionTime == 0) {
            
            this.anims.play(this.mannedAnim, true);
            this.activated = true;
            this.scene.sound.play('engineSound', { volume: 0.25, loop: true });

            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.moves = true;
            body.allowGravity = false;

            this.particleEmitter.start();
            this.particleEmitter.setPosition(this.x, this.y + this.emitterOffsetY);

            this.healthBar.show();
            this.laserBeam.setVisible(true);
        }
        
        //this.transitionTime = 5;
    }

    tryIdle() {

    }

    tryDamage(damage: number) {
        this.currentHealth -= damage;
        this.healthBar.updateHealth(this.currentHealth);
    }

    tryFireWeapon() {
        if(this.weaponTime == 0)
            this.scene.sound.play('spaceshipLaserBeamSound', {volume: 0.5});
        
        this.currentlyFiring = true;

        if(this.weaponTime < this.laserBeamMaxHeight)
            this.weaponTime += this.laserBeamPerFrameY;  
        else {
            //this.scene.sound.stopByKey('spaceshipLaserBeamSound');
        }      
    }

    preUpdate(time, delta): void {
        super.preUpdate(time, delta);
        
        if(!this.activated ||
            (this.getPhysicsBody().velocity.x == 0 && this.getPhysicsBody().velocity.y == 0)) {
            ++this.idleTime;

            if(this.idleTime < 60)
                this.y += 0.25;
            else if (this.idleTime >= 60 && this.idleTime < 120)
                this.y -= 0.25;
            else if (this.idleTime >= 120)
                this.idleTime = 0;
        }

        this.particleEmitter.setPosition(this.x, this.y + this.emitterOffsetY);

        this.healthBar.updatePosition(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY);
                
        this.laserBeam.setScale(this.weaponTime / this.laserBeamMaxHeight, 1);
        this.laserBeam.displayHeight = this.weaponTime;
        this.laserBeam.height = this.weaponTime;        
        this.laserBeam.setPosition(this.x + this.laserBeam0ffsetX, this.y + this.laserBeamOffsetY);
        this.laserBeam.setOrigin(0.5, 0);
        //this.laserBeam.setDisplayOrigin(0.5, 0);

        if(!this.currentlyFiring && this.weaponTime > 0) {
            this.weaponTime -= this.laserBeamPerFrameY;
            this.laserBeam.height = this.weaponTime;
            this.laserBeam.displayHeight = this.weaponTime;

             this.scene.sound.stopByKey('spaceshipLaserBeamSound');
        }


        this.currentlyFiring = false;

        if(this.transitionTime > 0)
            this.transitionTime--;
    }
}