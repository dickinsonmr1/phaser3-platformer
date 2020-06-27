import { SceneController } from "./sceneController";

export class MenuBackgroundScene extends Phaser.Scene {
    
    sceneController: SceneController;

    private skySprite: Phaser.GameObjects.TileSprite;
    skySpriteX: number;
    
    private spaceship: Phaser.GameObjects.Sprite;
    private spaceshipMoveTime: number;

    constructor(sceneController: SceneController) {
        super({
            key: "MenuBackgroundScene"
        });

        this.sceneController = sceneController;
    }

    preload(): void {
        this.load.image('menuSky', './assets/sprites/backgrounds/backgroundEmpty.png');
        this.load.atlasXML('alienShipSprites', './assets/sprites/ships/spritesheet_spaceships.png', './assets/sprites/ships/spritesheet_spaceships.xml');
    }

    create(): void {
        this.spaceshipMoveTime = 0;

        this.skySprite = this.add.tileSprite(0, 0, 20480, 1080, 'menuSky');
        this.skySprite.setX(this.skySpriteX);
        this.skySprite.setY(540);

        this.spaceship = this.add.sprite(1600, 650, 'alienShipSprites', 'shipBlue_manned.png');
        
        this.fadeInCamera();
    }
    
    fadeInCamera() {
        this.cameras.main.fadeIn(500);
    }

    fadeOutToWhite() {
        let transitionTime = 1000;
        this.cameras.main.fadeOut(transitionTime, 255, 255, 255);
        //this.cameras.main.zoomTo(5, transitionTime);
    }

    transitionToLoadingScene(destinationName: string) {
        //this.scene.transition({target: 'LoadingScene', duration: 2000, destinationName: destinationName});
    }

    update(): void {
        this.skySprite.x -= 10;
        if(this.skySprite.x  * (-1) > this.skySprite.width * .4)
            this.skySprite.x = 0;

        this.spaceshipMoveTime++;

        if(this.spaceshipMoveTime < 150)
            this.spaceship.y -= 1;
        if(this.spaceshipMoveTime > 150)
            this.spaceship.y += 1;

        if(this.spaceshipMoveTime > 300)
            this.spaceshipMoveTime = 0;        
    }
}