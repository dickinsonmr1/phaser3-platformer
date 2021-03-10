export class Animations {

    static createAnims(anims: Phaser.Animations.AnimationManager) {
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
        // enemy 1: walking abstract
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
        // enemy 2: blue slime
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

        ////////////////////////////////////////////////////////////////
        // enemy 4: green worm
        ////////////////////////////////////////////////////////////////
        anims.create({
            key: 'enemy04-Idle',
            frames: [{key: 'completeSprites', frame: 'wormGreen.png', }],
            frameRate: 10,
        });        
        anims.create({
            key: 'enemy04-Walk',
            frames:
            [
                {key: 'completeSprites', frame: 'wormGreen.png'},
                {key: 'completeSprites', frame: 'wormGreen_move.png'},                
            ],
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'enemy04-Dead',
            frames: [{key: 'completeSprites', frame: 'wormGreen_dead.png'}],
            frameRate: 10,
        });

        
        ////////////////////////////////////////////////////////////////
        // enemy 5: saw
        ////////////////////////////////////////////////////////////////
        anims.create({
            key: 'enemy05-Idle',
            frames: [{key: 'completeSprites', frame: 'saw.png', }],
            frameRate: 10,
        });        
        anims.create({
            key: 'enemy05-Walk',
            frames:
            [
                {key: 'completeSprites', frame: 'saw.png'},
                {key: 'completeSprites', frame: 'saw_move.png'},                
            ],
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'enemy05-Dead',
            frames: [{key: 'completeSprites', frame: 'saw_dead.png'}],
            frameRate: 10,
        });

        ////////////////////////////////////////////////////////////////
        // enemy 6: floating with spikes
        ////////////////////////////////////////////////////////////////
        anims.create({
            key: 'enemy06-Idle',
            frames: [{key: 'enemySprites2', frame: 'enemyFloating_1.png', }],
            frameRate: 10,
        });
        anims.create({
            key: 'enemy06-Walk',
            frames:
            [
                {key: 'enemySprites2', frame: 'enemyFloating_1.png'},
                {key: 'enemySprites2', frame: 'enemyFloating_2.png'},
                {key: 'enemySprites2', frame: 'enemyFloating_3.png'},               
            ],
            frameRate: 5,
            repeat: -1
        });        
        anims.create({
            key: 'enemy06-Dead',
            frames: [{key: 'enemySprites2', frame: 'enemyFloating_1.png'}],
            frameRate: 10,
        });

        ////////////////////////////////////////////////////////////////
        // enemy 7
        ////////////////////////////////////////////////////////////////
        anims.create({
            key: 'enemy07-Idle',
            frames: [{key: 'enemySprites3', frame: 'playerGreen_walk1.png', }],
            frameRate: 10,
        });
        
        anims.create({
            key: 'enemy07-Walk',
            frames:
            [
                {key: 'enemySprites3', frame: 'playerGreen_walk1.png'},
                {key: 'enemySprites3', frame: 'playerGreen_walk2.png'},
                {key: 'enemySprites3', frame: 'playerGreen_walk3.png'},
                //{key: 'enemySprites3', frame: 'playerGreen_walk4.png'},
            ],
            frameRate: 20,
            repeat: -1
        });
        
        anims.create({
            key: 'enemy07-Dead',
            frames: [{key: 'enemySprites3', frame: 'playerGreen_dead.png'}],
            frameRate: 10,
        });

        ////////////////////////////////////////////////////////////////
        // springs
        ////////////////////////////////////////////////////////////////
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

        ////////////////////////////////////////////////////////////////
        // checkpoints
        ////////////////////////////////////////////////////////////////
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
  
        // spaceship beam
        anims.create({
            key: 'spaceship-beam',
            frames:
            [
                {key: 'alienShipLaserSprites', frame: 'laserBlue_burst.png'},
                {key: 'alienShipLaserSprites', frame: 'laserBlue_groundBurst.png'},
                //{key: 'completeSprites', frame: 'slimeBlue.png'},
                //{key: 'completeSprites', frame: 'slimeBlue_move.png'},
                //{key: 'enemySprites2', frame: 'enemyWalking_3.png'},
                //{key: 'enemySprites2', frame: 'enemyWalking_4.png'}
            ],
            frameRate: 5,
            repeat: -1
        });     
    }
}