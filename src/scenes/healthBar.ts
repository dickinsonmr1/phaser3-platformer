export class HealthBar extends Phaser.GameObjects.Group {

    private healthBarOriginX: number;// {return 600;}  
    private healthBarOriginY: number;// {return 900;}  
    private static get healthBarLeftSegmentWidth(): number {return 6;}  
    private healthBarMidSegmentWidth(): number {return this.healthMax * 2;}  
    private static get healthBarRightSegmentWidth(): number {return 6;}  
    private static get healthBarHeight(): number {return 30;} 

    private static get healthBarShadowBuffer(): number {return 4;}
    private static get healthBarShadowOffsetX(): number {return -2;}  
    private static get healthBarShadowOffsetY(): number {return -2;}  
    private static get healthBarShadowHeight(): number {return HealthBar.healthBarHeight + HealthBar.healthBarShadowBuffer;} 
    private static get healthBarShadowLeftSegmentWidth(): number {return HealthBar.healthBarLeftSegmentWidth;}  
    private healthBarShadowMidSegmentWidth(): number {return this.healthBarMidSegmentWidth() + HealthBar.healthBarShadowBuffer;}  
    private static get healthBarShadowRightSegmentWidth(): number {return HealthBar.healthBarRightSegmentWidth;}  

    public currentHealth: number = 100;
    public healthMax: number;

    healthBarShadowLeft: Phaser.GameObjects.Image;
    healthBarShadowMid: Phaser.GameObjects.Image;
    healthBarShadowRight: Phaser.GameObjects.Image;

    healthBarLeft: Phaser.GameObjects.Image;
    healthBarMid: Phaser.GameObjects.Image;
    healthBarRight: Phaser.GameObjects.Image;

    init(originX: number, originY: number, healthMax: number): void {
        
        this.healthMax = healthMax;
        this.currentHealth = healthMax;

        this.healthBarOriginX = originX;
        this.healthBarOriginY = originY;
        this.healthBarShadowLeft = this.scene.add.image(
            this.healthBarOriginX + HealthBar.healthBarShadowOffsetX,
            this.healthBarOriginY + HealthBar.healthBarShadowOffsetY,
            'uiSpaceSprites', 'barHorizontal_shadow_left.png');
        this.healthBarShadowLeft.setOrigin(0,0);
        this.healthBarShadowLeft.setDisplayOrigin(0,0);
        this.healthBarShadowLeft.setDisplaySize(HealthBar.healthBarShadowLeftSegmentWidth, HealthBar.healthBarShadowHeight);
        this.healthBarShadowLeft.alpha = 0.4;    
        
        this.healthBarShadowMid = this.scene.add.image(
            this.healthBarOriginX + HealthBar.healthBarShadowOffsetX + HealthBar.healthBarShadowLeftSegmentWidth,
            this.healthBarOriginY + HealthBar.healthBarShadowOffsetY,
            'uiSpaceSprites', 'barHorizontal_shadow_mid.png');
        this.healthBarShadowMid.setOrigin(0, 0);
        this.healthBarShadowMid.setDisplayOrigin(0,0);// = 0;
        this.healthBarShadowMid.setDisplaySize(this.healthBarShadowMidSegmentWidth(), HealthBar.healthBarShadowHeight);
        this.healthBarShadowMid.alpha = 0.4;    
        
        this.healthBarShadowRight = this.scene.add.image(
            this.healthBarOriginX + HealthBar.healthBarShadowOffsetX + HealthBar.healthBarShadowLeftSegmentWidth + this.healthBarShadowMidSegmentWidth(),
            this.healthBarOriginY + HealthBar.healthBarShadowOffsetY,
            'uiSpaceSprites', 'barHorizontal_shadow_right.png');
        this.healthBarShadowRight.setOrigin(0,0);
        this.healthBarShadowRight.setDisplayOrigin(0,0);
        this.healthBarShadowRight.setDisplaySize(HealthBar.healthBarShadowRightSegmentWidth, HealthBar.healthBarShadowHeight);
        this.healthBarShadowRight.alpha = 0.4;    
        
        this.healthBarLeft = this.scene.add.image(this.healthBarOriginX, this.healthBarOriginY, 'healthBarLeft');
        this.healthBarLeft.setOrigin(0,0);
        this.healthBarLeft.setDisplayOrigin(0,0);
        this.healthBarLeft.setDisplaySize(HealthBar.healthBarLeftSegmentWidth, HealthBar.healthBarHeight);

        this.healthBarMid = this.scene.add.image(
            this.healthBarOriginX + HealthBar.healthBarLeftSegmentWidth,
            this.healthBarOriginY, 'healthBarMid');
        this.healthBarMid.setOrigin(0,0);
        this.healthBarMid.setDisplayOrigin(0,0);
        this.healthBarMid.setDisplaySize(this.healthBarMidSegmentWidth(), HealthBar.healthBarHeight);

        this.healthBarRight = this.scene.add.image(
            this.healthBarOriginX + HealthBar.healthBarLeftSegmentWidth + this.healthBarMidSegmentWidth(),
            this.healthBarOriginY, 'healthBarRight');
            this.healthBarRight.setOrigin(0,0);
            this.healthBarRight.setDisplayOrigin(0,0);
            this.healthBarRight.setDisplaySize(HealthBar.healthBarRightSegmentWidth, HealthBar.healthBarHeight);
    }

    updatePosition(originX: number, originY: number) {
        this.healthBarOriginX = originX;
        this.healthBarOriginY = originY;

        this.healthBarLeft.setPosition(this.healthBarOriginX, this.healthBarOriginY);
        this.healthBarMid.setX(this.healthBarLeft.x + HealthBar.healthBarLeftSegmentWidth);
        this.healthBarMid.setDisplaySize(this.currentHealth, HealthBar.healthBarHeight);    
        this.healthBarRight.setX(this.healthBarMid.x + this.healthBarMid.displayWidth);
    }

    updateHealth(health: number) {
        if(health <= 0) {
            this.healthBarLeft.visible = false;
            this.healthBarMid.visible = false;
            this.healthBarRight.visible = false;
        }
        else {

            this.healthBarLeft.visible = true;
            this.healthBarMid.visible = true;
            this.healthBarRight.visible = true;

            this.healthBarLeft.setPosition(this.healthBarOriginX, this.healthBarOriginY);
            this.healthBarMid.setX(this.healthBarLeft.x + HealthBar.healthBarLeftSegmentWidth);
            this.healthBarMid.setDisplaySize(health, HealthBar.healthBarHeight);    
            this.healthBarRight.setX(this.healthBarMid.x + this.healthBarMid.displayWidth);    
        }
    }

    preUpdate() {

    }
}