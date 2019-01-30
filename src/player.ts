import { Constants } from "./constants";

// TODO: fix and move implementation here once basic player functionality is working in main scene
export class Player { //extends Phaser.GameObjects.Sprite {
    public sprite: Phaser.Physics.Arcade.Sprite;
    private currentScene: Phaser.Scene;
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private anims: Phaser.Animations.AnimationManager;

    private moveKeyLeft: Phaser.Input.Keyboard.Key;
    private moveKeyRight: Phaser.Input.Keyboard.Key;
    private shootingKey: Phaser.Input.Keyboard.Key;
    private jumpingKey: Phaser.Input.Keyboard.Key;

    // game objects
    private bullets: Phaser.GameObjects.Group;
    private playerPrefixes = ['alienBeige', 'alienBlue', 'alienGreen', 'alienPink', 'alienYellow'];

    
    constructor(physics: Phaser.Physics.Arcade.ArcadePhysics,
        input: Phaser.Input.InputPlugin,
        anims: Phaser.Animations.AnimationManager) {
        //super(params.scene, params.x, params.y, params.key, params.frame);

        this.anims = anims;
    
        this.sprite = physics.add.sprite(300, 100, 'player');
        this.sprite.setBounce(0.05);
        //this.currentScene = params.scene;

        //this.initImage(input);

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
            this.anims.add(
                this.playerPrefixes[i] + 'swim',
                Phaser.Animation.generateFrameNames(this.playerPrefixes[i] + + '_swim', 1, 2, '.png'),
                10);
            this.animations.add(
                this.playerPrefixes[i] + 'climb',
                Phaser.Animation.generateFrameNames(this.playerPrefixes[i] + '_climb', 1, 2, '.png'),
                10);
*/
                this.anims.create({
                    key: 'walk',
                    frames: this.anims.generateFrameNames('playerSprites', { prefix: 'alienBlue_walk1', start: 1, end: 2, zeroPad: 0 }),
                    frameRate: 10,
                    repeat: -1
                });               
                
                this.anims.create({
                    key: 'idle',
                    frames: [{key: 'player', frame: 'p1_stand'}],
                    frameRate: 10,
                });
             
        }
        this.sprite.anims.play('idle', true);

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