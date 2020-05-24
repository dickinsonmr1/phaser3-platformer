
/// <reference path="../phaser.d.ts"/>

import { Constants } from "../constants";
import "phaser";
import { MainScene } from "../scenes/mainScene";
import { Player } from "../player";
import { Enemy } from "../enemy";
import { Spring } from "../gameobjects/spring";
import { Checkpoint } from "../gameobjects/checkpoint";

export class World {
    map: Phaser.Tilemaps.Tilemap;
    
    private layer01: Phaser.Tilemaps.StaticTilemapLayer;
    private layer03: Phaser.Tilemaps.StaticTilemapLayer;
    private layer03A: Phaser.Tilemaps.StaticTilemapLayer;
    private layer04: Phaser.Tilemaps.StaticTilemapLayer;
    private layer05: Phaser.Tilemaps.DynamicTilemapLayer;
    private layer06: Phaser.Tilemaps.DynamicTilemapLayer ;
    private layer07: Phaser.Tilemaps.DynamicTilemapLayer;
    private layer02: Phaser.Tilemaps.DynamicTilemapLayer;
    public backgroundColor: string;

    isWorldLoaded: boolean;
    sky: Phaser.GameObjects.TileSprite;

    scene: MainScene

    constructor(scene: MainScene){
        this.scene = scene;
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    createWorld(worldName: string, skyName: string, backgroundColor: string, player: Player): void {
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
        this.backgroundColor = backgroundColor
        //this.sky = this.scene.add.tileSprite(0, 0, 20480, 1024, skyName);
        //this.sky.setDepth();   //this.scene.skySprite;

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
        this.layer05.setTileIndexCallback(
            [
                Constants.tileKeyGemRed,
                Constants.tileKeyGemGreen,
                Constants.tileKeyGemYellow,
                Constants.tileKeyGemBlue
            ],
            this.scene.collectGem, this.scene);

        this.layer05.setTileIndexCallback(Constants.tileKeyBlueKey, this.scene.collectKey, this.scene);        
        this.layer05.setTileIndexCallback(Constants.tileKeyBattery, this.scene.collectBattery, this.scene);    


        //open door 236

        this.layer06 = this.map.createDynamicLayer('layer06-gameobjects', tileSets, 0, 0);
        this.layer06.alpha = 0.0;

        this.layer06.forEachTile(tile => {
            if(tile.index == Constants.tileKeySpring)
            {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                var spring = new Spring({
                    scene: this.scene,
                    x: x,
                    y: y,
                    key: "springLoaded"
                    });        
                spring.init("spring0", "spring1");
                this.scene.springs.push(spring);

                this.layer06.removeTileAt(tile.x, tile.y);
            }

            if(tile.index == Constants.tileOpenDoor)
            {
                // TODO: add door
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let spring = new Spring({
                    scene: this.scene,
                    x: x,
                    y: y,
                    key: "springLoaded"
                    });        
                spring.init("spring0", "spring1");
                this.scene.springs.push(spring);

                this.layer06.removeTileAt(tile.x, tile.y);
            }

            if(tile.index == Constants.tileGreenFlagDown)
            {
                // TODO: add door
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let flag = new Checkpoint({
                    scene: this.scene,
                    x: x,
                    y: y,
                    key: "flagGreenIdle"
                    });        
                    flag.init("flagGreenIdle", "flagGreenWave");
                this.scene.flags.push(flag);

                this.layer06.removeTileAt(tile.x, tile.y);
            }
        })

        this.layer05.setTileIndexCallback(
            [
                Constants.tileYellowFlagDown,
                Constants.tileGreenFlagDown,
                Constants.tileBlueFlagDown,
                Constants.tileRedFlagDown
            ],
            this.scene.activateCheckpoint,
            this.scene);

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

                var randomNumber = this.getRandomInt(2);

                switch(randomNumber)
                {
                    case 0:
                        var enemy = new Enemy({
                            scene: this.scene,
                            x: x,
                            y: y - 50,
                            key: "enemy01-Idle",
                            drawScale: 2,
                            enemyOffsetY: 10,
                            defaultFacingRight: false,
                            });        
                        enemy.init("enemy01-Idle", "enemy01-Walk", "enemy01-Dead");
                        this.scene.enemies.push(enemy);
                        break;
                        
                    case 555:
                        var enemy = new Enemy({
                            scene: this.scene,
                            x: x,
                            y: y,
                            key: "enemy02-Idle",
                            drawScale: 0.5,
                            enemyOffsetY: -30,
                            defaultFacingRight: true,
                            });        
                        enemy.init("enemy02-Idle", "enemy02-Walk", "enemy02-Dead");
                        this.scene.enemies.push(enemy);
                        break;

                    case 1:                                
                        var enemy = new Enemy({
                            scene: this.scene,
                            x: x,
                            y: y - 50,
                            key: "enemy03-Idle",
                            drawScale: 2,
                            enemyOffsetY: 10,
                            defaultFacingRight: false,
                            });        
                        enemy.init("enemy03-Idle", "enemy03-Walk", "enemy03-Dead");
                        this.scene.enemies.push(enemy);
                        break;
                }

                this.layer07.removeTileAt(tile.x, tile.y);
            }
        });
      
        this.scene.physics.add.collider(player, this.layer07);
        this.scene.physics.add.collider(player, this.scene.enemies, this.scene.playerTouchingEnemiesHandler);
        this.scene.physics.add.collider(player, this.scene.springs, this.scene.playerTouchingSpringHandler);
        this.scene.physics.add.collider(player, this.scene.flags, this.scene.playerTouchingCheckpointHandler);
        this.scene.physics.add.collider(this.scene.enemies, this.scene.springs, this.scene.enemyTouchingSpringHandler);
        this.scene.physics.add.collider(this.scene.enemies, this.layer02);
        this.scene.physics.add.collider(this.scene.enemies, this.scene.enemies, this.scene.enemyTouchingEnemyHandler);

        
        this.layer01.setDepth(1);
        this.layer02.setDepth(2);
        player.setDepth(3)
        this.layer07.setDepth(4);
        this.layer05.setDepth(5);
        this.layer03.setDepth(6);
        this.layer06.setDepth(7);
        this.layer04.setDepth(8);

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