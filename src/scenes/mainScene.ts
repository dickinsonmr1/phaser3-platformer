/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../phaser.d.ts"/>

import "phaser";
import { Player } from "../player";
import { WeaponType } from "../player";
import { HudScene } from "./hudScene";
import { Enemy } from "../enemy";
import { Spring } from "../gameobjects/spring";
import { Portal } from "../gameobjects/portal";
import { Checkpoint } from "../gameobjects/checkpoint";
import { Constants } from "../constants";
import { Bullet } from "../bullet";
import { World } from "../world/world";
import { ExpiringText } from "../gameobjects/expiringText";
import { Switch } from "../gameobjects/switch";
import { Spaceship } from "../gameobjects/spaceship";

export class MainScene extends Phaser.Scene {
  
    public skySprite: Phaser.GameObjects.TileSprite;

    world: World;    
    particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    weaponHitParticleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    // player selection
    selectedPlayerIndex = 0;
    
    // player stuff
    player: Player;
    playerSpaceShip: Spaceship;

    enemies: Array<Phaser.GameObjects.Sprite>;
    enemiesPhysics: Array<Phaser.GameObjects.Sprite>;
    enemiesNonGravity: Array<Phaser.GameObjects.Sprite>;

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

    worldName: string;

    expiringMessagesGroup: Phaser.GameObjects.Group;
     
    constructor() {
    super({
        key: "MainScene",
        //active: true
        //map: {   events: 'events', audio: 'audio'}
    });
    }

    init(data): void {
        console.log(data.id);
        this.worldName = data.worldName;
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
        this.load.audio('lowAmmoSound', '/assets/audio/hit4.ogg');       
        this.load.audio('noAmmoSound', '/assets/audio/fall3.ogg'); 
        this.load.audio('portalOpenSound', '/assets/audio/phaseJump3.ogg');      
        this.load.audio('portalCloseSound', '/assets/audio/phaserDown3.ogg');      
        this.load.audio('switchSound', '/assets/audio/switch_001.ogg');      
        this.load.audio('engineSound', '/assets/audio/engine5.ogg');      
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

        this.load.image('playerGun', './assets/sprites/player/raygunPurpleBig.png');
        this.load.image('playerGunLaser1', './assets/sprites/player/laserPurpleDot15x15.png');
        this.load.image('playerGunLaser2', './assets/sprites/player/laserPurple2.png');
        this.load.image('playerGunLaser3', './assets/sprites/player/laserGreenBurst.png');
        this.load.image('playerGunLaser4', './assets/sprites/player/rocket.png');
        this.load.image('playerRocket1', './assets/sprites/player/rocket_1.png');
        this.load.image('playerRocket2', './assets/sprites/player/rocket_2_small.png');

        this.load.image('laserWhiteBurst', './assets/sprites/player/laserWhiteBurst_16x16.png');

        this.load.image('portalBlue', './assets/sprites/objects/portalBlue.png');
        this.load.image('portalRed', './assets/sprites/objects/portalRed.png');
        this.load.image('portalYellow', './assets/sprites/objects/portalYellow.png');
        this.load.image('portalGreen', './assets/sprites/objects/portalGreen.png');

        this.load.image('switchYellowOff', './assets/sprites/objects/switchYellowOff.png');
        this.load.image('switchYellowOn', './assets/sprites/objects/switchYellowOn.png');

        this.load.image('buttonX', './assets/sprites/hud/buttonX.png');

        this.load.image('world-01-03-sky', './assets/sprites/backgrounds/blue_grass.png');
        this.load.image('world-02-01-sky', './assets/sprites/backgrounds/backgroundCastles.png');              
    }

    private loadParticles(){

        var particles = this.add.particles('laserWhiteBurst');
        particles.setDepth(4);

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
        weaponHitParticles.setDepth(4);
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

    private createAnims(anims) {
        
        // player
        anims.create({
            key: 'player-walk',
            frames: anims.generateFrameNames('playerSprites', { prefix: 'alienBlue_walk', start: 1, end: 2, zeroPad: 1, suffix: '.png' }),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key: 'player-swim',
            frames: anims.generateFrameNames('playerSprites', { prefix: 'alienBlue_swim', start: 1, end: 2, zeroPad: 1, suffix: '.png' }),
            frameRate: 10,
            repeat: -1
        });
        // idle with only one frame, so repeat is not neaded
        anims.create({
            key: 'player-idle',
            frames: [{key: 'playerSprites', frame: 'alienBlue_stand.png'}],
            frameRate: 10,
        });

        anims.create({
            key: 'player-jump',
            frames: [{key: 'playerSprites', frame: 'alienBlue_jump.png'}],
            frameRate: 10,
        });

        anims.create({
            key: 'player-duck',
            frames: [{key: 'playerSprites', frame: 'alienBlue_duck.png'}],
            frameRate: 10,
        });

        // player spaceship
        anims.create({
            key: 'spaceshipBlue',
            frames: [{key: 'alienShipSprites', frame: 'shipBlue.png'}],
            frameRate: 10,
        });   
        anims.create({
            key: 'spaceshipBlue_manned',
            frames: [{key: 'alienShipSprites', frame: 'shipBlue_manned.png'}],
            frameRate: 10,
        });    

        ////////////////////////////////////////////////////////////////
        // enemy 1
        ////////////////////////////////////////////////////////////////
        anims.create({
            key: 'enemy01-Idle',
            frames: [{key: 'enemySprites2', frame: 'enemyWalking_1.png', }],
            frameRate: 10,
        });
        anims.create({
            key: 'enemy01-Walk',
            frames:
            [
                {key: 'enemySprites2', frame: 'enemyWalking_1.png'},
                {key: 'enemySprites2', frame: 'enemyWalking_2.png'},
                //{key: 'completeSprites', frame: 'slimeBlue.png'},
                //{key: 'completeSprites', frame: 'slimeBlue_move.png'},
                //{key: 'enemySprites2', frame: 'enemyWalking_3.png'},
                //{key: 'enemySprites2', frame: 'enemyWalking_4.png'}
            ],
            frameRate: 5,
            repeat: -1
        });        
        anims.create({
            key: 'enemy01-Dead',
            frames: [{key: 'enemySprites2', frame: 'enemyWalking_1.png'}],
            frameRate: 10,
        });

        ////////////////////////////////////////////////////////////////
        // enemy 2
        ////////////////////////////////////////////////////////////////
        anims.create({
            key: 'enemy02-Idle',
            frames: [{key: 'completeSprites', frame: 'slimeBlue.png', }],
            frameRate: 10,
        });        
        anims.create({
            key: 'enemy02-Walk',
            frames:
            [
                {key: 'completeSprites', frame: 'slimeBlue.png'},
                {key: 'completeSprites', frame: 'slimeBlue_move.png'},                
            ],
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'enemy02-Dead',
            frames: [{key: 'completeSprites', frame: 'slimeBlue_dead.png'}],
            frameRate: 10,
        });

        ////////////////////////////////////////////////////////////////
        // enemy 3
        ////////////////////////////////////////////////////////////////
        anims.create({
            key: 'enemy03-Idle',
            frames: [{key: 'enemySprites3', frame: 'playerRed_stand.png', }],
            frameRate: 10,
        });
        
        anims.create({
            key: 'enemy03-Walk',
            frames:
            [
                {key: 'enemySprites3', frame: 'playerRed_walk1.png'},
                {key: 'enemySprites3', frame: 'playerRed_walk2.png'},
                {key: 'enemySprites3', frame: 'playerRed_walk3.png'},
                {key: 'enemySprites3', frame: 'playerRed_walk2.png'},
                //{key: 'enemySprites3', frame: 'playerRed_walk4.png'},
                //{key: 'enemySprites3', frame: 'playerRed_walk5.png'},
                //{key: 'completeSprites', frame: 'slimeBlue.png'},
                //{key: 'completeSprites', frame: 'slimeBlue_move.png'},
                //{key: 'enemySprites2', frame: 'enemyWalking_3.png'},
                //{key: 'enemySprites2', frame: 'enemyWalking_4.png'}
            ],
            frameRate: 20,
            repeat: -1
        });
        
        anims.create({
            key: 'enemy03-Dead',
            frames: [{key: 'enemySprites3', frame: 'playerRed_dead.png'}],
            frameRate: 10,
        });

       
        // springs
        anims.create({
            key: 'spring0',
            frames: [{key: 'completeSprites', frame: 'spring0.png'}],
            frameRate: 10,
        });

        anims.create({
            key: 'spring1',
            frames: [{key: 'completeSprites', frame: 'spring1.png'}],
            frameRate: 10,
        });

        
        // checkpoints
        anims.create({
            key: 'flagGreenIdle',
            frames: [{key: 'completeSprites', frame: 'flagGreen_down.png'}],
            frameRate: 10,
        });

        anims.create({
            key: 'flagGreenWave',
            frames: [
                {key: 'completeSprites', frame: 'flagGreen1.png'},
                {key: 'completeSprites', frame: 'flagGreen2.png'}
            ],
            frameRate: 2,
            repeat: -1
        });

        // switches
        anims.create({
            key: 'switchOn',
            frames: [{key: 'switchYellowOn'}],
            frameRate: 10,
        });

        anims.create({
            key: 'switchOff',
            frames: [{key: 'switchYellowOff'}],
            frameRate: 10,
        });
    }

    create(): void {    

        this.createAnims(this.anims);
        this.loadParticles();
        this.skySprite = this.add.tileSprite(0, 0, 20480, 2048, 'world-02-01-sky');            
        
        this.enemies = new Array<Phaser.GameObjects.Sprite>();
        this.enemiesPhysics = Array<Phaser.GameObjects.Sprite>();
        this.enemiesNonGravity = Array<Phaser.GameObjects.Sprite>();

        this.expiringMessagesGroup = this.physics.add.group({
            allowGravity: false,
            velocityY: 100
        })

        this.springs = new Array<Phaser.GameObjects.Sprite>();
        this.flags = new Array<Phaser.GameObjects.Sprite>();
        this.portals = new Array<Phaser.GameObjects.Sprite>();
        this.switches = new Array<Phaser.GameObjects.Sprite>();
        
        this.player = new Player({
            scene: this,
            x: 20,
            y: 600,
            key: "player2"
            });        
        this.player.init();

        var color = '#CFEFFC';
        this.world = new World(this);
        this.world.createWorld(this.worldName, 'sky', '#CFEFFC', this.player);
        
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

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBackgroundColor(this.world.backgroundColor);

        //let hudScene = <HudScene>this.scene.get('HudScene');
        //hudScene.setText("Objective: repair ship");

        //this.events.once("infoTextEmitted", hudScene.setInfoText, this);
        //this.time.addEvent({delay: 1000, callback: hudScene.displayExpiringInfoText, callbackScope: this });
        //this.events.emit("infoTextEmitted", "Objective: repair ship");

        this.events.emit("infoTextEmitted", "Objective: repair ship");

        //this.events.emit("gameLoaded");
        this.scene.stop("LoadingScene");
        this.scene.bringToTop("HudScene");
        this.scene.setVisible(true, "HudScene");
    }

    update(): void {

        this.world.updateSky(this.cameras.main);

        if(Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.input.keyboard.resetKeys();

            this.scene.pause('MainScene');            
            this.scene.pause('HudScene');
            this.scene.setVisible(false, "HudScene");
            this.sound.pauseAll();

            this.scene.run("PauseScene");
            this.scene.bringToTop("PauseScene")
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



        if(!this.player.isInSpaceship) {

            if(Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                this.player.tryInteract();
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
                
            if ((this.jumpKey.isDown || this.cursors.up.isDown))
            {
                this.player.tryJump(this.sound);
            }     
        }
        else {
            if (this.cursors.left.isDown) {
                this.player.moveLeft();
            }
            else if (this.cursors.right.isDown) {
                this.player.moveRight();
            }
            else {
                var body = <Phaser.Physics.Arcade.Body>this.player.currentSpaceship.body;
                body.setVelocityX(0);
            }

            if (this.cursors.down.isDown) {
                this.player.duck();
            }        
            else if (this.cursors.up.isDown)
            {
                this.player.tryMoveUp();
            }     
            else {
                var body = <Phaser.Physics.Arcade.Body>this.player.currentSpaceship.body;
                body.setVelocityY(0);
            }           
            
            if(this.jumpKey.isDown || this.shootKey2.isDown || Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                this.player.tryExitSpaceship(this.playerSpaceShip);
            }    
        }

        if(this.shootKey.isDown) {
            this.player.tryFireBullet(this.sys.game.loop.time, this.sound);
        }
 
        //if(Phaser.Input.Keyboard.JustDown(this.debugKey) {
            //this.physics.config.Arcade.debug = false;
        //}

        this.player.update();
        this.updateExpiringText();

        this.enemies.forEach(enemy => {
            enemy.update(this.player.x, this.player.y);
        });

        this.springs.forEach(spring => 
        {
            spring.update();
        });

        this.portals.forEach(portal => 
        {
            portal.update();
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

        return true;
    }

    
    collectHealth (sprite, tile): boolean
    {
        this.world.removeTileAt(tile.x, tile.y);
        this.player.tryHeal();

        this.particleEmitter.explode(20, tile.pixelX + 32, tile.pixelY + 32);

        return true;
    }

    collectBattery (sprite, tile): boolean
    {
        this.world.collectGem(tile.x, tile.y);
        this.sound.play("batterySound");        


        return true;
    }

    collectWeapon1 (sprite, tile): boolean
    {
        this.world.collectGem(tile.x, tile.y);
        this.sound.play("batterySound", { volume: 0.5 });

        this.particleEmitter.explode(20, tile.pixelX + 32, tile.pixelY + 32);

        var newAmmoCount = 20;
        this.player.reload(newAmmoCount, WeaponType.Laser1);
        this.events.emit("weaponCollected", newAmmoCount);

        this.addExpiringText(this, this.player.x, this.player.y, "LASER PISTOL");

        return true;
    }

    collectWeapon2 (sprite, tile): boolean
    {
        this.world.collectGem(tile.x, tile.y);
        this.sound.play("batterySound", { volume: 0.5 });

        this.particleEmitter.explode(20, tile.pixelX + 32, tile.pixelY + 32);

        var newAmmoCount = 30;
        this.player.reload(newAmmoCount, WeaponType.Laser2);
        this.events.emit("weaponCollected", newAmmoCount);

        this.addExpiringText(this, this.player.x, this.player.y, "LASER REPEATER");

        return true;
    }

    collectWeapon3 (sprite, tile): boolean
    {
        this.world.collectGem(tile.x, tile.y);
        this.sound.play("batterySound", { volume: 0.5 });

        this.particleEmitter.explode(20, tile.pixelX + 32, tile.pixelY + 32);

        var newAmmoCount = 10;
        this.player.reload(newAmmoCount, WeaponType.Laser3);
        this.events.emit("weaponCollected", newAmmoCount);

        this.addExpiringText(this, this.player.x, this.player.y, "PULSE CHARGE");

        return true;
    }

    collectWeapon4 (sprite, tile): boolean
    {
        this.world.collectGem(tile.x, tile.y);
        this.sound.play("batterySound", { volume: 0.5 });

        this.particleEmitter.explode(20, tile.pixelX + 32, tile.pixelY + 32);

        var newAmmoCount = 5;
        this.player.reload(newAmmoCount, WeaponType.Laser4);
        this.events.emit("weaponCollected", newAmmoCount);

        this.addExpiringText(this, this.player.x, this.player.y, "ROCKET LAUNCHER");

        return true;
    }


    activateCheckpoint (sprite, tile): boolean
    {
        this.world.collectGem(tile.x, tile.y);
        this.sound.play("gemSound");
        this.events.emit("gemCollected", this.player.gemsCollected++);

        return true;
    }

    activateDoorIcon (sprite, tile): boolean
    {
        //this.world.collectGem(tile.x, tile.y);
        this.sound.play("gemSound");
        //this.events.emit("gemCollected", this.player.gemsCollected++);

        return true;
    }

    inWater (player: Player, tile): boolean
    {
        player.isInWater = true;

        return true;
    }

    collectKey (sprite, tile): boolean
    {
        this.player.hasBlueKey = true;
        this.world.collectKey(tile.x, tile.y);
        this.sound.play("keySound");

        return true;
    }
     
    unlockDoor (player: Player, tile): boolean
    {
        if(player.hasBlueKey) {
            this.world.unlockDoor(tile.x, tile.y);
            this.sound.play("keySound");
        }
        return true;
    }

    playerTouchingSpringHandler(player: Player, spring: Spring): void {
        spring.tryBounce(player.getScene().sound);
        player.tryBounce();       
    }

    playerTouchingCheckpointHandler(player: Player, flag: Checkpoint): void {
        flag.activate(player.getScene().sound);
        //player.tryBounce();       
    }

    playerTouchingPortalHandler(player: Player, portal: Portal): void {                        
        portal.activate();

        player.setAvailableInteraction(portal);
        player.displayInteractTextAndImage(portal.x, portal.y);

    }

    playerTouchingSwitchHandler(player: Player, switchItem: Switch): void {        
                
        player.setAvailableInteraction(switchItem);
        player.displayInteractTextAndImage(switchItem.x, switchItem.y);
    }

    enemyTouchingSpringHandler(enemy: Enemy, spring: Spring): void {
        spring.tryBounce(enemy.getScene().sound);
        enemy.tryBounce();        
    }

    spaceshipTouchingEnemyHandler(enemy: Enemy, spaceship: Spaceship): void {
        var scene = <MainScene>enemy.getScene();

        if(scene.player.isInSpaceship) {
            var damage = 1000;
            scene.sound.play("enemyHurtSound");
           
            scene.addExpiringText(scene, enemy.x, enemy.y, damage.toString())
    
            enemy.tryDamage(damage);    
        }
    }

    playerTouchingEnemiesHandler(player: Player, enemy: Enemy): void
    {
        player.tryDamage();
    }

    playerTouchingSpaceshipHandler(player: Player, spaceship: Spaceship): void
    {       
        if(!player.isInSpaceship && spaceship.transitionTime == 0) {
            player.displayInteractTextAndImage(spaceship.x, spaceship.y);
            player.setAvailableInteraction(spaceship);
        }        
    }

    enemyTouchingEnemyHandler(enemy1: Enemy, enemy2: Enemy): void {

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

    bulletTouchingEnemyHandler(enemy: Enemy, bullet: Bullet): void {
                
        var scene = <MainScene>enemy.getScene();

        scene.weaponHitParticleEmitter.explode(10, enemy.x, enemy.y);

        var damage = bullet.damage;

        scene.sound.play("enemyHurtSound");
       
        scene.addExpiringText(scene, enemy.x, enemy.y, damage.toString())

        enemy.tryDamage(damage);
        bullet.destroy();
    }

    bulletTouchingImpassableLayerHandler(bullet: Bullet, layer): void {        

        var scene = <MainScene>bullet.getScene();
        scene.weaponHitParticleEmitter.explode(2, bullet.x, bullet.y);

        bullet.destroy();
    }
  
    bulletIntervalElapsed = (now, time) =>{
        return now > time;
    }

    private addExpiringText(scene: MainScene, x: number, y: number, text: string, ) {
                
        var expiringText = new ExpiringText({
            scene: scene,
            x: x,
            y: y,
            text: text
            });       

        expiringText.init(1000);
        scene.expiringMessagesGroup.add(expiringText);
    }
    
    updateExpiringText(): void {
        this.expiringMessagesGroup.getChildren().forEach(x => {

            var message = <Phaser.GameObjects.Text> x;
            message.setAlpha(message.alpha);

            var body = <Phaser.Physics.Arcade.Body>x.body;

            body.setVelocity(0, -200);
            message.alpha -= 0.02;

            if(message.alpha <= 0)
                message.destroy();
        });
    }
}