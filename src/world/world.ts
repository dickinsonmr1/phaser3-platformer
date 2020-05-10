import { Constants } from "../constants";
import "phaser";
import { MainScene } from "../scenes/mainScene";
import { Player } from "../player";
import { Enemy } from "../enemy";

export class World {
    map: Phaser.Tilemaps.Tilemap;
    
    private layer01: Phaser.Tilemaps.StaticTilemapLayer;
    private layer03: Phaser.Tilemaps.StaticTilemapLayer;
    private layer03A: Phaser.Tilemaps.StaticTilemapLayer;
    private layer04: Phaser.Tilemaps.StaticTilemapLayer;
    private layer05: Phaser.Tilemaps.DynamicTilemapLayer;
    private layer06: Phaser.Tilemaps.StaticTilemapLayer;
    private layer07: Phaser.Tilemaps.DynamicTilemapLayer;
    private layer02: Phaser.Tilemaps.DynamicTilemapLayer;
    isWorldLoaded: boolean;
    sky: Phaser.GameObjects.TileSprite;

    scene: MainScene

    constructor(scene: MainScene){
        this.scene = scene;
    }

    createWorld(worldName, player: Player): void {
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
        this.sky = this.scene.skySprite;

        this.map = this.scene.add.tilemap(worldName);
        //map.addTilesetImage('sky', 'backgroundImageLayer');
        var tileSet = this.map.addTilesetImage('spritesheet_tiles_64x64', 'tiles');
        var itemsTileSet = this.map.addTilesetImage('spritesheet_items_64x64', 'items');
        var groundTileSet = this.map.addTilesetImage('spritesheet_ground_64x64', 'ground');
        var enemiesTileSet = this.map.addTilesetImage('spritesheet_enemies_64x64', 'enemyTiles');
        var requestTileSet = this.map.addTilesetImage('platformer-requests-sheet_64x64', 'platformerRequestTiles');
        var industrialTileSet = this.map.addTilesetImage('platformerPack_industrial_tilesheet_64x64', 'industrialTiles');

        var tileSets = [tileSet, itemsTileSet, groundTileSet, enemiesTileSet, requestTileSet, industrialTileSet];
        
        // background layer
        this.layer01 = this.map.createStaticLayer('layer01-background-passable', tileSets, 0, 0, );
        this.layer01.alpha = 1.0;

        // non-passable blocks layer
        this.layer02 = this.map.createDynamicLayer('layer02-nonpassable', tileSets, 0, 0);
        this.layer02.alpha = 1.0;
        this.scene.physics.add.collider(player, this.layer02);
        this.layer02.setCollisionByExclusion([-1],true);//, Constants.tileLockBlue]);
        this.layer02.setTileIndexCallback(Constants.tileLockBlue, this.scene.unlockDoor, this.scene);


        

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
        this.layer03 = this.map.createStaticLayer('layer03-foreground-passable-semitransparent', tileSets, 0, 0);
        this.layer03.alpha = 0.5;
        this.scene.physics.add.overlap(player, this.layer03);
        this.layer03.setTileIndexCallback(Constants.tileWater, this.scene.inWater, this.scene);
        this.layer03.setTileIndexCallback(Constants.tileWaterTop, this.scene.inWater, this.scene);
        
        //---------------------------------------------------------------------------------------------------
        // FOREGROUND PASSABLE OPAQUE LAYER (front wall of a cave, plant, etc.)
        //---------------------------------------------------------------------------------------------------
        this.layer04 = this.map.createStaticLayer('layer04-foreground-passable-opaque', tileSets, 0, 0);
        this.layer04.alpha = 1.0;

        //---------------------------------------------------------------------------------------------------
        // COLLECTIBLES
        //---------------------------------------------------------------------------------------------------
        this.layer05 = this.map.createDynamicLayer('layer05-collectibles', tileSets, 0, 0);
        this.layer05.alpha = 1.0;//0.75;

        this.scene.physics.add.overlap(player, this.layer05);
        this.layer05.setTileIndexCallback(Constants.tileKeyGemRed, this.scene.collectGem, this.scene);
        this.layer05.setTileIndexCallback(Constants.tileKeyGemGreen, this.scene.collectGem, this.scene);
        this.layer05.setTileIndexCallback(Constants.tileKeyGemYellow, this.scene.collectGem, this.scene);
        this.layer05.setTileIndexCallback(Constants.tileKeyGemBlue, this.scene.collectGem, this.scene);
        this.layer05.setTileIndexCallback(Constants.tileKeyBlueKey, this.scene.collectKey, this.scene);        

        this.layer06 = this.map.createStaticLayer('layer06-gameobjects', tileSets, 0, 0);
        this.layer06.alpha = 0.0;

        this.layer06.forEachTile(tile => {
            if(tile.index == Constants.tileKeySpring)
            {
                const x = tile.getCenterX();
                const y = tile.getCenterY();
                const spring = this.scene.springs.create(x, y, "sprung");
                this.scene.physics.world.enable(spring);   
                spring.body.moves = false;
                spring.body.immovable = true;

                this.scene.add.existing(spring);
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
        this.layer07 = this.map.createDynamicLayer('layer07-enemies', tileSets, 0, 0);
        this.layer07.alpha = 0.1;
        this.layer07.forEachTile(tile => {
            if(allEnemyTypes.includes(tile.index)) {
                var x = tile.getCenterX();
                var y = tile.getCenterY();

                var enemy = new Enemy({
                    scene: this.scene,
                    x: x,
                    y: y,
                    key: "slimeGreen_squashed"
                    });        
                enemy.init("enemyIdle", "enemyWalk", "enemyDead");
                //this.scene.enemies.create(x, y, "ghost");
                //enemy.currentScene = this.scene;
                this.scene.physics.world.enable(enemy);   
                this.scene.add.existing(enemy);
                this.scene.enemies.push(enemy);

                this.layer07.removeTileAt(tile.x, tile.y);
            }
        });
      
        this.scene.physics.add.collider(player, this.layer07);
        this.scene.physics.add.collider(player, this.scene.enemies, this.scene.playerTouchingEnemiesHandler);
        this.scene.physics.add.collider(player, this.scene.springs, this.scene.playerTouchingSpringHandler);
        this.scene.physics.add.collider(this.scene.enemies, this.layer02);
        this.scene.physics.add.collider(this.scene.enemies, this.scene.enemies, this.scene.enemyTouchingEnemyHandler);

        player.bullets = this.scene.physics.add.group({
            allowGravity: false
        })

        this.scene.physics.add.collider(this.scene.enemies, player.bullets, this.scene.bulletTouchingEnemyHandler);
        this.scene.physics.add.collider(player.bullets, this.layer02, this.scene.bulletTouchingImpassableLayerHandler);                        
    }

    private addColliderWithDynamicLayer(player: Player, layer: Phaser.Tilemaps.DynamicTilemapLayer) {
        this.scene.physics.add.collider(player, layer);
    }

    private addColliderWithStaticLayer(player: Player, layer: Phaser.Tilemaps.StaticTilemapLayer) {
        this.scene.physics.add.collider(player, layer);
    }

    updateSky(camera: Phaser.Cameras.Scene2D.Camera): void {
        this.sky.setX(0);
        this.sky.setY(768);
        this.sky.setTilePosition(-(camera.scrollX * 0.25), -(camera.scrollY * 0.05));
    }

    collectGem (tileX: number, tileY: number): void
    {
        this.layer05.removeTileAt(tileX, tileY);
    }

    collectKey(tileX: number, tileY: number): void {
        this.layer05.removeTileAt(tileX, tileY);
    }

    unlockDoor(tileX: number, tileY: number): void {
        this.layer02.removeTileAt(tileX, tileY);
    }
}