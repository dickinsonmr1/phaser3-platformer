/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../../../node_modules/phaser/types/phaser.d.ts"/>

import "phaser";
import { Player } from "../../gameobjects/player";
import { Weapon } from "../../gameobjects/weapon";
import { Constants } from "../constants";
import { Bullet } from "../../gameobjects/bullet";
import { World } from "../world/world";
import { ExpiringText } from "../../gameobjects/expiringText";
import { Spaceship } from "../../gameobjects/spaceship";
import { RocketLauncher, PulseCharge, LaserRepeater, LaserPistol } from "../../gameobjects/weapon";
import { SceneController } from "./sceneController";
import { Animations } from "./animations";
import { Socket } from "socket.io-client";
import { PlayerInterface } from "../../gameobjects/playerInterface";
import { ExpiringMessagesComponent } from "../../gameobjects/expiringMessagesComponent";

export class MainScene extends Phaser.Scene {
    
    sceneController: SceneController;
    public skySprite: Phaser.GameObjects.TileSprite;

    world: World;    
    particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    weaponHitParticleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
   
    player: Player;
    playerInterface: PlayerInterface;

    otherPlayers: Array<Player>;
    spaceShips: Array<Spaceship>;

    public otherBullets: Phaser.GameObjects.Group;//<Bullet>;

    enemies: Array<Phaser.GameObjects.Sprite>;

    springs: Array<Phaser.GameObjects.Sprite>;
    flags: Array<Phaser.GameObjects.Sprite>;
    portals: Array<Phaser.GameObjects.Sprite>;
    switches: Array<Phaser.GameObjects.Sprite>;

    cursors: Phaser.Types.Input.Keyboard.CursorKeys;              
    zoomInKey: Phaser.Input.Keyboard.Key;
    zoomOutKey: Phaser.Input.Keyboard.Key;
    shootKey: Phaser.Input.Keyboard.Key;
    shootKey2: Phaser.Input.Keyboard.Key;
    pauseKey: Phaser.Input.Keyboard.Key;
    moveWaterKey: Phaser.Input.Keyboard.Key;
    jumpKey: Phaser.Input.Keyboard.Key;
    interactKey: Phaser.Input.Keyboard.Key;
    debugKey: Phaser.Input.Keyboard.Key;

    gamepad: Phaser.Input.Gamepad.Gamepad;

    worldName: string;
    isMultiplayer: boolean;

    gameTimeStarted: number;
    clock: Phaser.Time.Clock;

    //expiringMessagesGroup: Phaser.GameObjects.Group;
    expiringMessagesComponent: ExpiringMessagesComponent;
     
    constructor(sceneController: SceneController) {
        super({
            key: "MainScene",
            //active: true
            //map: {   events: 'events', audio: 'audio'}
        });
        this.gamepad = null;
        this.sceneController = sceneController;
    }

    init(data): void {
        console.log(data.id);
        this.worldName = data.worldName;
        this.isMultiplayer = data.isMultiplayer;
    }

    preload(): void {
        this.loadAudio();
        this.loadSprites();
        this.loadTileMaps();           
    }

    private loadAudio(): void {
        this.load.audio('jumpSound', './assets/audio/jump.wav');
        this.load.audio('gemSound', './assets/audio/coin.wav');
        this.load.audio('keySound', './assets/audio/key.wav');
        this.load.audio('springSound', './assets/audio/spring.wav');
        this.load.audio('laser1Sound', './assets/audio/laser5.ogg');
        this.load.audio('laser2Sound', './assets/audio/laser2.ogg');
        this.load.audio('laser3Sound', './assets/audio/gameover3.ogg');
        this.load.audio('laser4Sound', './assets/audio/explosion3.ogg');
        this.load.audio('hurtSound', './assets/audio/hurt.wav');
        this.load.audio('enemyHurtSound', './assets/audio/lowRandom.ogg');
        this.load.audio('enemyDeathSound', '/assets/audio/hit3.ogg');        
        this.load.audio('batterySound', '/assets/audio/upgrade3.ogg');        
        this.load.audio('healthSound', '/assets/audio/upgrade1.ogg');        
        this.load.audio('lowAmmoSound', '/assets/audio/hit4.ogg');       
        this.load.audio('noAmmoSound', '/assets/audio/fall3.ogg'); 
        this.load.audio('portalOpenSound', '/assets/audio/phaseJump3.ogg');      
        this.load.audio('portalCloseSound', '/assets/audio/phaserDown3.ogg');      
        this.load.audio('switchSound', '/assets/audio/switch_001.ogg');      
        this.load.audio('engineSound', '/assets/audio/engine5.ogg');     
        
        this.load.audio('shieldSound', '/assets/audio/mixkit-sci-fi-positive-notification-266.wav');     
        this.load.audio('shieldDrainSound', '/assets/audio/mixkit-game-warning-quick-notification-267.wav');     
        
        
        //this.load.audio('spaceshipLaserBeamSound', '/assets/audio/zapsplat_science_fiction_retro_laser_slow_rising_44827.mp3');      
        this.load.audio('spaceshipLaserBeamSound', '/assets/audio/science_fiction_laser_hypnotic_paralysing_beam.mp3');      
                
        //this.load.audio('warpSound', '/assets/audio/upgrade1.ogg');      
    }    

    private loadSprites(): void {
        // spritesheets for game objects (not in the game map)
        this.load.atlasXML('enemySprites', './assets/sprites/enemies/enemies.png', './assets/sprites/enemies/enemies.xml');
        this.load.atlasXML('enemySprites2', './assets/sprites/enemies/spritesheet_enemies.png', './assets/sprites/enemies/spritesheet_enemies.xml');
        this.load.atlasXML('enemySprites3', './assets/sprites/enemies/spritesheet_abstract_enemies.png', './assets/sprites/enemies/spritesheet_abstract_enemies.xml');

        this.load.atlasXML('completeSprites', './assets/sprites/objects/spritesheet_complete.png', './assets/sprites/objects/spritesheet_complete.xml');
        this.load.atlasXML('playerSprites', './assets/sprites/player/spritesheet_players.png', './assets/sprites/player/spritesheet_players.xml');
        this.load.atlasXML('alienShipSprites', './assets/sprites/ships/spritesheet_spaceships.png', './assets/sprites/ships/spritesheet_spaceships.xml');
        this.load.atlasXML('alienShipLaserSprites', './assets/sprites/ships/spritesheet_lasers.png', './assets/sprites/ships/spritesheet_lasers.xml');

        this.load.image('engineExhaust', './assets/sprites/ships/laserblue3.png');

        this.load.image('playerGunLaserPistol', './assets/sprites/player/raygun.png');
        this.load.image('playerGunLaserRepeater', './assets/sprites/player/raygunBig.png');
        this.load.image('playerGunPulseCharge', './assets/sprites/player/raygunPurple.png');
        this.load.image('playerGunRocketLauncher', './assets/sprites/player/raygunPurpleBig.png');

        this.load.image('playerGunLaser1', './assets/sprites/player/laserPurpleDot15x15.png');
        this.load.image('playerGunLaser2', './assets/sprites/player/laserPurple2.png');
        this.load.image('playerGunLaser3', './assets/sprites/player/laserGreenBurst.png');
        this.load.image('playerGunLaser4', './assets/sprites/player/rocket.png');
        this.load.image('playerRocket1', './assets/sprites/player/rocket_1.png');
        this.load.image('playerRocket2', './assets/sprites/player/rocket_2_small.png');

        this.load.image('playerShield', './assets/sprites/player/shield1.png');

        this.load.image('laserWhiteBurst', './assets/sprites/player/laserWhiteBurst_16x16.png');

        this.load.image('portalBlue', './assets/sprites/objects/portalBlue.png');
        this.load.image('portalRed', './assets/sprites/objects/portalRed.png');
        this.load.image('portalYellow', './assets/sprites/objects/portalYellow.png');
        this.load.image('portalGreen', './assets/sprites/objects/portalGreen.png');

        this.load.image('switchYellowOff', './assets/sprites/objects/switchYellowOff.png');
        this.load.image('switchYellowOn', './assets/sprites/objects/switchYellowOn.png');
        this.load.image('switchGreenOff', './assets/sprites/objects/switchGreenOff.png');
        this.load.image('switchGreenOn', './assets/sprites/objects/switchGreenOn.png');
        this.load.image('switchBlueOff', './assets/sprites/objects/switchBlueOff.png');
        this.load.image('switchBlueOn', './assets/sprites/objects/switchBlueOn.png');
        this.load.image('switchRedOff', './assets/sprites/objects/switchRedOff.png');
        this.load.image('switchRedOn', './assets/sprites/objects/switchRedOn.png');

        this.load.image('buttonX', './assets/sprites/hud/buttonX.png');

        this.load.image('world-01-03-sky', './assets/sprites/backgrounds/blue_grass.png');
        //this.load.image('world-02-01-sky', './assets/sprites/backgrounds/backgroundCastles.png');              
        this.load.image('world-02-01-sky', './assets/sprites/backgrounds/backgroundForest.png');              
    }

    private loadParticles(){

        var particles = this.add.particles('laserWhiteBurst');
        particles.setDepth(Constants.depthParticles);

        this.particleEmitter = particles.createEmitter({
            x: 0,
            y: 0,
            lifespan: 500,
            speed: 200,
            angle: { min: 0, max: 360, steps: 10 },
            scale: 1,
            gravityY: 200,
            blendMode: 'ADD',
            frequency: -1,
            alpha: {start: 0.8, end: 0.0},
        });

        var weaponHitParticles = this.add.particles('laserWhiteBurst');
        weaponHitParticles.setDepth(Constants.depthParticles);
        this.weaponHitParticleEmitter = weaponHitParticles.createEmitter({
            x: 0,
            y: 0,
            lifespan: 500,
            speed: { min: -400, max: 400 },
            tint: 0xff0000, 
            scale: 1,
            blendMode: 'ADD',
            frequency: -1,
            alpha: {start: 0.8, end: 0.0},
        });
    }

    private loadTileMaps(): void {
        this.load.tilemapTiledJSON(this.worldName, './assets/tilemaps/maps/' + this.worldName + '.json');

        this.load.image('completeTiles', './assets/tilemaps/tiles/complete_64x64.png');
        this.load.image('compiledTiles', './assets/tilemaps/tiles/compiled_64x64.png');
    }
    
    removeScene(): void {
        this.scene.remove('MainScene');
    }
    
    restart(): void {
        this.scene.restart();
    }

    create(): void {    

        Animations.createAnims(this.anims);
        this.loadParticles();
                
        this.enemies = new Array<Phaser.GameObjects.Sprite>();

        this.expiringMessagesComponent = new ExpiringMessagesComponent(this);
        this.expiringMessagesComponent.init();
        
        this.springs = new Array<Phaser.GameObjects.Sprite>();
        this.flags = new Array<Phaser.GameObjects.Sprite>();
        this.portals = new Array<Phaser.GameObjects.Sprite>();
        this.switches = new Array<Phaser.GameObjects.Sprite>();
        this.spaceShips = new Array<Spaceship>();

        this.otherPlayers = new Array<Player>();
        this.otherBullets = this.physics.add.group({
            allowGravity: false
        })
        this.otherBullets.setDepth(Constants.depthBullets);
       
        var playerId = 'player1';
        if(this.isMultiplayer) {
            var mySocketPlayer = this.sceneController.socketClient.getMyPlayer();
            playerId = mySocketPlayer.playerId;
        }

        this.player = new Player({
            scene: this,
            x: 20,
            y: 600,
            key: "player1",
            playerId: playerId,
            isMyPlayer: true
            });        
        this.player.init();
        this.playerInterface = new PlayerInterface({player: this.player, socket: this.getSocket()});

        this.sceneController.hudScene.setPlayerId(this.player.playerId);
        
        if(this.isMultiplayer) {
            var otherSocketPlayers = this.sceneController.socketClient.getOtherPlayers(mySocketPlayer.playerId);
            var offsetX = 0;
            for (var i = 0; i < otherSocketPlayers.length; i++) {
                
                offsetX += 100;
                var tempPlayer = new Player({
                    scene: this,
                    x: 100 + offsetX,
                    y: 600,
                    key: "player"+(i+1),
                    playerId: otherSocketPlayers[i].playerId,
                    isMyPlayer: false
                    });        
                tempPlayer.init();

                this.otherPlayers.push(tempPlayer);            
            }
        }
        
        //var color = '#CFEFFC';
        this.world = new World(this);
        this.world.createWorld(this.worldName, this.player, this.otherPlayers, this.enemies);

        this.setUpInput();
     
        this.cameras.main.startFollow(this.player, true, 1, 1, this.player.displayWidth / 2, this.player.displayHeight / 2);
        this.cameras.main.zoomTo(1, 2000);
        this.cameras.main.setBackgroundColor(this.world.backgroundColor);

        this.sceneController.mainSceneLoaded();

        this.clock = new Phaser.Time.Clock(this);

        this.scene.pause();
        this.scene.setVisible(false, "MainScene");
    }

    setUpInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.zoomInKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.zoomOutKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        this.shootKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.moveWaterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        this.debugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F2);
        
        this.playerInterface.addGamepadListeners(this);
    }

    fadeInCamera() {
        this.cameras.main.fadeIn(500);
    }

    fadeOutCamera() {
        this.cameras.main.fadeOut(500);
    }
    
    fadeOutToWhite() {
        let transitionTime = 1000;
        this.cameras.main.fadeOut(transitionTime, 255, 255, 255);
        this.cameras.main.zoomTo(5, transitionTime);
    }

    update(): void {

        this.world.updateSky(this.cameras.main);

        this.processInput();

        if(this.isMultiplayer) {            
            // process input from other players / sockets
            var otherPlayersFromSocketClient = this.sceneController.socketClient.players;        
            for (var i = 0; i < otherPlayersFromSocketClient.length; i++) {

                var otherPlayer = this.otherPlayers.find(item => item.playerId === otherPlayersFromSocketClient[i].playerId);            
                if(otherPlayer != null) {
                    // TODO: figure out how to indicate dirty bit for other player change
                    otherPlayer.x = otherPlayersFromSocketClient[i].x;
                    otherPlayer.y = otherPlayersFromSocketClient[i].y;
                    otherPlayer.flipX = otherPlayersFromSocketClient[i].flipX;
                    console.log('other player anim key: ' + otherPlayersFromSocketClient[i].animKey);
                    if(otherPlayersFromSocketClient[i].animKey != null)
                        otherPlayer.play(otherPlayersFromSocketClient[i].animKey, true);
                }
            }            
        }
        
    
        //for (var i = 0; i < this.otherPlayers.length; i++) 
            //this.otherPlayers[i].stand();

        //if(Phaser.Input.Keyboard.JustDown(this.debugKey) {
            //this.physics.config.Arcade.debug = false;
        //}

        this.player.update();        
        this.expiringMessagesComponent.update();
        
        if(this.isMultiplayer) {
            for (var i = 0; i < this.otherPlayers.length; i++) 
                this.otherPlayers[i].update();
        }
        /*
        var otherBulletsFromSocketClient = this.sceneController.socketClient.bullets;
        for (var i = 0; i < otherBulletsFromSocketClient.length; i++) {

            var otherPlayersBullets = this.otherPlayers.find(item => item.playerId === otherBulletsFromSocketClient[i].playerId);            
            if(otherPlayer != null) {
                otherPlayer.x = otherPlayersFromSocketClient[i].x;
                otherPlayer.y = otherPlayersFromSocketClient[i].y;
                otherPlayer.flipX = otherPlayersFromSocketClient[i].flipX;
            }
        }
        */

        this.enemies.forEach(enemy => { enemy.update(this.player.body.position.x, this.player.body.position.y) });
        this.springs.forEach(spring => { spring.update(); });
        this.portals.forEach(portal => { portal.update(); });
    }

    getSocket(): Socket {
        return this.sceneController.socketClient.socket;
    }

    updatePhysics(): void {

    }

    processInput(): void {
        
        if(Phaser.Input.Keyboard.JustDown(this.pauseKey) && !this.isMultiplayer) {
            this.input.keyboard.resetKeys();
            this.sceneController.pauseGame();
        }
             
        if(this.zoomInKey.isDown)
            this.cameras.main.zoom -= 0.01;
        
        if(this.zoomOutKey.isDown)
            this.cameras.main.zoom += 0.01;        

        if(this.moveWaterKey.isDown) {
            // debug stuff here    
        }

        this.playerInterface.processInput(this);
    }

    collectGem (sprite, tile): boolean {
        
        let scene = this.world.scene;
        scene.addExpiringText(scene, sprite.x, sprite.y + 64, Constants.gemScore.toString());
        //this.events.emit("expiringTextEmitted", sprite.x, sprite.y + 64, Constants.gemScore.toString());
        this.player.score += Constants.gemScore;
        
        this.world.removeTileAndNotifyServer(tile.x, tile.y);
        this.sound.play("gemSound", { volume: 0.4 });
        this.events.emit("gemCollected", ++this.player.gemsCollected);
        

        
        return true;
    }

    collectHealth (sprite, tile): boolean
    {
        this.world.removeTileAndNotifyServer(tile.x, tile.y);
        this.player.tryHeal();

        this.sound.play("healthSound");
        this.sceneController.hudScene.setInfoText("health restored", 2000);
        this.particleEmitter.explode(20, tile.pixelX + 32, tile.pixelY + 32);

        return true;
    }
    
    collectShield (sprite, tile): boolean
    {
        this.world.removeTileAndNotifyServer(tile.x, tile.y);
        this.player.tryRechargeShield();

        this.sound.play("shieldSound");
        this.sceneController.hudScene.setInfoText("shield recharged", 2000);
        //this.particleEmitter.explode(20, tile.pixelX + 32, tile.pixelY + 32);

        return true;
    }

    collectBattery (sprite, tile): boolean
    {
        this.world.removeTileAndNotifyServer(tile.x, tile.y);
        this.sound.play("batterySound");        

        return true;
    }

    collectWeapon (sprite, tile): boolean
    {
        var weapon: Weapon;
        switch(tile.index){
            case Constants.tileGun1:
                weapon = new LaserPistol();
                break;
            case Constants.tileGun2:
                weapon = new LaserRepeater();
                break;
            case Constants.tileGun3:
                weapon = new PulseCharge();
                break;
            case Constants.tileGun4:
                weapon = new RocketLauncher();
                break;
            default:
                weapon = new LaserPistol();
                break;
        };

        this.world.removeTileAndNotifyServer(tile.x, tile.y);
        this.sound.play("batterySound", { volume: 0.3 });

        this.particleEmitter.explode(20, tile.pixelX + 32, tile.pixelY + 32);

        this.player.reload(weapon);
        this.events.emit("weaponCollected", weapon.currentAmmo, weapon.weaponTextureName);

        this.sceneController.hudScene.setInfoText(weapon.weaponDisplayName + " acquired", 2000);

        if(this.isMultiplayer)
            this.getSocket().emit("weaponCollectedByPlayer");

        //this.addExpiringText(this, this.player.x, this.player.y, weapon.weaponDisplayName);

        return true;
    }

    activateCheckpoint (sprite, tile): boolean {
        this.world.removeTileAndNotifyServer(tile.x, tile.y);
        this.sound.play("gemSound");
        this.events.emit("gemCollected", this.player.gemsCollected++);

        return true;
    }

    activateDoorIcon (sprite, tile): boolean {
        //this.world.collectGem(tile.x, tile.y);
        this.sound.play("gemSound");
        //this.events.emit("gemCollected", this.player.gemsCollected++);

        return true;
    }

    inWater (player: Player, tile): boolean {
        player.isInWater = true;

        return true;
    }

    collectKey (sprite, tile): boolean {
        this.player.hasBlueKey = true;
        this.world.collectKey(tile.x, tile.y);
        this.sound.play("keySound");

        return true;
    }
     
    unlockDoor (player: Player, tile): boolean {
        if(player.hasBlueKey) {
            this.world.unlockDoor(tile.x, tile.y);
            this.sound.play("keySound");
        }
        return true;
    }

    playerTouchingSpringHandler(player: any, spring: any): void {
        if(!player.isInSpaceship) {
            spring.tryBounce(player.getScene().sound);
            player.tryBounce();       
        }
    }

    playerTouchingCheckpointHandler(player: any, flag: any): void {
        flag.activate(player.getScene().sound);
        //player.tryBounce();       
    }

    playerTouchingPortalHandler(player: any, portal: any): void {   
        if(!player.isInSpaceship) {                     
            portal.activate();
            player.setAvailableInteraction(portal);
            player.displayInteractTextAndImage(portal.x, portal.y);
        }
    }

    playerTouchingSwitchHandler(player: any, switchItem: any): void {      
        if(!player.isInSpaceship) {
            player.setAvailableInteraction(switchItem);
            player.displayInteractTextAndImage(switchItem.x, switchItem.y);
        }
    }

    enemyTouchingSpringHandler(enemy: any, spring: any): void {
        spring.tryBounce(enemy.getScene().sound);
        enemy.tryBounce();        
    }

    spaceshipTouchingEnemyHandler(enemy: any, spaceship: any): void {
        var scene = <MainScene>enemy.getScene();

        if(scene.player.isInSpaceship) {
            var damageToEnemy = 1000;
            scene.sound.play("enemyHurtSound");
           
            scene.addExpiringText(scene, enemy.x, enemy.y, damageToEnemy.toString())
    
            enemy.tryDamage(damageToEnemy);    
            
            spaceship.tryDamage(10);
        }
    }

    spaceshipLaserBeamTouchingEnemyHandler(enemy: any, laserBeam: any): void {
        var scene = <MainScene>enemy.getScene();

        if(scene.player.isInSpaceship && laserBeam.visible) {
            var damage = 10;
            var x = enemy.x;
            var y = enemy.y;
           
            //scene.addExpiringText(scene, enemy.x, enemy.y, damage.toString())

            var scene = <MainScene>enemy.getScene();

            scene.weaponHitParticleEmitter.explode(10, enemy.x, enemy.y);

            var body = <Phaser.Physics.Arcade.Body>enemy.body;

            body.setVelocityY(-10);

            if(enemy.health <= damage) {
                var enemyDamage = 200;
                scene.sound.play("enemyHurtSound");
                scene.addExpiringText(scene, x, y, enemyDamage.toString()) 
                
                scene.player.score += enemyDamage;
            }

            enemy.tryDamage(damage);           
        }
    }

    playerTouchingEnemiesHandler(player: any, enemy: any): void {
        player.tryDamage();
        player.getScene().cameras.main.shake(100, 0.01, false);
    }
    
    playerTouchingSpikesHandler(sprite, tile): boolean {
        this.player.tryDamage();
        this.player.getScene().cameras.main.shake(100, 0.01, false);

        return true;
    }

    playerTouchingSpaceshipHandler(player: any, spaceship: any): void {  
             
        if(!player.isInSpaceship && spaceship.transitionTime == 0) {
            player.displayInteractTextAndImage(spaceship.x, spaceship.y);
            player.setAvailableInteraction(spaceship);
        }        
    }

    enemyTouchingEnemyHandler(enemy1: any, enemy2: any): void {
        var body1 = <Phaser.Physics.Arcade.Body>enemy1.body;
        var body2 = <Phaser.Physics.Arcade.Body>enemy2.body;

        if(body1.x < body2.x && body1.velocity.x > 0) {
            body1.velocity.x = 0;
            enemy1.idle();
        }
        else if(body1.x > body2.x && body1.velocity.x < 0) {
            body1.velocity.x = 0;
            enemy1.idle();
        }            
        else if(body1.x > body2.x && body2.velocity.x > 0) {
            body2.velocity.x = 0;
            enemy2.idle();
        }            
        else if(body1.x < body2.x && body2.velocity.x < 0) {
            body2.velocity.x = 0;
            enemy2.idle();
        }            
    }

    bulletTouchingEnemyHandler(enemy: any, bullet: any): void {                
        var scene = <MainScene>enemy.getScene();
        scene.weaponHitParticleEmitter.explode(10, enemy.x, enemy.y);
              
        var damage = bullet.damage;
        scene.addExpiringText(scene, enemy.x, enemy.y, damage.toString())

        enemy.tryDamage(damage);
        scene.player.score += damage;

        scene.sound.play("enemyHurtSound");
        
        if(this.isMultiplayer) {
            var socket = scene.getSocket();        
            if(socket != null) {
                // sends back to server
                socket.emit('bulletDestruction', {bulletId: bullet.bulletId});                
            }
        }

        bullet.destroy();
    }

    bulletTouchingOtherPlayerHandler(otherPlayer: any, bullet: any): void {                
        var scene = <MainScene>otherPlayer.getScene();
        scene.weaponHitParticleEmitter.explode(10, bullet.x, bullet.y);
              
        var damage = bullet.damage;
        scene.addExpiringText(scene, otherPlayer.x, otherPlayer.y, damage.toString())

        otherPlayer.tryDamage(damage);
        scene.player.score += damage;
        //scene.sound.play("enemyHurtSound");
        
        if(this.isMultiplayer) {
            var socket = scene.getSocket();        
            if(socket != null) {
                // sends back to server
                socket.emit('bulletDestruction', {bulletId: bullet.bulletId});                
            }
        }

        bullet.destroy();
    }

    bulletTouchingImpassableLayerHandler(bullet: any, layer: any): void {        
        var scene = <MainScene>bullet.getScene();
        scene.weaponHitParticleEmitter.explode(2, bullet.x, bullet.y);

        if(this.isMultiplayer) {
            var socket = scene.getSocket();        
            if(socket != null) {
                // sends back to server
                socket.emit('bulletDestruction', {bulletId: bullet.bulletId});                
            }
        }

        bullet.destroy();
    }
  
    bulletIntervalElapsed = (now, time) =>{
        return now > time;
    }

    private addExpiringText(scene: MainScene, x: number, y: number, text: string, ) {                
        this.expiringMessagesComponent.emitExpiringText(x, y, text);
    }
    
    addBulletFromServer(bulletFromServer: any): void {
        var tempBullet = new Bullet({
            scene: this,
            x: bulletFromServer.x,
            y: bulletFromServer.y,
            key: "playerGunLaser2",//bulletFromServer.key,
            flipX: bulletFromServer.flipX,
            damage: bulletFromServer.damage,
            velocityX: bulletFromServer.velocityX
        });
        tempBullet.init();

        console.log(`bullet from server: (${tempBullet.x},${tempBullet.y}) alpha:${tempBullet.alpha} depth:${tempBullet.depth} scale:${tempBullet.scale} width:${tempBullet.width} height:${tempBullet.height}`);

        this.otherBullets.add(tempBullet);
    }
}