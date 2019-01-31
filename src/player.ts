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
        //this.initSprite();
        
        //this.setAlpha(0.5);
        //this.body.setOffset(4, 0);

        this.initSprite();
        this.currentScene.add.existing(this);
        
    //constructor(physics: Phaser.Physics.Arcade.ArcadePhysics,
        //input: Phaser.Input.InputPlugin,
        //anims: Phaser.Animations.AnimationManager) {
        //super(params.scene, params.x, params.y, params.key, params.frame);

        //this.anims = params.scene.anims;
    
        //this.sprite = params.scene.physics.add.sprite(300, 100, 'player');
        //this.sprite.setBounce(0.05);
        //this.currentScene = params.scene;

        //this.initImage(input);

        //player.isFacingRight = true;
        
        //player.isCurrentlyTouchingSpring = false;     

        //this.game.camera.follow(player);
      }

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets;
    }

    private initSprite() {
        // variables
        /*
        this.marioSize = this.currentScene.registry.get("marioSize");
        this.acceleration = 500;
        this.isJumping = false;
        this.isDying = false;
        this.isVulnerable = true;
        this.vulnerableCounter = 100;
        */

        // sprite
        //this.setOrigin(0.5, 0.5);
        this.setFlipX(false);



        //this.displayOriginX = 0;
        //this.displayOriginY = 0;
        //this.displayWidth = 32;
        //this.displayHeight = 64;

        /*
        this.physics.world.setBounds(0, 0, 400, 400);
        var star = this.physics.add.sprite(128, 128, 'star');
        star.displayOriginX = 0;
        star.displayOriginY = 0;
        star.displayWidth = 20;
        star.displayHeight = 20;
        star.x = 0;
        star.y = 0;
        star.setGravity(40, 100);
        star.setBounce(1).setCollideWorldBounds(true);
        */
        //this.setDisplaySize(100, 100);
        //this.displayHeight = 75;
        //this.displayWidth = 75;
        //this.setScale()
        //this.setScale(0.75, 0.75);
    
        // input
        /*
        this.keys = new Map([
          ["LEFT", this.addKey("LEFT")],
          ["RIGHT", this.addKey("RIGHT")],
          ["DOWN", this.addKey("DOWN")],
          ["JUMP", this.addKey("SPACE")]
        ]);
        */
    
        // physics
        this.currentScene.physics.world.enable(this);
        //this.adjustPhysicBodyToSmallSize();
        this.body.maxVelocity.x = 50;
        this.body.maxVelocity.y = 300;
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