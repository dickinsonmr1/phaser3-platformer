/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @license      Digitsensitive
 */

 /// <reference path="../phaser.d.ts"/>

import "phaser";

export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  private skySprite: Phaser.GameObjects.TileSprite;

  world: World;

  // player selection
  playerPrefixes = ['alienBeige', 'alienBlue', 'alienGreen', 'alienPink', 'alienYellow'];
  selectedPlayerIndex = 0;
  
  // player stuff
  player: Phaser.GameObjects.Sprite; // player instance
  playerSpaceShip: Phaser.GameObjects.Sprite;
  playerBox: PlayerBox;

  enemy;
  enemies : Phaser.GameObjects.Group;
  enemiesPhysics: Phaser.GameObjects.Group;
  enemiesNonGravity: Phaser.GameObjects.Group;

    // audio
    jumpsound;
    gemSound;
    keySound;
    springSound;
    laserSound;
    hurtSound;
                
      
  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {

    this.loadAudio();
    this.loadSprites();
    this.loadTileMaps();

    this.load.image('logo', './assets/sample/phaser.png');
    this.load.image('sky', './assets/sample/colored_grass.png');
    
    
  }

  loadAudio(): void {
    this.load.audio('jump', './assets/audio/jump.wav');
    this.load.audio('gemSound', './assets/audio/coin.wav');
    this.load.audio('key', './assets/audio/key.wav');
    this.load.audio('springSound', './assets/audio/spring.wav');
    this.load.audio('laser', './assets/audio/laser5.ogg');
    this.load.audio('hurt', './assets/audio/hurt.wav');
  }

  loadSprites(): void {
        // spritesheets for game objects (not in the game map)
        this.load.atlasXML('enemySprites', './assets/sprites/enemies/enemies.png', './assets/sprites/enemies/enemies.xml');
        this.load.atlasXML('tileObjectSprites', './assets/sprites/objects/spritesheet_complete.png', './assets/sprites/objects/spritesheet_complete.xml');
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
    this.phaserSprite = this.add.sprite(400, 300, "logo");
    //this.skySprite = this.add.sprite(0, 0, 'sky');

    this.enemies = this.add.group();
    this.enemiesPhysics = this.add.group();  // removed 324
    this.enemiesNonGravity = this.add.group();

    this.createPlayer();

    this.world = this.createWorld('level1');
  }

  createAudio(): void {
    /*
    this.jumpsound = this.add.audio('jump');
    this.gemSound = this.add.audio('gemSound');
    this.keySound = this.add.audio('key');
    this.springSound = this.add.audio('springSound');
    this.springSound.allowMultiple = false;
    this.laserSound = this.add.audio('laser');
    this.laserSound.allowMultiple = true;
    this.hurtSound = this.add.audio('hurt');
    this.hurtSound.allowMultiple = false;
    */
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

        var tileSets = [tileSet, itemsTileSet, groundTileSet, enemiesTileSet, requestTileSet];
        
         // background layer
        var groundTileSet = world.map.addTilesetImage('spritesheet_ground_64x64', 'ground');
        world.layer01 = world.map.createStaticLayer('layer01-background-passable', tileSets, 0, 0, );
         world.layer01.alpha = 1.0;
         //world.layer01.resizeWorld();
 
         // non-passable blocks layer
         world.layer02 = world.map.createStaticLayer('layer02-nonpassable', tileSets, 0, 0);
         world.layer02.alpha = 1.0;

         /*
         //map.setCollisionBetween(0, 133, true, layer02, true);
         world.map.setCollisionBetween(0, 2000, true, world.layer02, true);
         //map.setCollisionBetween(158, 400, true, layer02, true);
 
         world.layer02.resizeWorld();
         world.layer02.debug = false;
         //map.setCollision();
         */

         //  Un-comment this on to see the collision tiles
         //layer.debug = true;
         //layer2.debug = true;

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
        world.layer05 = world.map.createStaticLayer('layer05-collectibles', tileSets, 0, 0);
        world.layer05.alpha = 1.0;//0.75;

        world.layer06 = world.map.createStaticLayer('layer06-gameobjects', tileSets, 0, 0);
        world.layer06.alpha = 0.0;//0.75;

        return world;
    }

    createPlayer(): Phaser.GameObjects.Sprite {
        var player = this.add.sprite(64, 64, 'playerSprites', 'alienBlue_front.png');
        player.setScale(Constants.playerDrawScale, Constants.playerDrawScale);
        player.setOrigin(.5, .5);

        return player;
    }

  update(): void {

  }

  updatePhysics(): void {

  }

  updatePlayer(): void {

  }
}



export class Constants {
  public static get tileKeyBlueKey(): number { return 141; }
  public static get tileKeyGemGreen(): number { return 142; }
  public static get tileKeyGemRed(): number { return 157; }
  public static get tileKeyGemYellow(): number { return 134; }
  public static get tileKeyGemBlue(): number { return 149; }
  public static get tileKeySpring(): number { return 266; }
  public static get enemySpeed(): number {return 200;}
  public static get playerDrawScale(): number {return 0.5;}
  public static get enemyDrawScale(): number {return 1;}
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
  layer05: Phaser.Tilemaps.StaticTilemapLayer;
  layer06: Phaser.Tilemaps.StaticTilemapLayer;
  layer07: Phaser.Tilemaps.StaticTilemapLayer;
  layer02: Phaser.Tilemaps.StaticTilemapLayer;
  isWorldLoaded: boolean;
  sky: Phaser.GameObjects.TileSprite;
}

export class HUDComponent {
  hudGroup: Phaser.GameObjects.Group;
  playerHudIcon: Phaser.GameObjects.Image;
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

  