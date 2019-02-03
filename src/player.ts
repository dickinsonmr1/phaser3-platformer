/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */
import { Constants } from "./constants";

// TODO: fix and move implementation here once basic player functionality is working in main scene
export class Player extends Phaser.GameObjects.Sprite {
    public sprite: Phaser.Physics.Arcade.Sprite;
    private currentScene: Phaser.Scene;
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    //private anims: Phaser.Animations.AnimationManager;

    private moveKeyLeft: Phaser.Input.Keyboard.Key;
    private moveKeyRight: Phaser.Input.Keyboard.Key;
    private shootingKey: Phaser.Input.Keyboard.Key;
    private jumpingKey: Phaser.Input.Keyboard.Key;

    // game objects
    private bullets: Phaser.GameObjects.Group;
    private playerPrefixes = ['alienBeige', 'alienBlue', 'alienGreen', 'alienPink', 'alienYellow'];

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        this.currentScene = params.scene;
        
        this.setFlipX(false);

    
        // physics
        this.currentScene.physics.world.enable(this);

        
        this.width = 128;
        this.height = 256;
        this.displayOriginX = 0.5;
        this.displayOriginY = 0.5;
        this.displayWidth = 128;
        this.displayHeight = 256;
        
        this.body.maxVelocity.x = 500;
        this.body.maxVelocity.y = 500;
        this.body.setSize(128, 256);

        this.currentScene.add.existing(this);

        this.setScale(0.75, 0.75);
        this.body.setCollideWorldBounds(true); // don't go out of the map
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
        if (this.cursors.left.isDown) { // || keyboard.isDown(this.moveKeyLeft)) {  
            this.sprite.setVelocity(-200); // move left
        }          
    }
}