/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../phaser.d.ts"/>

import "phaser";
import { Player } from "../player";
import { Constants } from "../constants";

export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  private skySprite: Phaser.GameObjects.TileSprite;

    world: World;

    // player selection
    playerPrefixes = ['alienBeige', 'alienBlue', 'alienGreen', 'alienPink', 'alienYellow'];
    selectedPlayerIndex = 0;
    
    // player stuff
    player: Player; //Phaser.Physics.Arcade.Sprite; 
    playerSpaceShip: Phaser.GameObjects.Sprite;
    playerBox: PlayerBox;

    enemy;
    enemies : Phaser.GameObjects.Group;
    enemiesPhysics: Phaser.GameObjects.Group;
    enemiesNonGravity: Phaser.GameObjects.Group;

    cursors: Phaser.Input.Keyboard.CursorKeys;              
    zoomInKey: Phaser.Input.Keyboard.Key;
    zoomOutKey: Phaser.Input.Keyboard.Key;
     
    constructor() {
    super({
        key: "MainScene", active: true
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
        this.load.tilemapTiledJSON('level1', './assets/tilemaps/maps/world-01-02.json');
        //this.game.load.tilemap('level1', './assets/tilemaps/maps/world-00-overworld.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', './assets/tilemaps/tiles/spritesheet_tiles_64x64.png');
        this.load.image('items', './assets/tilemaps/tiles/spritesheet_items_64x64.png');
        this.load.image('ground', './assets/tilemaps/tiles/spritesheet_ground_64x64.png');
        this.load.image('platformerRequestTiles', './assets/tilemaps/tiles/platformer-requests-sheet_64x64.png');
        this.load.image('enemyTiles', './assets/tilemaps/tiles/spritesheet_enemies_64x64.png');
    }

    create(): void {    
        this.skySprite = this.add.tileSprite(0, 0, 20480, 1024, 'sky');            
        
        this.enemies = this.add.group();
        this.enemiesPhysics = this.add.group();  // removed 324
        this.enemiesNonGravity = this.add.group();

        //this.createPlayer();

        this.world = this.createWorld('level1');

        //cursors = this.input.keyboard.createCursorKeys();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.zoomInKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.zoomOutKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBackgroundColor('#ccccff');

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
        var playerTileSet = this.load.atlasXML('playerSprites', 'assets/sprites/player/spritesheet_players.png', 'assets/sprites/player/spritesheet_players.xml');

        this.add.image(0, 0, 'playerSprites', 'alienBlue_front.png');

        var tileSets = [tileSet, itemsTileSet, groundTileSet, enemiesTileSet, requestTileSet];
        
            // background layer
        var groundTileSet = world.map.addTilesetImage('spritesheet_ground_64x64', 'ground');
        world.layer01 = world.map.createStaticLayer('layer01-background-passable', tileSets, 0, 0, );
            world.layer01.alpha = 1.0;
            //world.layer01.resizeWorld();

            // non-passable blocks layer
            world.layer02 = world.map.createStaticLayer('layer02-nonpassable', tileSets, 0, 0);
            world.layer02.alpha = 1.0;
            //world.map.setCollisionBetween(0, 2000, true, true, world.layer02.data);
            world.layer02.setCollisionByExclusion([-1]);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('playerSprites', { prefix: 'alienBlue_walk', start: 1, end: 2, zeroPad: 1, suffix: '.png' }),
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

        this.player = new Player({
            scene: this,
            x: 200,
            y: 200,
            key: "player2"
            });        

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
        //world.layer03.resizeWorld();

        //---------------------------------------------------------------------------------------------------
        // FOREGROUND PASSABLE OPAQUE LAYER (front wall of a cave, plant, etc.)
        //---------------------------------------------------------------------------------------------------
        world.layer04 = world.map.createStaticLayer('layer04-foreground-passable-opaque', tileSets, 0, 0);
        world.layer04.alpha = 1.0;
        //world.layer04.resizeWorld();


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
        world.layer06.alpha = 0.0;//0.75;

            //---------------------------------------------------------------------------------------------------
        // ENEMIES
        //---------------------------------------------------------------------------------------------------
        world.layer07 = world.map.createDynamicLayer('layer07-enemies', tileSets, 0, 0);
        world.layer07.alpha = 0.1;
                
        //world.map.createFromTiles([297, 290, 322, 300, 380, 337, 395, 299, 323, 330, 353, 347, 371],null, 'ghost', 'layer07-enemies', enemiesPhysics);//, this.enemyPhysics);
        //world.map.createFromTiles([324], null, 'piranha', 'layer07-enemies', enemiesNonGravity);//, this.enemyNonGravity);


        return world;
    }

    createPlayer(physics: Phaser.Physics.Arcade.ArcadePhysics, input: Phaser.Input.InputPlugin, anims: Phaser.Animations.AnimationManager): Player {
        return new Player(this);//physics, input, anims);
        //return new Player({scene: this, x: 64, y: 64, key: 'playerSprites', frame: 'alienBlue_front.png'});
    }

    update(): void {

        this.world.sky.setX(0);
        this.world.sky.setY(768);
        this.world.sky.setTilePosition(-(this.cameras.main.scrollX * 0.25), -(this.cameras.main.scrollY * 0.05));

        if(this.zoomInKey.isDown) {
            this.cameras.main.zoom = 0.75;
        }
        if(this.zoomOutKey.isDown) {
            this.cameras.main.zoom = 1.25;
        }
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-300); // move left
            
            if(this.player.body.onFloor()) {         
                this.player.anims.play('walk', true); // play walk animation
            }
            else {
                this.player.anims.play('jump', true); // play walk animation
            }
            
            this.player.flipX= true; // flip the sprite to the left
        }
        else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(300); // move right
            if(this.player.body.onFloor()) {
                this.player.anims.play('walk', true); // play walk animation
            }
            else {
                this.player.anims.play('jump', true); // play walk animation
            }

            this.player.flipX = false; // use the original sprite looking to the right
        }
        else {
            this.player.body.setVelocityX(0);
            if(this.player.body.onFloor())
            {
                this.player.anims.play('idle', true);
            }
            else
            {
                this.player.anims.play('jump', true);
            }
        }     

        // Jumping
        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor())
        {
            this.player.body.setVelocityY(-400);
            this.player.anims.play('jump', true);
            this.sound.play("jumpSound");
        }
    }

    updatePhysics(): void {

    }

    updatePlayer(): void {

    }

    processInput(): void {

    }

    collectGem (sprite, tile): boolean
    {
        this.world.layer05. removeTileAt(tile.x, tile.y);
        this.sound.play("gemSound");

        return false;
    }

    collectKey (sprite, tile): boolean
    {
        this.world.layer05.removeTileAt(tile.x, tile.y);
        this.sound.play("keySound");

        return false;
    }
}

export class PlayerBox {
    isInSpaceShip : boolean;
    isTouchingSpring: boolean;
    isFacingRight: boolean;
    constructor(isInSpaceShip: boolean, isTouchingSpring: boolean, isFacingRight: boolean) {
        this.isInSpaceShip = isInSpaceShip;
        this.isTouchingSpring = isTouchingSpring;
        this.isFacingRight = isFacingRight;
    }
    playerGun: Phaser.GameObjects.Sprite;
    bullet: Phaser.GameObjects.Sprite;
    bullets: Phaser.GameObjects.Group;
    bulletTime: number = 0;
    bulletDrawOffsetX: number = 6;
    bulletDrawOffsetY: number = 8;
    hurtTime: number = 0;
}

export class EnemyBox {
    sprite: Phaser.GameObjects.Sprite;
    isFacingRight: boolean;
    enemyType: string;
}

export class World {
    map: Phaser.Tilemaps.Tilemap;
    //tileset;
    layer01: Phaser.Tilemaps.StaticTilemapLayer;
    layer03: Phaser.Tilemaps.StaticTilemapLayer;
    layer04: Phaser.Tilemaps.StaticTilemapLayer;
    layer05: Phaser.Tilemaps.DynamicTilemapLayer;
    layer06: Phaser.Tilemaps.StaticTilemapLayer;
    layer07: Phaser.Tilemaps.DynamicTilemapLayer;
    layer02: Phaser.Tilemaps.StaticTilemapLayer;
    isWorldLoaded: boolean;
    sky: Phaser.GameObjects.TileSprite;
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

    bulletTouchingEnemyHandler(enemy, bullet): void {

        enemy.kill();
        bullet.kill();
        //if (!this.playerBox.isInSpaceShip && !this.playerBox.isTouchingSpring) {
            //if(springSound.)
            //if (tile.alpha > 0) {
            //player.body.velocity.y = -650;
            this.springSound.play();
            //this.playerBox.isTouchingSpring = true;
        //}
    }

    bulletTouchingImpassableLayerHandler(bullet, layer): void {

        bullet.kill();
    }

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

  