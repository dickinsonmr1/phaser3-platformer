/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */
import { Constants } from "./constants";

// TODO: fix and move implementation here once basic player functionality is working in main scene
export class Player extends Phaser.GameObjects.Sprite {
    public sprite: Phaser.Physics.Arcade.Sprite;
    public playerGun: any;//Phaser.Physics.Arcade.Image;
    private currentScene: Phaser.Scene;
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    //private anims: Phaser.Animations.AnimationManager;

    private moveKeyLeft: Phaser.Input.Keyboard.Key;
    private moveKeyRight: Phaser.Input.Keyboard.Key;
    private shootingKey: Phaser.Input.Keyboard.Key;
    private jumpingKey: Phaser.Input.Keyboard.Key;

    // game objects
    public bullets: Phaser.GameObjects.Group;
    public lastUsedBulletIndex: number;
    public bulletTime: number;
    
    private playerPrefixes = ['alienBeige', 'alienBlue', 'alienGreen', 'alienPink', 'alienYellow'];

    public hasBlueKey: boolean;
    public isInWater: boolean;
    public hurtTime: number;
    public health: number;

    public isTouchingSpring: boolean;
    public springTime: number;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        this.currentScene = params.scene;
        
        this.setFlipX(false);

        // physics
        this.width = 128;
        this.height = 256;
        
        this.currentScene.physics.world.enable(this);

        this.displayWidth = 64;
        this.displayHeight = 128;                   

        this.body.maxVelocity.x = 500;
        this.body.maxVelocity.y = 500;
        this.body
            .setSize(64, 128)
            .setOffset(Constants.playerOffsetX, Constants.playerOffsetY);    

        this.displayOriginX = 0.5;
        this.displayOriginY = 0.5;

        this.setScale(0.75, 0.75);

        this.currentScene.add.existing(this);
    
        this.hasBlueKey = false;
        this.isInWater = false;

        this.hurtTime = 0;
        this.health = 8;
        this.bulletTime = 0;
        this.lastUsedBulletIndex = 0;
        this.springTime = 0;

        this.playerGun = this.currentScene.add.sprite(Constants.playerOffsetX, Constants.playerOffsetY, 'playerGun')
        //.setOrigin(0.25, 0.5);
        //this.playerGun.setOrigin(0.5, 0.5);
        //this.bullets = this.currentScene.add.group();//{ classType: Bullet, runChildUpdate: true });
        this.bullets = this.currentScene.add.group();
        
        return;
        /*
        for (var i = 0; i < 20; i++) {
            var b = this.bullets.create(0, 0, 'playerGunBullet');
            this.currentScene.physics.world.enable(b);
            this.currentScene.add.existing(b);

            //b.name = 'bullet' + i;
            b.exists = false;
            b.visible = true;
            b.active = false;
            //b.checkWorldBounds = true;
            
            //b.setScale(2, 2);
            
        
            

            b.body.gravity.y = 0;
            //b.exists = true;
            //b.active = true;
            
            //b.checkWorldBounds = true;
            //b.onOutOfBounds
            //b.events = 
            //b.events.onOutOfBounds.add(this.currentScene.resetBullet, this);
        }
        //this.body.setCollideWorldBounds(true); // don't go out of the map
        this.lastUsedBulletIndex = 0;
        */
        
    }

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets;
    }

   

    private initImage(input: Phaser.Input.InputPlugin) {
        /*
        // variables
        this.health = 1;
        this.lastShoot = 0;
        this.speed = 100;

        // image
        this.setOrigin(0.5, 0.5);
        this.setDepth(0);
        this.angle = 180;

        this.barrel = this.currentScene.add.image(this.x, this.y, "barrelBlue");
        this.barrel.setOrigin(0.5, 1);
        this.barrel.setDepth(1);
        this.barrel.angle = 180;

        this.lifeBar = this.currentScene.add.graphics();
        this.redrawLifebar();

        // game objects
        this.bullets = this.currentScene.add.group({
        classType: Bullet,
        active: true,
        maxSize: 10,
        runChildUpdate: true
        });
        */
        // input
        this.cursors = input.keyboard.createCursorKeys();
        this.moveKeyLeft = this.currentScene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.A
        );
        this.moveKeyRight = input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.D
        );
        this.shootingKey = input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.CTRL
        );
        this.jumpingKey = input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        // physics
        //this.currentScene.physics.world.enable(this);
    }

    update(): void {

        /*
        this.bullets.getChildren().forEach(bullet => {
            bullet.body.gravityY = 0;
            //bullet.body.
        });
        */
        /*
        if (this.cursors.left.isDown) { // || keyboard.isDown(this.moveKeyLeft)) {  
            //this.sprite.setVelocity(-200); // move left
        }          
        */
        if(this.flipX) {
            this.playerGun.setFlipX(true);
            this.playerGun.setPosition(this.x + Constants.playerGunOffsetXFacingLeft, this.y + Constants.playerGunOffsetY);//.setOffset(32, 128);
        }       
        else {
            this.playerGun.setFlipX(false);
            this.playerGun.setPosition(this.x + Constants.playerGunOffsetXFacingRight, this.y + Constants.playerGunOffsetY);//.setOffset(32, 128);
        }        
    }
}