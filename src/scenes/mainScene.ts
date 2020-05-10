/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../phaser.d.ts"/>

import "phaser";
import { Player } from "../player";
import { Enemy } from "../enemy";
import { Constants } from "../constants";
import { Bullet } from "../bullet";
import { World } from "../world/world";

export class MainScene extends Phaser.Scene {
  public skySprite: Phaser.GameObjects.TileSprite;

    world: World;    
    emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    // player selection
    selectedPlayerIndex = 0;
    
    // player stuff
    player: Player; //Phaser.Physics.Arcade.Sprite; 
    playerSpaceShip: Phaser.GameObjects.Sprite;
    //playerBox: PlayerBox;

    enemies : Array<Phaser.GameObjects.Sprite>;
    enemiesPhysics: Array<Phaser.GameObjects.Sprite>;
    enemiesNonGravity: Array<Phaser.GameObjects.Sprite>;

    springs: Phaser.GameObjects.Group;

    cursors: Phaser.Input.Keyboard.CursorKeys;              
    zoomInKey: Phaser.Input.Keyboard.Key;
    zoomOutKey: Phaser.Input.Keyboard.Key;
    shootKey: Phaser.Input.Keyboard.Key;
    shootKey2: Phaser.Input.Keyboard.Key;
    pauseKey: Phaser.Input.Keyboard.Key;
    moveWaterKey: Phaser.Input.Keyboard.Key;
    jumpKey: Phaser.Input.Keyboard.Key;

    playerBullets: Phaser.GameObjects.Group;

    expiringMessagesGroup: Phaser.GameObjects.Group;
     
    constructor() {
    super({
        key: "MainScene",
        //active: true
        //map: {   events: 'events', audio: 'audio'}
    });
    }

    preload(): void {
        this.loadAudio();
        this.loadSprites();
        this.loadTileMaps();   
    }

    loadAudio(): void {
        this.load.audio('jumpSound', './assets/audio/jump.wav');
        this.load.audio('gemSound', './assets/audio/coin.wav');
        this.load.audio('keySound', './assets/audio/key.wav');
        this.load.audio('springSound', './assets/audio/spring.wav');
        this.load.audio('laserSound', './assets/audio/laser5.ogg');
        this.load.audio('hurtSound', './assets/audio/hurt.wav');
        this.load.audio('enemyDeathSound', './assets/audio/lowRandom.ogg');
    }

    loadSprites(): void {
        // spritesheets for game objects (not in the game map)
        this.load.atlasXML('enemySprites', './assets/sprites/enemies/enemies.png', './assets/sprites/enemies/enemies.xml');
        this.load.atlasXML('enemySprites2', './assets/sprites/enemies/spritesheet_enemies.png', './assets/sprites/enemies/spritesheet_enemies.xml');
        this.load.atlasXML('completeSprites', './assets/sprites/objects/spritesheet_complete.png', './assets/sprites/objects/spritesheet_complete.xml');
        this.load.atlasXML('playerSprites', './assets/sprites/player/spritesheet_players.png', './assets/sprites/player/spritesheet_players.xml');
        this.load.atlasXML('alienShipSprites', './assets/sprites/ships/spritesheet_spaceships.png', './assets/sprites/ships/spritesheet_spaceships.xml');
        this.load.atlasXML('alienShipLaserSprites', './assets/sprites/ships/spritesheet_lasers.png', './assets/sprites/ships/spritesheet_lasers.xml');

        // initial placeholders for animated objects
        this.load.image('ghost', './assets/sprites/enemies/ghost.png');
        this.load.image('piranha', './assets/sprites/enemies/piranha.png');
        this.load.image('sprung', './assets/sprites/objects/sprung64.png');
        this.load.image('engineExhaust', './assets/sprites/ships/laserblue3.png');

        this.load.image('playerGun', './assets/sprites/player/raygunPurpleBig.png');
        this.load.image('playerGunBullet', './assets/sprites/player/laserPurpleDot15x15.png');

        this.load.image('logo', './assets/sample/phaser.png');
        this.load.image('sky', './assets/sample/colored_grass.png');

    }

    loadTileMaps(): void {
        // tilemap for level building
        //this.load.tilemapTiledJSON('level1', './assets/tilemaps/maps/world-00-overworld.json');
        this.load.tilemapTiledJSON('level1', './assets/tilemaps/maps/world-01-03.json');
        this.load.image('tiles', './assets/tilemaps/tiles/spritesheet_tiles_64x64.png');
        this.load.image('items', './assets/tilemaps/tiles/spritesheet_items_64x64.png');
        this.load.image('ground', './assets/tilemaps/tiles/spritesheet_ground_64x64.png');
        this.load.image('platformerRequestTiles', './assets/tilemaps/tiles/platformer-requests-sheet_64x64.png');
        this.load.image('industrialTiles', './assets/tilemaps/tiles/platformerPack_industrial_tilesheet_64x64.png');
        this.load.image('enemyTiles', './assets/tilemaps/tiles/spritesheet_enemies_64x64.png');
    }

    createAnims(anims) {
        
        // player
        anims.create({
            key: 'walk',
            frames: anims.generateFrameNames('playerSprites', { prefix: 'alienBlue_walk', start: 1, end: 2, zeroPad: 1, suffix: '.png' }),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key: 'swim',
            frames: anims.generateFrameNames('playerSprites', { prefix: 'alienBlue_swim', start: 1, end: 2, zeroPad: 1, suffix: '.png' }),
            frameRate: 10,
            repeat: -1
        });
        // idle with only one frame, so repeat is not neaded
        anims.create({
            key: 'idle',
            frames: [{key: 'playerSprites', frame: 'alienBlue_stand.png'}],
            frameRate: 10,
        });

        anims.create({
            key: 'jump',
            frames: [{key: 'playerSprites', frame: 'alienBlue_jump.png'}],
            frameRate: 10,
        });

        anims.create({
            key: 'duck',
            frames: [{key: 'playerSprites', frame: 'alienBlue_duck.png'}],
            frameRate: 10,
        });


        // enemy
        anims.create({
            key: 'enemyIdle',
            frames: [{key: 'enemySprites2', frame: 'enemyWalking_1.png', }],
            frameRate: 10,
        });

        
        anims.create({
            key: 'enemyWalk',
            frames:
            [
                {key: 'enemySprites2', frame: 'enemyWalking_1.png'},
                {key: 'enemySprites2', frame: 'enemyWalking_2.png'},
                //{key: 'enemySprites2', frame: 'enemyWalking_3.png'},
                //{key: 'enemySprites2', frame: 'enemyWalking_4.png'}
            ],
            frameRate: 5,
            repeat: -1
        });

        anims.create({
            key: 'enemyDead',
            frames: [{key: 'enemySprites2', frame: 'enemyWalking_1.png'}],
            frameRate: 10,
        });
    }

    create(): void {    

        this.createAnims(this.anims);
        this.skySprite = this.add.tileSprite(0, 0, 20480, 1024, 'sky');            
        
        this.enemies = new Array<Phaser.GameObjects.Sprite>();
        this.enemiesPhysics = Array<Phaser.GameObjects.Sprite>();  // removed 324
        this.enemiesNonGravity = Array<Phaser.GameObjects.Sprite>();

        this.expiringMessagesGroup = this.physics.add.group({
            allowGravity: false,
            velocityY: 100
        })

        this.springs = this.add.group();
        
        this.player = new Player({
            scene: this,
            x: 20,
            y: 600,
            key: "player2"
            });        
        this.player.init();

        this.world = new World(this);
        this.world.createWorld('level1', this.player);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.zoomInKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.zoomOutKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        this.shootKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.moveWaterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBackgroundColor('#ccccff');
    }

    update(): void {

        this.world.updateSky(this.cameras.main);

        if(this.shootKey.isDown) {
            this.player.tryFireBullet(this.sys.game.loop.time, this.sound);
        }

        if(this.shootKey2.isDown) {
            this.events.emit("playerHurt");
        }

        if(this.zoomInKey.isDown) {
            this.cameras.main.zoom -= 0.01;
        }
        if(this.zoomOutKey.isDown) {
            this.cameras.main.zoom += 0.01;
        }

        if(this.moveWaterKey.isDown) {
            // debug stuff here    
        }

        if (this.cursors.left.isDown) {
           this.player.moveLeft();
        }
        else if (this.cursors.right.isDown) {
           this.player.moveRight();
        }
        else if (this.cursors.down.isDown) {
           this.player.duck();
        }
        else {
            this.player.stand();
        }
        if(Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.input.keyboard.resetKeys();

            this.scene.pause('MainScene');            
            this.scene.pause('HudScene');
            this.scene.setVisible(false, "HudScene");

            this.scene.run("PauseScene");
            this.scene.bringToTop("PauseScene")
        }

        // Jumping
        if ((this.jumpKey.isDown || this.cursors.up.isDown))
        {
            this.player.tryJump(this.sound);
        }      

        this.player.update();
        this.updateExpiringText();

        this.enemies.forEach(enemy => {
            enemy.update(this.player.x, this.player.y);
        });
    }

    updatePhysics(): void {

    }

    processInput(): void {

    }

    collectGem (sprite, tile): boolean
    {
        this.world.collectGem(tile.x, tile.y);
        this.sound.play("gemSound");
        this.events.emit("gemCollected", this.player.gemsCollected++);

        return false;
    }

    inWater (player: Player, tile): boolean
    {
        player.isInWater = true;

        return false;
    }

    collectKey (sprite, tile): boolean
    {
        this.player.hasBlueKey = true;
        this.world.collectKey(tile.x, tile.y);
        this.sound.play("keySound");

        return false;
    }
     
    unlockDoor (player: Player, tile): boolean
    {
        if(player.hasBlueKey) {
            this.world.unlockDoor(tile.x, tile.y);
            this.sound.play("keySound");
        }
        return false;
    }

    playerTouchingSpringHandler(player: Player, springs): void {
        player.tryBounce(player.getScene().game.loop.time, player.getScene().sound);
    }

    playerTouchingEnemiesHandler(player: Player, enemies): void
    {
        console.log(this);
        player.tryDamage();
    }

    enemyTouchingEnemyHandler(enemy1: Enemy, enemy2: Enemy): void {

        var body1 = <Phaser.Physics.Arcade.Body>enemy1.body;
        var body2 = <Phaser.Physics.Arcade.Body>enemy2.body;

        if(body1.x < body2.x && body1.velocity.x > 0) {
            body1.velocity.x = 0;
            enemy1.idleTime = 20;
        }
        else if(body1.x > body2.x && body1.velocity.x < 0) {
            body1.velocity.x = 0;
            enemy1.idleTime = 20;
        }            
        else if(body1.x > body2.x && body2.velocity.x > 0) {
            body2.velocity.x = 0;
            enemy2.idleTime = 20;
        }            
        else if(body1.x < body2.x && body2.velocity.x < 0) {
            body2.velocity.x = 0;
            enemy2.idleTime = 20;
        }            

        //console.log("Enemy1.x: " + enemy.x);
        //console.log("Enemy2.x: " + enemy2.x);
        enemy1.idle();
        enemy2.idle();
    }

    bulletTouchingEnemyHandler(enemy: Enemy, bullet: Bullet): void {
        
        var scene = <MainScene>enemy.getScene();

        var damage = 100;

        scene.sound.play("enemyDeathSound");
       
        scene.addExpiringText(scene, enemy.x, enemy.y, damage.toString())

        bullet.destroy();
        enemy.destroy();
    }

    bulletTouchingImpassableLayerHandler(bullet, layer): void {
        bullet.destroy();
    }
  
    bulletIntervalElapsed = (now, time) =>{
        return now > time;
    }

    private addExpiringText(scene: MainScene, x: number, y: number, text: string, ) {
              
        var emitText = scene.add.text(x, y, text,
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 24,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        emitText.setAlpha(0.75);
        emitText.setStroke('rgb(0,0,0)', 4);

        scene.physics.world.enable(emitText);

        emitText.body.alpha = 0.6;
        
        scene.expiringMessagesGroup.add(emitText);
    }
    
    updateExpiringText(): void {
        this.expiringMessagesGroup.getChildren().forEach(x => {

            var message = <Phaser.GameObjects.Text> x;
            message.setAlpha(message.body.alpha);
            message.body.setVelocityY(-200);
            message.body.alpha -= 0.02;

            if(message.body.alpha <= 0)
                message.destroy();
        });
    }
}