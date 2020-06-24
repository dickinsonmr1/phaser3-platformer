export class HealthBar extends Phaser.GameObjects.Group {

    private healthBarOriginX: number;
    private healthBarOriginY: number;
    private static get healthBarLeftSegmentWidth(): number {return 6;}  
    private static get healthBarRightSegmentWidth(): number {return 6;}  
    private healthBarHeight: number;

    private static get healthBarShadowBuffer(): number {return 4;}
    private static get healthBarShadowOffsetX(): number {return -2;}  
    private static get healthBarShadowOffsetY(): number {return -2;}  
    private healthBarShadowHeight(): number {return this.healthBarHeight + HealthBar.healthBarShadowBuffer;} 
    private static get healthBarShadowLeftSegmentWidth(): number {return HealthBar.healthBarLeftSegmentWidth;}  
    private healthBarShadowMidSegmentWidth(): number {return this.calculateCurrentHealthBarWidthInPixels() + HealthBar.healthBarShadowBuffer;}  
    private static get healthBarShadowRightSegmentWidth(): number {return HealthBar.healthBarRightSegmentWidth;}  

    public currentHealth: number = 100;
    public healthMax: number;
    public healthMaxWidthInPixels: number;

    healthBarShadowLeft: Phaser.GameObjects.Image;
    healthBarShadowMid: Phaser.GameObjects.Image;
    healthBarShadowRight: Phaser.GameObjects.Image;

    healthBarLeft: Phaser.GameObjects.Image;
    healthBarMid: Phaser.GameObjects.Image;
    healthBarRight: Phaser.GameObjects.Image;

    init(originX: number, originY: number, healthMax: number, healthMaxWidthInPixels: number, healthBarHeight: number): void {
        
        this.healthMax = healthMax;
        this.currentHealth = healthMax;

        this.healthBarHeight = healthBarHeight;
        this.healthMaxWidthInPixels = healthMaxWidthInPixels;

        this.healthBarOriginX = originX;
        this.healthBarOriginY = originY;
        this.healthBarShadowLeft = this.scene.add.image(
            this.healthBarOriginX + HealthBar.healthBarShadowOffsetX,
            this.healthBarOriginY + HealthBar.healthBarShadowOffsetY,
            'uiSpaceSprites', 'barHorizontal_shadow_left.png');
        this.healthBarShadowLeft.setOrigin(0,0);
        this.healthBarShadowLeft.setDisplayOrigin(0,0);
        this.healthBarShadowLeft.setDisplaySize(HealthBar.healthBarShadowLeftSegmentWidth, this.healthBarShadowHeight());
        this.healthBarShadowLeft.alpha = 0.4;    
        this.healthBarShadowLeft.setDepth(4);

        this.healthBarShadowMid = this.scene.add.image(
            this.healthBarOriginX + HealthBar.healthBarShadowOffsetX + HealthBar.healthBarShadowLeftSegmentWidth,
            this.healthBarOriginY + HealthBar.healthBarShadowOffsetY,
            'uiSpaceSprites', 'barHorizontal_shadow_mid.png');
        this.healthBarShadowMid.setOrigin(0, 0);
        this.healthBarShadowMid.setDisplayOrigin(0,0);// = 0;
        this.healthBarShadowMid.setDisplaySize(this.healthMaxWidthInPixels, this.healthBarShadowHeight());
        this.healthBarShadowMid.alpha = 0.4;    
        this.healthBarShadowMid.setDepth(4);

        this.healthBarShadowRight = this.scene.add.image(
            this.healthBarOriginX + HealthBar.healthBarShadowOffsetX + HealthBar.healthBarShadowLeftSegmentWidth + this.healthBarShadowMidSegmentWidth(),
            this.healthBarOriginY + HealthBar.healthBarShadowOffsetY,
            'uiSpaceSprites', 'barHorizontal_shadow_right.png');
        this.healthBarShadowRight.setOrigin(0,0);
        this.healthBarShadowRight.setDisplayOrigin(0,0);
        this.healthBarShadowRight.setDisplaySize(HealthBar.healthBarShadowRightSegmentWidth, this.healthBarShadowHeight());
        this.healthBarShadowRight.alpha = 0.4;    
        this.healthBarShadowRight.setDepth(4);

        this.healthBarLeft = this.scene.add.image(this.healthBarOriginX, this.healthBarOriginY, 'healthBarLeft');
        this.healthBarLeft.setOrigin(0,0);
        this.healthBarLeft.setDisplayOrigin(0,0);
        this.healthBarLeft.setDisplaySize(HealthBar.healthBarLeftSegmentWidth, this.healthBarHeight);
        this.healthBarLeft.setDepth(4);

        this.healthBarMid = this.scene.add.image(
            this.healthBarOriginX + HealthBar.healthBarLeftSegmentWidth,
            this.healthBarOriginY, 'healthBarMid');
        this.healthBarMid.setOrigin(0,0);
        this.healthBarMid.setDisplayOrigin(0,0);
        this.healthBarMid.setDisplaySize(this.calculateCurrentHealthBarWidthInPixels(), this.healthBarHeight);
        this.healthBarMid.setDepth(4);

        this.healthBarRight = this.scene.add.image(
            this.healthBarOriginX + HealthBar.healthBarLeftSegmentWidth + this.calculateCurrentHealthBarWidthInPixels(),
            this.healthBarOriginY, 'healthBarRight');
        this.healthBarRight.setOrigin(0,0);
        this.healthBarRight.setDisplayOrigin(0,0);
        this.healthBarRight.setDisplaySize(HealthBar.healthBarRightSegmentWidth, this.healthBarHeight);
        this.healthBarRight.setDepth(4);
    }

    calculateCurrentHealthBarWidthInPixels(): number {
        return (this.currentHealth / this.healthMax) * this.healthMaxWidthInPixels;
    }

    

    updateHealth(health: number) {

        this.currentHealth = health;

        if(health <= 0) {
            this.healthBarLeft.visible = false;
            this.healthBarMid.visible = false;
            this.healthBarRight.visible = false;
        }
        else {

            this.healthBarLeft.visible = true;
            this.healthBarMid.visible = true;
            this.healthBarRight.visible = true;

            this.updatePosition(this.healthBarOriginX, this.healthBarOriginY);        
        }
    }

    updatePosition(originX: number, originY: number) {
        this.healthBarOriginX = originX;
        this.healthBarOriginY = originY;

        this.healthBarLeft.setPosition(this.healthBarOriginX, this.healthBarOriginY);

        this.healthBarMid.setPosition(this.healthBarLeft.x + HealthBar.healthBarLeftSegmentWidth,
            this.healthBarOriginY);         
        this.healthBarMid.setDisplaySize(this.calculateCurrentHealthBarWidthInPixels(), this.healthBarHeight);    

        this.healthBarRight.setPosition(this.healthBarMid.x + this.healthBarMid.displayWidth,
            this.healthBarOriginY);   

        this.healthBarShadowLeft.setPosition(this.healthBarOriginX + HealthBar.healthBarShadowOffsetX,
            this.healthBarOriginY + HealthBar.healthBarShadowOffsetY);

        this.healthBarShadowMid.setPosition(this.healthBarOriginX + HealthBar.healthBarShadowOffsetX + HealthBar.healthBarShadowLeftSegmentWidth,
            this.healthBarOriginY + HealthBar.healthBarShadowOffsetY);

        this.healthBarShadowRight.setPosition(this.healthBarOriginX + HealthBar.healthBarShadowOffsetX + HealthBar.healthBarShadowLeftSegmentWidth + this.healthMaxWidthInPixels,
            this.healthBarOriginY + HealthBar.healthBarShadowOffsetY);
    }

    preUpdate() {

    }
}