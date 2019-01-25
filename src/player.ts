import { Constants } from "./constants";

export class Player extends Phaser.GameObjects.Sprite {
    private currentScene: Phaser.Scene;
    private cursors: Phaser.Input.Keyboard.CursorKeys;

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
        //this.initImage();
        
            
        // image
        this.setScale(Constants.playerDrawScale, Constants.playerDrawScale);
        this.setOrigin(0.5, 0.5);

        var playerName = 'alienBlue';

        /*
        this.currentScene.anims.create({
            key: 'alienblue_walk',
            frames:
            [
                { key: 'alienblue_walk1' },
                { key: 'alienblue_walk2' }
            ],
            frameRate: 10,
            repeat: -1
        });
        */
       
        for (var i = 0; i < this.playerPrefixes.length; i++) {            
                /*
                frames: this.currentScene.anims.generateFrameNames(
                    key: this.playerPrefixes[i] + '_walk',
                    config: new GenerateFrameNamesConfig {} {start: 1, end: 2}),
                frameRate: 10});
                */
                /*
            this.animations.add(
                this.playerPrefixes[i] + 'swim',
                Phaser.Animation.generateFrameNames(this.playerPrefixes[i] + + '_swim', 1, 2, '.png'),
                10);
            this.animations.add(
                this.playerPrefixes[i] + 'climb',
                Phaser.Animation.generateFrameNames(this.playerPrefixes[i] + '_climb', 1, 2, '.png'),
                10);*/
        }

        // physics
        params.scene.physics.world.enable(this);
        this.body.allowGravity = true;
        //this.body.setVelocityX(-200);
        //this.body.setSize(20, 20);
        this.body.setBounce(0.2);
        this.body.setCollideWorldBounds(true);

        params.scene.add.existing(this);

        /*

                var player = this.game.add.sprite(64, 64, 'playerSprites', 'alienBlue_front.png');
        player.scale.setTo(Constants.playerDrawScale, Constants.playerDrawScale);
        player.anchor.setTo(.5, .5);
        //player.isInSpaceShip = false;

        for (var i = 0; i < this.playerPrefixes.length; i++) {
            player.animations.add(this.playerPrefixes[i] + 'walk', Phaser.Animation.generateFrameNames(this.playerPrefixes[i] + '_walk', 1, 2, '.png'), 10);
            player.animations.add(this.playerPrefixes[i] + 'swim', Phaser.Animation.generateFrameNames(this.playerPrefixes[i] + + '_swim', 1, 2, '.png'), 10);
            player.animations.add(this.playerPrefixes[i] + 'climb', Phaser.Animation.generateFrameNames(this.playerPrefixes[i] + '_climb', 1, 2, '.png'), 10);
        }

        this.game.physics.enable(player);
        this.game.physics.arcade.gravity.y = 600;
        player.body.setSize(64, 64, 0, 47);
        player.body.bounce.y = 0.05;
        player.body.linearDamping = 1;
        player.body.collideWorldBounds = true;

        player.frameName = this.playerPrefixes[this.selectedPlayerIndex] + "_stand.png";

        //player.isFacingRight = true;
        
        //player.isCurrentlyTouchingSpring = false;     

        this.game.camera.follow(player);

        */
      }

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets;
    }

    private initImage() {
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
        this.cursors = this.currentScene.input.keyboard.createCursorKeys();
        this.moveKeyLeft = this.currentScene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.A
        );
        this.moveKeyRight = this.currentScene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.D
        );
        this.shootingKey = this.currentScene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.CTRL
        );
        this.jumpingKey = this.currentScene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        // physics
        this.currentScene.physics.world.enable(this);
    }

    update(): void {
        //if (cursors.left.isDown || keyboard.isDown(Phaser.Keyboard.A)) {            
    }
}