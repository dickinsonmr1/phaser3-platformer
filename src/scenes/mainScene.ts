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
  private skySprite: Phaser.GameObjects.TileSprite;

    world: World;    
    emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    // player selection
    playerPrefixes = ['alienBeige', 'alienBlue', 'alienGreen', 'alienPink', 'alienYellow'];
    selectedPlayerIndex = 0;
    
    // player stuff
    player: Player; //Phaser.Physics.Arcade.Sprite; 
    playerSpaceShip: Phaser.GameObjects.Sprite;
    //playerBox: PlayerBox;

    enemy;
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

        //this.createPlayer();

        this.world = this.createWorld('level1');

        //cursors = this.input.keyboard.createCursorKeys();
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

    createWorld(worldName): World {
        // using the Tiled map editor, here is the order of the layers from back to front:
        
        // layer00-image (not currently used)
        // layer01-background-passable
        // layer02-nonpassable        
        // (player spaceship)
        // (player)
        // layer07-enemies 
        // layer05-collectibles
        // layer03-foreground-passable-semitransparent
            // like water... one idea is to make this automatically move
        // layer06-gameobjects        
        // layer04-foreground-passable-opaque
        
        // TODO: tilemaps (https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6)
        // 
        var world = new World();

        world.sky = this.skySprite;

        world.map = this.add.tilemap(worldName);
        //map.addTilesetImage('sky', 'backgroundImageLayer');
        var tileSet = world.map.addTilesetImage('spritesheet_tiles_64x64', 'tiles');
        var itemsTileSet = world.map.addTilesetImage('spritesheet_items_64x64', 'items');
        var groundTileSet = world.map.addTilesetImage('spritesheet_ground_64x64', 'ground');
        var enemiesTileSet = world.map.addTilesetImage('spritesheet_enemies_64x64', 'enemyTiles');
        var requestTileSet = world.map.addTilesetImage('platformer-requests-sheet_64x64', 'platformerRequestTiles');
        var industrialTileSet = world.map.addTilesetImage('platformerPack_industrial_tilesheet_64x64', 'industrialTiles');
        var playerTileSet = this.load.atlasXML('playerSprites', 'assets/sprites/player/spritesheet_players.png', 'assets/sprites/player/spritesheet_players.xml');

        this.add.image(0, 0, 'playerSprites', 'alienBlue_front.png');

        var tileSets = [tileSet, itemsTileSet, groundTileSet, enemiesTileSet, requestTileSet, industrialTileSet];
        
            // background layer
        //var groundTileSet = world.map.addTilesetImage('spritesheet_ground_64x64', 'ground');
        world.layer01 = world.map.createStaticLayer('layer01-background-passable', tileSets, 0, 0, );
        world.layer01.alpha = 1.0;
        //world.layer01.resizeWorld();f

        // non-passable blocks layer
        world.layer02 = world.map.createDynamicLayer('layer02-nonpassable', tileSets, 0, 0);
        world.layer02.alpha = 1.0;
        //world.map.setCollisionBetween(0, 2000, true, true, world.layer02.data);
        world.layer02.setCollisionByExclusion([-1],true);//, Constants.tileLockBlue]);
        //world.layer02.set
        world.layer02.setTileIndexCallback(Constants.tileLockBlue, this.unlockDoor, this);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('playerSprites', { prefix: 'alienBlue_walk', start: 1, end: 2, zeroPad: 1, suffix: '.png' }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'swim',
            frames: this.anims.generateFrameNames('playerSprites', { prefix: 'alienBlue_swim', start: 1, end: 2, zeroPad: 1, suffix: '.png' }),
            frameRate: 10,
            repeat: -1
        });
        // idle with only one frame, so repeat is not neaded
        this.anims.create({
            key: 'idle',
            frames: [{key: 'playerSprites', frame: 'alienBlue_stand.png'}],
            frameRate: 10,
        });

        this.anims.create({
            key: 'jump',
            frames: [{key: 'playerSprites', frame: 'alienBlue_jump.png'}],
            frameRate: 10,
        });

        this.anims.create({
            key: 'duck',
            frames: [{key: 'playerSprites', frame: 'alienBlue_duck.png'}],
            frameRate: 10,
        });

        this.player = new Player({
            scene: this,
            x: 20,
            y: 600,
            key: "player2"
            });        
        //this.player
        //this.player.playerGun = this.add.image(64, 64, 'playerGun', 'playerGun');
        //this.playerBox.playerGun.anchor.setTo(0.5, 0.5);
            // small fix to our player images, we resize the physics body object slightly
        //this.player2.body.setSize(this.player2.width, this.player2.height-8);


        this.physics.add.collider(this.player, world.layer02);

        /*
        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, 1000,1000 );
        // make the camera follow the player
        this.cameras.main.startFollow(this.player.sprite);
        
        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#ccccff'); 
        */

            /*
            //map.setCollisionBetween(0, 133, true, layer02, true);
            world.map.setCollisionBetween(0, 2000, true, world.layer02, true);
            //map.setCollisionBetween(158, 400, true, layer02, true);

            world.layer02.resizeWorld();
            world.layer02.debug = false;
            //map.setCollision();
            */

            //  Un-comment this on to see the collision tiles
            //world.layer01.debug = true;
            //world.layer02.debug = true;

        //---------------------------------------------------------------------------------------------------
        // foreground semi-transparent layer (water, lava, clouds, etc.)
        //---------------------------------------------------------------------------------------------------
        world.layer03 = world.map.createStaticLayer('layer03-foreground-passable-semitransparent', tileSets, 0, 0);
        world.layer03.alpha = 0.5;
        this.physics.add.overlap(this.player, world.layer03);
        world.layer03.setTileIndexCallback(Constants.tileWater, this.inWater, this);
        world.layer03.setTileIndexCallback(Constants.tileWaterTop, this.inWater, this);
        
        //---------------------------------------------------------------------------------------------------
        // FOREGROUND PASSABLE OPAQUE LAYER (front wall of a cave, plant, etc.)
        //---------------------------------------------------------------------------------------------------
        world.layer04 = world.map.createStaticLayer('layer04-foreground-passable-opaque', tileSets, 0, 0);
        world.layer04.alpha = 1.0;

        //---------------------------------------------------------------------------------------------------
        // COLLECTIBLES
        //---------------------------------------------------------------------------------------------------
        world.layer05 = world.map.createDynamicLayer('layer05-collectibles', tileSets, 0, 0);
        world.layer05.alpha = 1.0;//0.75;

        this.physics.add.overlap(this.player, world.layer05);
        world.layer05.setTileIndexCallback(Constants.tileKeyGemRed, this.collectGem, this);
        world.layer05.setTileIndexCallback(Constants.tileKeyGemGreen, this.collectGem, this);
        world.layer05.setTileIndexCallback(Constants.tileKeyGemYellow, this.collectGem, this);
        world.layer05.setTileIndexCallback(Constants.tileKeyGemBlue, this.collectGem, this);
        world.layer05.setTileIndexCallback(Constants.tileKeyBlueKey, this.collectKey, this);        

        world.layer06 = world.map.createStaticLayer('layer06-gameobjects', tileSets, 0, 0);
        world.layer06.alpha = 0.0;

        world.layer06.forEachTile(tile => {
            if(tile.index == Constants.tileKeySpring)
            {
                const x = tile.getCenterX();
                const y = tile.getCenterY();
                const spring = this.springs.create(x, y, "sprung");
                this.physics.world.enable(spring);   
                spring.body.moves = false;
                spring.body.immovable = true;

                this.add.existing(spring);
                //world.layer06.removeTileAt(tile.x, tile.y);
            }
        })

        /*
        this.springs.runChildUpdate(function (item) {        
            item.enableBody = true;
            item.immovable = true;
            item.body.moves = false;
            item.scale.setTo(0.5, 0.5);
            item.anchor.setTo(0, 0);
        }, this);
        */

        var allEnemyTypes = [297, 290, 322, 300, 380, 337, 395, 299, 323, 330, 353, 347, 371];
        //---------------------------------------------------------------------------------------------------
        // ENEMIES
        //---------------------------------------------------------------------------------------------------
        world.layer07 = world.map.createDynamicLayer('layer07-enemies', tileSets, 0, 0);
        world.layer07.alpha = 0.1;
        world.layer07.forEachTile(tile => {
            if(allEnemyTypes.includes(tile.index)) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();
                const enemy = this.enemies.create(x, y, "ghost");
                enemy.currentScene = this;
                this.physics.world.enable(enemy);   
                this.add.existing(enemy);

                world.layer07.removeTileAt(tile.x, tile.y);
            }
        });
      
        this.physics.add.collider(this.player, world.layer02);
        this.physics.add.collider(this.player, world.layer07);
        this.physics.add.collider(this.player, this.enemies, this.playerTouchingEnemiesHandler);
        this.physics.add.collider(this.player, this.springs, this.playerTouchingSpringHandler);
        this.physics.add.collider(this.enemies, world.layer02);

        this.player.bullets = this.physics.add.group({
            allowGravity: false
        })

        this.physics.add.collider(this.enemies, this.player.bullets, this.bulletTouchingEnemyHandler);
        this.physics.add.collider(this.player.bullets, world.layer02, this.bulletTouchingImpassableLayerHandler);
                
        //this.physics.world.setBoundsCollision(true, true, true, true);
        //world.layer07.createFromTiles([297, 290, 322, 300, 380, 337, 395, 299, 323, 330, 353, 347, 371], null, this.make.sprite(), this, this.cameras.main);//, this.enemyPhysics);
        //world.map.createFromTiles([324], null, 'piranha', 'layer07-enemies', enemiesNonGravity);//, this.enemyNonGravity);

        /*
        world.map.createFromTiles([297, 290, 322, 300, 380, 337, 395, 299, 323, 330, 353, 347, 371], null, 'ghost', 'layer07-enemies', enemiesPhysics);//, this.enemyPhysics);

        world.map.createFromTiles([324], null, 'piranha', 'layer07-enemies', enemiesNonGravity);//, this.enemyNonGravity);

        world.layer07.resizeWorld();

        game.physics.enable(enemiesNonGravity);
        enemiesNonGravity.forEach(function (enemy) {
            enemy.enemyType = "nonGravity";
            enemy.movementTime = 0;

            enemy.enableBody = true;
            enemy.body.allowGravity = false;
            enemy.body.velocity.y = 150;
            enemy.body.collideWorldBounds = false;
            enemy.isFacingRight = true;
        }, this);
        enemies.add(enemiesNonGravity);

        game.physics.enable(enemiesPhysics);
        enemiesPhysics.forEach(function (enemy) {
            enemy.enemyType = "physics";
            enemy.enableBody = true;
            enemy.body.collideWorldBounds = true;
            enemy.isFacingRight = true;
        }, this);
        enemies.add(enemiesPhysics);
        */
        
        return world;
    }

    //createPlayer(physics: Phaser.Physics.Arcade.ArcadePhysics, input: Phaser.Input.InputPlugin, anims: Phaser.Animations.AnimationManager): Player {
        //return new Player(this);//physics, input, anims);
        ////return new Player({scene: this, x: 64, y: 64, key: 'playerSprites', frame: 'alienBlue_front.png'});
    //}

    update(): void {

        this.world.sky.setX(0);
        this.world.sky.setY(768);
        this.world.sky.setTilePosition(-(this.cameras.main.scrollX * 0.25), -(this.cameras.main.scrollY * 0.05));

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
        this.world.layer05.removeTileAt(tile.x, tile.y);
        this.sound.play("keySound");

        return false;
    }
     
    unlockDoor (player: Player, tile): boolean
    {
        if(player.hasBlueKey) {
            this.world.layer02.removeTileAt(tile.x, tile.y);
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

  