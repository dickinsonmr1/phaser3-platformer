
/// <reference path="../../../node_modules/phaser/types/phaser.d.ts"/>

import { Constants, ForceFieldColor } from "../constants";
import "phaser";
import { MainScene } from "../scenes/mainScene";
import { Player } from "../../gameobjects/player";
import { Enemy, EnemyType } from "../../gameobjects/enemy";
import { Spring } from "../../gameobjects/spring";
import { Portal } from "../../gameobjects/portal";
import { Checkpoint } from "../../gameobjects/checkpoint";
import { Switch } from "../../gameobjects/switch";
import { Spaceship } from "../../gameobjects/spaceship";

export class World {
    map: Phaser.Tilemaps.Tilemap;
    
    private layer01: Phaser.Tilemaps.TilemapLayer;
    private layer02: Phaser.Tilemaps.TilemapLayer;
    private layer03: Phaser.Tilemaps.TilemapLayer;
    private layer04: Phaser.Tilemaps.TilemapLayer;
    private layer05: Phaser.Tilemaps.TilemapLayer;

    public backgroundColor: string;

    private static get skyOffsetY(): number{return 512;}  

    isWorldLoaded: boolean;
    sky: Phaser.GameObjects.TileSprite;
    skyName: string;

    totalEnemies: number = 0;
    totalGems: number = 0;

    scene: MainScene

    constructor(scene: MainScene){
        this.scene = scene;
    }

    getLayer02(): Phaser.Tilemaps.TilemapLayer {
        return this.layer02;
    } 

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    createWorld(worldName: string, player: Player, otherPlayers: Array<Player>, enemies: Array<Phaser.GameObjects.Sprite>): void {
        // using the Tiled map editor, here is the order of the layers from back to front:
        
        // layer00-image (not currently used)
        // layer01-background-passable
        // layer02-nonpassable        
        // layer03-gameobjects        
        // (+ player, enemies, spaceship, items)
        // layer04-foreground-passable-opaque
        // layer05-foreground-passable-semitransparent
            // like water... one idea is to make this automatically move
                    
        // TODO: tilemaps (https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6)

        this.map = this.scene.add.tilemap(worldName);
        var compiledTileSet = this.map.addTilesetImage('compiled_64x64', 'compiledTiles');
        var completeTileSet = this.map.addTilesetImage('complete_64x64', 'completeTiles');

        this.backgroundColor = this.map.properties[0].value;
                
        this.skyName = this.map.properties[1].value;
        this.sky = this.scene.add.tileSprite(0, 0, 20480, 1024, this.skyName);  
        this.sky.setScale(1);
        this.sky.setDepth(Constants.depthSky);     

        var tileSets = [compiledTileSet, completeTileSet];
        
        // background layer
        this.layer01 = this.map.createLayer('layer01-background-passable', tileSets, 0, 0);
        this.layer01.alpha = 1.0;

        // non-passable blocks layer
        this.layer02 = this.map.createLayer('layer02-nonpassable', tileSets, 0, 0);
        this.layer02.alpha = 1.0;
        this.scene.physics.add.collider(player, this.layer02);       
        
        for (var i = 0; i < otherPlayers.length; i++) 
            this.scene.physics.add.collider(otherPlayers[i], this.layer02);        

        this.layer02.setCollisionByExclusion([-1],true);//, Constants.tileLockBlue]);
        this.layer02.setTileIndexCallback(Constants.tileLockBlue, this.scene.unlockDoor, this.scene);
        //this.layer02.setCollisionBetween(581, 625, false);
                   
        //---------------------------------------------------------------------------------------------------
        // FOREGROUND PASSABLE OPAQUE LAYER (front wall of a cave, plant, etc.)
        //---------------------------------------------------------------------------------------------------
        this.layer04 = this.map.createLayer('layer04-foreground-passable-opaque', tileSets, 0, 0);
        this.layer04.alpha = 1.0;
        this.scene.physics.add.overlap(player, this.layer04);

        for (var i = 0; i < otherPlayers.length; i++) 
            this.scene.physics.add.overlap(otherPlayers[i], this.layer04);

        this.layer04.setTileIndexCallback(Constants.tileTwoSpikesCeiling, this.scene.playerTouchingSpikesHandler, this.scene);
        this.layer04.setTileIndexCallback(Constants.tileTwoSpikesGround, this.scene.playerTouchingSpikesHandler, this.scene);
        this.layer04.setTileIndexCallback(Constants.tileThreeSpikesFloor, this.scene.playerTouchingSpikesHandler, this.scene);
        
        //---------------------------------------------------------------------------------------------------
        // foreground semi-transparent layer (water, lava, clouds, etc.)
        //---------------------------------------------------------------------------------------------------
        this.layer05 = this.map.createLayer('layer05-foreground-passable-semitransparent', tileSets, 0, 0);
        this.layer05.alpha = 0.5;
        this.scene.physics.add.overlap(player, this.layer05);
        
        for (var i = 0; i < otherPlayers.length; i++) 
            this.scene.physics.add.overlap(otherPlayers[i], this.layer05);

        this.layer05.setTileIndexCallback(Constants.tileWater, this.scene.inWater, this.scene);
        this.layer05.setTileIndexCallback(Constants.tileWaterTop, this.scene.inWater, this.scene);

        //---------------------------------------------------------------------------------------------------
        // gameobjects
        //---------------------------------------------------------------------------------------------------
        this.layer03 = this.map.createLayer('layer03-gameobjects', tileSets, 0, 0);
        this.layer03.alpha = 1.0;//0.75;

        var allEnemyTypes = [2967, 2953, 2939, 2925, 2911, 2924, 2910, 2896, 3077, 3063];
        var allPortalTiles = [Constants.portalBlueTile, Constants.portalGreenTile, Constants.portalYellowTile, Constants.portalRedTile];
        var allGemTiles = [Constants.tileKeyGemRed, Constants.tileKeyGemGreen, Constants.tileKeyGemYellow, Constants.tileKeyGemBlue];
        
        this.layer03.forEachTile(tile => {

            if(tile.index == Constants.playerBlueSpawnTile)
            {
                const x = tile.getCenterX();
                const y = tile.getCenterY();                
               
                player.x = x;
                player.y = y - 100;

                //this.layer06.removeTileAt(tile.x, tile.y);
            }
            else if(tile.index == Constants.playerSpaceShipSpawnTile)
            {
                const x = tile.getCenterX();
                const y = tile.getCenterY();
               
                var spaceship = new Spaceship({
                    scene: this.scene,
                    x: x,
                    y: y,
                    key: "spaceshipBlue"
                    });        
                    spaceship.init("spaceshipBlue", "spaceshipBlue_manned");
                this.scene.spaceShips.push(spaceship);

                this.layer03.removeTileAt(tile.x, tile.y);
            }
            else if(tile.index == Constants.tileKeySpring1 || tile.index == Constants.tileKeySpring2)
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

                this.layer03.removeTileAt(tile.x, tile.y);
            }
            else if(allPortalTiles.includes(tile.index))
            {
                // TODO: add door
                const x = tile.getCenterX();
                const y = tile.getCenterY();
                var key = "";
                var destinationWorld = "";
                switch(tile.index) {
                    case Constants.portalBlueTile:
                        key = "portalBlue";
                        destinationWorld = "world-01-01";
                        break;
                    case Constants.portalRedTile:
                        key = "portalRed";
                        destinationWorld = "world-02-02";
                        break;
                    case Constants.portalGreenTile:
                        key = "portalGreen";
                        destinationWorld = "world-04-02";
                        break;
                    case Constants.portalYellowTile:
                        key = "portalYellow";
                        destinationWorld = "world-04-03";
                        break;
                }
                let portal = new Portal({
                    scene: this.scene,
                    x: x,
                    y: y,
                    key: key
                    });        
                    portal.init(destinationWorld, tile.x, tile.y);
                this.scene.portals.push(portal);

                this.layer03.removeTileAt(tile.x, tile.y);
            }   
            else if(tile.index == Constants.tileYellowSwitchOff || tile.index == Constants.tileYellowSwitchOn) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let isInitiallyOn = (tile.index == Constants.tileYellowSwitchOn);
                var item = new Switch({
                    scene: this.scene,
                    x: x,
                    y: y,
                    key: "switchYellowOff"
                    });        
                item.init(ForceFieldColor.Yellow, "switchYellowOn", "switchYellowOff", isInitiallyOn);
                this.scene.switches.push(item);

                this.layer03.removeTileAt(tile.x, tile.y);
            }   
            else if(tile.index == Constants.tileBlueSwitchOff || tile.index == Constants.tileBlueSwitchOn) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let isInitiallyOn = (tile.index == Constants.tileBlueSwitchOn);
                var item = new Switch({
                    scene: this.scene,
                    x: x,
                    y: y,
                    key: "switchBlueOff"
                    });        
                item.init(ForceFieldColor.Blue, "switchBlueOn", "switchBlueOff", isInitiallyOn);
                this.scene.switches.push(item);

                this.layer03.removeTileAt(tile.x, tile.y);
            }   
            else if(tile.index == Constants.tileGreenSwitchOff || tile.index == Constants.tileGreenSwitchOn) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let isInitiallyOn = (tile.index == Constants.tileGreenSwitchOn);
                var item = new Switch({
                    scene: this.scene,
                    x: x,
                    y: y,
                    key: "switchGreenOff"
                    });        
                item.init(ForceFieldColor.Green, "switchGreenOn", "switchGreenOff", isInitiallyOn);
                this.scene.switches.push(item);

                this.layer03.removeTileAt(tile.x, tile.y);
            }   
            else if(tile.index == Constants.tileRedSwitchOff || tile.index == Constants.tileRedSwitchOn) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let isInitiallyOn = (tile.index == Constants.tileRedSwitchOn);
                var item = new Switch({
                    scene: this.scene,
                    x: x,
                    y: y,
                    key: "switchRedOff"
                    });        
                item.init(ForceFieldColor.Red, "switchRedOn", "switchRedOff", isInitiallyOn);
                this.scene.switches.push(item);

                this.layer03.removeTileAt(tile.x, tile.y);
            }   
            else if(tile.index == Constants.tileGreenFlagDown)
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

                this.layer03.removeTileAt(tile.x, tile.y);
            }
            else if(allEnemyTypes.includes(tile.index)) {
                var x = tile.getCenterX();
                var y = tile.getCenterY();

                let index = allEnemyTypes.indexOf(tile.index);
                //var randomNumber = 6;//this.getRandomInt(6);
                this.totalEnemies++;

                switch(index)
                {
                    case 0:
                        var enemy = new Enemy({
                            scene: this.scene,
                            enemyType: EnemyType.Stalker,
                            x: x,
                            y: y - 50,
                            key: "enemy01-Idle",
                            drawScale: 1.25,
                            enemyOffsetY: 10,
                            defaultFacingRight: false,
                            });        
                        enemy.init("enemy01-Idle", "enemy01-Walk", "enemy01-Dead");
                        this.scene.enemies.push(enemy);
                        break;
                        
                    case 1:
                        var enemy = new Enemy({
                            scene: this.scene,
                            enemyType: EnemyType.Stalker,
                            x: x,
                            y: y,
                            widthOverride: 128,
                            heightOverride: 128,
                            key: "enemy02-Idle",
                            drawScale: 0.5,
                            enemyOffsetY: 0,
                            defaultFacingRight: true,
                            });        
                        enemy.init("enemy02-Idle", "enemy02-Walk", "enemy02-Dead");
                        this.scene.enemies.push(enemy);
                        break;

                    case 2:                                
                        var enemy = new Enemy({
                            scene: this.scene,
                            enemyType: EnemyType.Stalker,
                            x: x,
                            y: y - 50,
                            //widthOverride: 128,
                            //heightOverride: 128,
                            key: "enemy03-Idle",
                            drawScale: 1.25,
                            enemyOffsetY: 10,
                            defaultFacingRight: false,
                            });        
                        enemy.init("enemy03-Idle", "enemy03-Walk", "enemy03-Dead");
                        this.scene.enemies.push(enemy);
                        break;

                    case 3:
                        var enemy = new Enemy({
                            scene: this.scene,
                            enemyType: EnemyType.Stalker,
                            x: x,
                            y: y - 50,
                            widthOverride: 128,
                            heightOverride: 32,
                            key: "enemy04-Idle",
                            drawScale: 0.75,
                            enemyOffsetY: 96,
                            defaultFacingRight: true,
                            });        
                        enemy.init("enemy04-Idle", "enemy04-Walk", "enemy04-Dead");
                        this.scene.enemies.push(enemy);
                        break;

                    case 4:
                        var enemy = new Enemy({
                            scene: this.scene,
                            enemyType: EnemyType.Stalker,
                            x: x,
                            y: y - 50,
                            widthOverride: 128,
                            heightOverride: 128,
                            key: "enemy05-Idle",
                            drawScale: 0.75,
                            enemyOffsetY: 0,
                            defaultFacingRight: true,
                            });        
                        enemy.init("enemy05-Idle", "enemy05-Walk", "enemy05-Dead");
                        this.scene.enemies.push(enemy);
                        break;

                    case 5:
                        var enemy = new Enemy({
                            scene: this.scene,
                            enemyType: EnemyType.Stalker,
                            x: x,
                            y: y - 50,
                            widthOverride: 48,
                            heightOverride: 48,
                            key: "enemy06-Idle",
                            drawScale: 1.5,
                            enemyOffsetY: 2,
                            defaultFacingRight: true,
                            });        
                        enemy.init("enemy06-Idle", "enemy06-Walk", "enemy06-Dead");
                        this.scene.enemies.push(enemy);
                        break;

                    default:
                        var enemy = new Enemy({
                            scene: this.scene,
                            enemyType: EnemyType.Stalker,
                            x: x,
                            y: y - 50,
                            widthOverride: 48,
                            heightOverride: 48,
                            key: "enemy07-Idle",
                            drawScale: 1.5,
                            enemyOffsetY: 2,
                            defaultFacingRight: false,
                            });        
                        enemy.init("enemy07-Idle", "enemy07-Walk", "enemy07-Dead");
                        this.scene.enemies.push(enemy);
                        break;
                }
                this.layer03.removeTileAt(tile.x, tile.y);
            }
            else if(allGemTiles.includes(tile.index)) {
                this.totalGems++;
            }
        })

        this.scene.physics.add.overlap(player, this.layer03);
        this.layer03.setTileIndexCallback(
            [
                Constants.tileKeyGemRed,
                Constants.tileKeyGemGreen,
                Constants.tileKeyGemYellow,
                Constants.tileKeyGemBlue
            ],
            this.scene.collectGem, this.scene);

        this.layer03.setTileIndexCallback(
            [
                Constants.tileGun1,
                Constants.tileGun2,
                Constants.tileGun3,
                Constants.tileGun4
            ],
            this.scene.collectWeapon, this.scene);

        this.layer03.setTileIndexCallback(Constants.tileKeyBlueKey, this.scene.collectKey, this.scene);        
        this.layer03.setTileIndexCallback(Constants.tileKeyBattery, this.scene.collectBattery, this.scene);    
        //open door 236
        this.layer03.setTileIndexCallback(Constants.tileOpenDoor, this.scene.activateDoorIcon, this.scene);
        this.layer03.setTileIndexCallback(Constants.tileHealth, this.scene.collectHealth, this.scene);
      
        for (var i = 0; i < otherPlayers.length; i++) 
            this.scene.physics.add.collider(player, otherPlayers[i]);

        this.scene.physics.add.overlap(player, this.scene.enemies, (player, enemy) => this.scene.playerTouchingEnemiesHandler(player, enemy));
        
        for (var i = 0; i < otherPlayers.length; i++) 
            this.scene.physics.add.overlap(otherPlayers[i], this.scene.enemies, (player, enemy) => this.scene.playerTouchingEnemiesHandler(player, enemy));

        this.scene.physics.add.overlap(player, this.scene.springs, (player, spring) => this.scene.playerTouchingSpringHandler(player, spring));
        this.scene.physics.add.overlap(player, this.scene.flags, (player, flag) => this.scene.playerTouchingCheckpointHandler(player, flag));
        this.scene.physics.add.overlap(player, this.scene.portals, (player, portal) => this.scene.playerTouchingPortalHandler(player, portal));
        this.scene.physics.add.overlap(player, this.scene.switches, (player, item) => this.scene.playerTouchingSwitchHandler(player, item));
        this.scene.physics.add.overlap(player, this.scene.spaceShips, (player, spaceship) => this.scene.playerTouchingSpaceshipHandler(player, spaceship));
        this.scene.physics.add.overlap(this.scene.enemies, this.scene.springs, (player, spring) => this.scene.enemyTouchingSpringHandler(player, spring));
        this.scene.physics.add.collider(this.scene.enemies, this.layer02);
        this.scene.physics.add.collider(this.scene.enemies, this.scene.enemies, (enemy1, enemy2) => this.scene.enemyTouchingEnemyHandler(enemy1, enemy2));        
        
        if(this.scene.spaceShips != null) {
            this.scene.physics.add.collider(this.scene.spaceShips, this.layer02);
            this.scene.physics.add.collider(this.scene.enemies, this.scene.spaceShips, (enemy, spaceship) => this.scene.spaceshipTouchingEnemyHandler(enemy, spaceship));

            var spaceShipLaserBeams = new Array<Phaser.GameObjects.Sprite>();
            for(var i = 0; i < this.scene.spaceShips.length; i++) {
                spaceShipLaserBeams.push(this.scene.spaceShips[i].laserBeam);
            }
            this.scene.physics.add.overlap(this.scene.enemies, spaceShipLaserBeams, (enemy, laserBeam) => this.scene.spaceshipLaserBeamTouchingEnemyHandler(enemy, laserBeam));
        }            

        this.layer01.setDepth(Constants.depthLayer01);
        this.layer02.setDepth(Constants.depthLayer02);
        this.scene.springs.forEach(x => x.setDepth(Constants.depthSprings));
        this.scene.portals.forEach(x => x.setDepth(Constants.depthPortals));        

        player.setDepth(Constants.depthPlayer);

        for (var i = 0; i < otherPlayers.length; i++) 
            otherPlayers[i].setDepth(Constants.depthPlayer);

        this.scene.enemies.forEach(x => x.setDepth(Constants.depthEnemies));
        
        player.playerGun.setDepth(Constants.depthPlayer);

        for (var i = 0; i < otherPlayers.length; i++) 
            otherPlayers[i].playerGun.setDepth(Constants.depthPlayer);

        for (var i = 0; i < this.scene.spaceShips.length; i++) 
            this.scene.spaceShips[i].setDepth(Constants.depthPlayer);
                        
        this.layer03.setDepth(Constants.depthLayer03);
        this.layer04.setDepth(Constants.depthLayer04);
        this.layer05.setDepth(Constants.depthLayer05);

        //this.scene.expiringMessagesGroup.setDepth(Constants.depthExpiringMessages); 

        player.bullets = this.scene.physics.add.group({
            allowGravity: false
        })
        player.bullets.setDepth(Constants.depthBullets);

        this.scene.physics.add.collider(this.scene.enemies, player.bullets, (enemy, bullet) => this.scene.bulletTouchingEnemyHandler(enemy, bullet));
        this.scene.physics.add.collider(this.scene.otherPlayers, player.bullets, (otherPlayer, bullet) => this.scene.bulletTouchingOtherPlayerHandler(otherPlayer, bullet));
        this.scene.physics.add.collider(player.bullets, this.layer02, (bullet, layer) => this.scene.bulletTouchingImpassableLayerHandler(bullet, layer));    
    }

    updateSky(camera: Phaser.Cameras.Scene2D.Camera): void {
        this.sky.setX(camera.x);
        this.sky.setY(camera.y + World.skyOffsetY);
        this.sky.setTilePosition(-(camera.scrollX * 0.25), -(camera.scrollY * 0.00));
    }

    removeTileFromOtherClient (tileX: number, tileY: number, layer: number): void {
        if(layer == 2)
            this.layer02.removeTileAt(tileX, tileY);
        else if(layer == 3)
            this.layer03.removeTileAt(tileX, tileY);

        console.log('removeTileFromOtherClient');
    }

    toggleForceFields(color: ForceFieldColor, enabled: boolean) {

        var eligibleTileIndexes = new Array<integer>();
        switch(color) {
            case ForceFieldColor.Yellow:
                eligibleTileIndexes.push(Constants.tileYellowEnergyBeamVertical, Constants.tileYellowEnergyBeamHorizontal);
                break;
            case ForceFieldColor.Blue:
                eligibleTileIndexes.push(Constants.tileBlueEnergyBeamVertical, Constants.tileBlueEnergyBeamHorizontal);
                break;
            case ForceFieldColor.Green:
                eligibleTileIndexes.push(Constants.tileGreenEnergyBeamVertical, Constants.tileGreenEnergyBeamHorizontal);
                break;
            case ForceFieldColor.Red:
                eligibleTileIndexes.push(Constants.tileRedEnergyBeamVertical, Constants.tileRedEnergyBeamHorizontal);
                break;
        }

        this.layer02.setCollision(eligibleTileIndexes, enabled);

        this.layer02.forEachTile(tile => {
            if(eligibleTileIndexes.includes(tile.index)) {
                if(enabled)
                    tile.setAlpha(1);
                else
                    tile.setAlpha(0.1);
            }
        });
    }
    
    /*
    turnOffForceFields(): void {
        this.layer02.setCollision(Constants.tileYellowEnergyBeamVertical, false);
        this.layer02.setCollision(Constants.tileYellowEnergyBeamHorizontal, false);

        this.layer02.forEachTile(tile => {
            if(tile.index == Constants.tileYellowEnergyBeamHorizontal ||
                tile.index == Constants.tileYellowEnergyBeamVertical) {
                tile.setAlpha(0.1);
            }
        });
    }

    turnOnForceFields(): void
    {
        this.layer02.setCollision(Constants.tileYellowEnergyBeamVertical, true);      
        this.layer02.setCollision(Constants.tileYellowEnergyBeamHorizontal, true);      
                        
        this.layer02.forEachTile(tile => {
            if(tile.index == Constants.tileYellowEnergyBeamHorizontal ||
                tile.index == Constants.tileYellowEnergyBeamVertical)
            {
                tile.setAlpha(1);
            }
        });
    }
    */

    removeTileAndNotifyServer (tileX: number, tileY: number): void {
        this.layer03.removeTileAt(tileX, tileY);
        this.scene.sceneController.socketClient.socket.emit("tileRemoval", {tileX: tileX, tileY: tileY, layer: 3});
    }

    collectKey(tileX: number, tileY: number): void {
        this.layer03.removeTileAt(tileX, tileY);
        this.scene.sceneController.socketClient.socket.emit("tileRemoval", {tileX: tileX, tileY: tileY, layer: 3});
    }

    unlockDoor(tileX: number, tileY: number): void {
        this.layer02.removeTileAt(tileX, tileY);
        this.scene.sceneController.socketClient.socket.emit("tileRemoval", {tileX: tileX, tileY: tileY, layer: 2});
    }
}