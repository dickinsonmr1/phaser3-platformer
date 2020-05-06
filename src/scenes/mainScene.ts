/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../phaser.d.ts"/>

import "phaser";
import { Player } from "../player";
import { Constants } from "../constants";
import { Bullet } from "../bullet";
import { World } from "../world/world";

export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  public skySprite: Phaser.GameObjects.TileSprite;

    world: World;    
    emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    // player selection
    playerPrefixes = ['alienBeige', 'alienBlue', 'alienGreen', 'alienPink', 'alienYellow'];
    selectedPlayerIndex = 0;
    
    // player stuff
    player: Player; //Phaser.Physics.Arcade.Sprite; 
    playerSpaceShip: Phaser.GameObjects.Sprite;
    //playerBox: PlayerBox;

    enemies : Phaser.GameObjects.Group;
    enemiesPhysics: Phaser.GameObjects.Group;
    enemiesNonGravity: Phaser.GameObjects.Group;

    springs: Phaser.GameObjects.Group;

    cursors: Phaser.Input.Keyboard.CursorKeys;              
    zoomInKey: Phaser.Input.Keyboard.Key;
    zoomOutKey: Phaser.Input.Keyboard.Key;
    shootKey: Phaser.Input.Keyboard.Key;
    shootKey2: Phaser.Input.Keyboard.Key;
    pauseKey: Phaser.Input.Keyboard.Key;
    moveWaterKey: Phaser.Input.Keyboard.Key;

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
        this.load.atlasXML('tileObjectSprites', './assets/sprites/objects/spritesheet_complete.png', './assets/sprites/objects/spritesheet_complete.xml');
        this.load.atlasXML('playerSprites', './assets/sprites/player/spritesheet_players.png', './assets/sprites/player/spritesheet_players.xml');
        this.load.atlasXML('alienShipSprites', './assets/sprites/ships/spritesheet_spaceships.png', './assets/sprites/ships/spritesheet_spaceships.xml');
        this.load.atlasXML('alienShipLaserSprites', './assets/sprites/ships/spritesheet_lasers.png', './assets/sprites/ships/spritesheet_lasers.xml');
        //this.load.atlasXML('hudSprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');

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
        //this.game.load.tilemap('level1', './assets/tilemaps/maps/world-00-overworld.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', './assets/tilemaps/tiles/spritesheet_tiles_64x64.png');
        this.load.image('items', './assets/tilemaps/tiles/spritesheet_items_64x64.png');
        this.load.image('ground', './assets/tilemaps/tiles/spritesheet_ground_64x64.png');
        this.load.image('platformerRequestTiles', './assets/tilemaps/tiles/platformer-requests-sheet_64x64.png');
        this.load.image('industrialTiles', './assets/tilemaps/tiles/platformerPack_industrial_tilesheet_64x64.png');
        this.load.image('enemyTiles', './assets/tilemaps/tiles/spritesheet_enemies_64x64.png');
    }

    create(): void {    
        this.skySprite = this.add.tileSprite(0, 0, 20480, 1024, 'sky');            
        
        this.enemies = this.add.group();
        this.enemiesPhysics = this.add.group();  // removed 324
        this.enemiesNonGravity = this.add.group();

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
        this.player.init(this.anims);

        this.world = new World(this);
        this.world.createWorld('level1', this.player);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.zoomInKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.zoomOutKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        this.shootKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.moveWaterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBackgroundColor('#ccccff');

        //var particles = this.add.particles('playerGunBullet');

        /*
        var source = {
            contains: function (x, y)
            {
                this.enemies.body.hitTest(x, y);

                return
            }
        };
        */

        /*
        this.emitter = particles.createEmitter({
            x: 600,
            y: 100,
            angle: { min: 180, max: 180 },
            speed: 500,
            gravityY: 0,
            lifespan: 1000,
            maxParticles: 10,
            alpha: 0.75
        });
        */

        /*
        var config = {
            type: 'onEnter',  // 'onEnter', or 'onLeave'
            source: source      // Geom like Circle or Rect that supports a 'contains' function
        };
        this.emitter.setDeathZone(config);
        */
        //this.emitter.setBlendMode('SCREEN');

        //this.scene.launch("HudScene");
        //this.scene.bringToTop('HudScene');
    }

    //createPlayer(physics: Phaser.Physics.Arcade.ArcadePhysics, input: Phaser.Input.InputPlugin, anims: Phaser.Animations.AnimationManager): Player {
        //return new Player(this);//physics, input, anims);
        ////return new Player({scene: this, x: 64, y: 64, key: 'playerSprites', frame: 'alienBlue_front.png'});
    //}

    update(): void {

        this.world.updateSky(this.cameras.main);

        //this.world.sky.setX(0);
        //this.world.sky.setY(768);
        //this.world.sky.setTilePosition(-(this.cameras.main.scrollX * 0.25), -(this.cameras.main.scrollY * 0.05));

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
            //this.scene.pause('MainScene');
            this.scene.pause('HudScene');
            this.scene.setVisible(false, "HudScene");
            this.scene.switch("PauseScene");
            //this.scene.resume
        }

        // Jumping
        if ((this.cursors.space.isDown || this.cursors.up.isDown))
        {
            this.player.tryJump(this.sound);
        }      

        this.player.update();
        //this.player.playerGun.setSize(64, 64).setOffset(100, 100);

        //var hudScene = this.scene.get('HudScene');
        //hudScene.setHealth(this.player.health);
        /*
        this.emitter.setPosition(this.player.x + 20, this.player.y + 200);
        if(this.player.flipX)
            this.emitter.setAngle(180);
        else
            this.emitter.setAngle(0);
        */

        this.updateExpiringText();
    }

    updatePhysics(): void {

    }

    processInput(): void {

    }

    collectGem (sprite, tile): boolean
    {
        this.world.layer05. removeTileAt(tile.x, tile.y);
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
    playerTouchingSpringHandler(player, springs): void {
        player.tryBounce(player.scene.game.loop.time, player.currentScene.sound);
    }

    playerTouchingEnemiesHandler(player: Player, enemies): void
    {
        console.log(this);
        player.tryDamage();
    }

    bulletTouchingEnemyHandler(enemy, bullet: Bullet): void {
        bullet.destroy();
        enemy.destroy();
        enemy.currentScene.sound.play("enemyDeathSound");
        var damage = 100;

        //const spring = enemy.currentScene.expiringMessagesGroup.create(enemy.x, enemy.y, "sprung");
        //this.physics.world.enable(spring);

        const emitText = enemy.currentScene.add.text(enemy.x, enemy.y, damage.toString(),
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 24,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        emitText.setAlpha(0.75);
        emitText.setStroke('rgb(0,0,0)', 4);

        enemy.currentScene.physics.world.enable(emitText);
        emitText.body.alpha = 0.6;
        enemy.currentScene.expiringMessagesGroup.add(emitText);

        //enemy.currentScene.events.emit("enemyDamage", );

        //if (!this.playerBox.isInSpaceShip && !this.playerBox.isTouchingSpring) {
            //if(springSound.)
            //if (tile.alpha > 0) {
            //player.body.velocity.y = -650;
            //enemy.currentScene.sound.play("hurtSound");
            //this.sound.play("laserSound");
            //this.playerBox.isTouchingSpring = true;
        //}
    }

    bulletTouchingImpassableLayerHandler(bullet, layer): void {
        bullet.destroy();
    }
  
    bulletIntervalElapsed = (now, time) =>{
        return now > time;
    }

    //  Called if the bullet goes out of the screen
    resetBullet(bullet): void {
        //bullet.kill();
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

 /*
    playerEnteringSpaceshipCollisionHandler(playerSpaceShip, player): void {
        if (player.renderable) {
            
            this.playerBox.isInSpaceShip = true;
            //particleBurst();
            this.emitter.start(false, 1000, 100, 0);
        }
    }

    playerTouchingSpringHandler(player, springs): void {

        if (!this.playerBox.isInSpaceShip && !this.playerBox.isTouchingSpring) {
            //if(springSound.)
            //if (tile.alpha > 0) {
            player.body.velocity.y = -650;
            this.springSound.play();
            this.playerBox.isTouchingSpring = true;
        }
    }

    playerTouchingEnemiesHandler(player, enemies): void {

        if (!this.playerBox.isInSpaceShip && player.playerBox.hurtTime == 0) {
            this.hurtSound.play();
            player.playerBox.hurtTime = 60;
        }
    }
*/
   
/*
    playerExitingSpaceship(player, playerSpaceShip, playerBox): void {
        playerBox.isInSpaceShip = false;
        player.body.velocity.y = -400;
        player.body.x = playerSpaceShip.body.x +50;
        player.renderable = true;
        playerSpaceShip.body.velocity.x = 0;
        playerSpaceShip.body.velocity.y = 0;
        playerSpaceShip.frameName = "shipBeige.png"; //players[selectedPlayerIndex] + "_stand.png";

        this.emitter.on = false;
    }
    */

  