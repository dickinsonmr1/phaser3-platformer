
/// <reference path="../../../node_modules/phaser/types/phaser.d.ts"/>

import "phaser";


export class Menu {
    title: Phaser.GameObjects.Text;
    subtitle: Phaser.GameObjects.Text;
    footer: Phaser.GameObjects.Text;
    footer2: Phaser.GameObjects.Text;
    marker: Phaser.GameObjects.Text;    
    subItemMarkerLeft: Phaser.GameObjects.Text;        
    subItemMarkerRight: Phaser.GameObjects.Text;    
    items: Array<Phaser.GameObjects.Text>;
    selectedItemIndex: integer;
    backMenu: Menu;
    menuIndex: number;

    titleIcon: Phaser.GameObjects.Image;

    menuStartX: number;
    menuStartY: number;

    titleOffsetX(): number {return 0;}
    subtitleOffsetY(): number {return 150;}

    highlightedColor(): string {return "rgb(255,255,255)"};
    nonHighlightedColor(): string {return "rgb(150,150,150)"};

    titleStartX: number;
    titleStartY: number;
    footerStartX: number;
    footerStartY: number;
    footer2StartY: number;

    titleFontSize(): number {return 72;}
    subtitleFontSize(): number {return 48;}
    menuItemFontSize(): number {return 48;}
    footerFontSize(): number {return 32;}

    markerOffsetX(): number {return -50;}
    menuItemDistanceY(): number {return 60;}

    constructor(scene: Phaser.Scene) {        
        this.items = new Array<MenuItem>();
        this.selectedItemIndex = 0;

        this.titleStartX = scene.game.canvas.width / 2;
        this.titleStartY = scene.game.canvas.height / 4;

        this.menuStartX = scene.game.canvas.width / 3;
        this.menuStartY = scene.game.canvas.height / 2;
        
        this.footerStartX = scene.game.canvas.width / 2;
        this.footerStartY = scene.game.canvas.height - scene.game.canvas.height / 8;
        this.footer2StartY = scene.game.canvas.height - scene.game.canvas.height / 16;
    }

    addMenuItem(scene: Phaser.Scene, text: string) {              
        var temp = new MenuItem({
            scene: scene,
            x: this.menuStartX,
            y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
            text: text,
            style: {
                fontFamily: 'KenneyRocketSquare',
                align: 'right',            
                color: this.nonHighlightedColor(),
            }});
        temp.setStroke('rgb(0,0,0)', 16);
        temp.setOrigin(0, 0.5);
        temp.setFontSize(this.menuItemFontSize());

        scene.add.existing(temp);
        this.items.push(temp);

        this.refreshColorsAndMarker();        
    }

    addMenuLinkItem(scene: Phaser.Scene, text: string, menuDestinationLink: Menu) {              
        var temp = new MenuLinkItem({
            scene: scene,
            x: this.menuStartX,
            y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
            text: text,
            menuDestinationLink: menuDestinationLink,
            style: {
                fontFamily: 'KenneyRocketSquare',
                align: 'right',            
                color: this.nonHighlightedColor(),
            }});
        temp.setStroke('rgb(0,0,0)', 16);
        temp.setOrigin(0, 0.5);
        temp.setFontSize(this.menuItemFontSize());

        scene.add.existing(temp);
        this.items.push(temp);

        this.refreshColorsAndMarker();        
    }

    addStartGameMenuItem(scene: Phaser.Scene, text: string) {              
        var temp = new StartGameMenuItem({
            scene: scene,
            x: this.menuStartX,
            y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
            text: text,
            style: {
                fontFamily: 'KenneyRocketSquare',
                align: 'right',            
                color: this.nonHighlightedColor(),
            }});
        temp.setStroke('rgb(0,0,0)', 16);
        temp.setOrigin(0, 0.5);
        temp.setFontSize(this.menuItemFontSize());

        scene.add.existing(temp);
        this.items.push(temp);

        this.refreshColorsAndMarker();        
    }

    addStartMultiplayerGameMenuItem(scene: Phaser.Scene, text: string) {              
        var temp = new StartMultiplayerGameMenuItem({
            scene: scene,
            x: this.menuStartX,
            y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
            text: text,
            style: {
                fontFamily: 'KenneyRocketSquare',
                align: 'right',            
                color: this.nonHighlightedColor(),
            }});
        temp.setStroke('rgb(0,0,0)', 16);
        temp.setOrigin(0, 0.5);
        temp.setFontSize(this.menuItemFontSize());

        scene.add.existing(temp);
        this.items.push(temp);

        this.refreshColorsAndMarker();        
    }
    
    
    addContinueGameMenuItem(scene: Phaser.Scene, text: string) {              
        var temp = new ContinueGameMenuItem({
            scene: scene,
            x: this.menuStartX,
            y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
            text: text,
            style: {
                fontFamily: 'KenneyRocketSquare',
                align: 'right',            
                color: this.nonHighlightedColor(),
            }});
        temp.setStroke('rgb(0,0,0)', 16);
        temp.setOrigin(0, 0.5);
        temp.setFontSize(this.menuItemFontSize());

        scene.add.existing(temp);
        this.items.push(temp);

        this.refreshColorsAndMarker();        
    }

    // TODO: fix
    addMenuComplexItem(scene: Phaser.Scene, text: string, subItems: Array<string>) {
        var temp = new ComplexMenuItem({
            scene: scene,
            x: this.menuStartX,
            y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
            text: text,
            style: {
                fontFamily: 'KenneyRocketSquare',
                align: 'right',            
                color: this.nonHighlightedColor(),
            },
            subItems});
        temp.setStroke('rgb(0,0,0)', 16);
        temp.setOrigin(0, 0.5);
        temp.setFontSize(this.menuItemFontSize());

        scene.add.existing(temp);
        this.items.push(temp);

        this.refreshColorsAndMarker();        
    }

    addMenuComplexItemWithIcons(scene: Phaser.Scene, text: string, iconMappings: Array<IconValueMapping>) {

        //var subItems = [];

        //iconMappings.forEach(x => {
            //subItems.push(x.description);
        //});

        var temp = new ComplexMenuItem({
            scene: scene,
            x: this.menuStartX,
            y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
            text: text,
            style: {
                fontFamily: 'KenneyRocketSquare',
                align: 'right',            
                color: this.nonHighlightedColor(),
            },
            subItems: iconMappings});
        temp.setStroke('rgb(0,0,0)', 16);
        temp.setOrigin(0, 0.5);
        temp.setFontSize(this.menuItemFontSize());
        if(iconMappings.length > 0 && iconMappings[0].description != null && iconMappings[0].frame != null)
            temp.setIcon(scene, iconMappings[0].texture, iconMappings[0].frame, iconMappings[0].scale);

        scene.add.existing(temp);
        this.items.push(temp);

        this.refreshColorsAndMarker();        
    }

    setBackMenu(scene: Phaser.Scene, currentMenu: Menu) {
        // TODO: implement        
    }

    overrideStartY(startY: number) {
        this.menuStartY = startY;
    }

    setMenuIndex(index: number){
        this.menuIndex = index;
    }

    setTitle(scene: Phaser.Scene, text: string) {
        this.title = scene.add.text(this.titleStartX + this.titleOffsetX(), this.titleStartY, text,
        {
            fontFamily: 'KenneyRocketSquare',
            align: 'center',            
            color: "rgb(255,255,255)",
        });
        this.title.setOrigin(0.5, 0.5);
        this.title.setStroke('rgb(0,0,0)', 16);
        this.title.setFontSize(this.titleFontSize());
    }

    setSubtitle(scene: Phaser.Scene, text: string) {
        this.subtitle = scene.add.text(this.titleStartX + this.titleOffsetX(), this.titleStartY + this.subtitleOffsetY(), text,
        {
            fontFamily: 'KenneyRocketSquare',
            align: 'center',            
            color: "rgb(255,255,255)",
        });
        this.subtitle.setOrigin(0.5, 0.5);
        this.subtitle.setStroke('rgb(0,0,0)', 16);
        this.subtitle.setFontSize(this.subtitleFontSize());
    }

    setTitleIcon(scene: Phaser.Scene, texture: string, frame: string, scale: number) {
        this.titleIcon = scene.add.image(this.titleStartX - this.title.width / 2 - 100, this.titleStartY, texture, frame);
        this.titleIcon.setOrigin(0.5, 0.5);
        this.titleIcon.setScale(scale, scale);
        
        this.titleIcon.setDepth(1);
    }

    setFooter(scene: Phaser.Scene, text: string) {
        this.footer = scene.add.text(this.footerStartX, this.footerStartY, text,
        {
            fontFamily: 'KenneyRocketSquare',
            align: 'center',            
            color:"rgb(255,255,255)",
        });
        this.footer.setOrigin(0.5, 0.5);
        this.footer.setStroke('rgb(0,0,0)', 16);
        this.footer.setFontSize(this.footerFontSize());
    }

    setFooter2(scene: Phaser.Scene, text: string) {
        this.footer2 = scene.add.text(this.footerStartX, this.footer2StartY, text,
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: this.footerFontSize().toString(),
            align: 'center',            
            color:"rgb(255,255,255)",
        });
        this.footer2.setOrigin(0.5, 0.5);
        this.footer2.setStroke('rgb(0,0,0)', 16);
        this.footer2.setFontSize(this.footerFontSize());
    }

    setMarker(scene: Phaser.Scene, text: string) {
        this.marker = scene.add.text(this.menuStartX + this.markerOffsetX(), this.menuStartY, text,
        {
            fontFamily: 'KenneyRocketSquare',
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.marker.setOrigin(0.5, 0.5);
        this.marker.setStroke('rgb(0,0,0)', 16);  
        this.marker.setFontSize(this.menuItemFontSize());
        /*
        this.subItemMarkerLeft = scene.add.text(this.menuStartX + this.markerOffsetX(), this.menuStartY, "<<",
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 64,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.subItemMarkerLeft.setStroke('rgb(0,0,0)', 16);  

        this.subItemMarkerRight = scene.add.text(this.menuStartX + this.markerOffsetX(), this.menuStartY, "<<",
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 64,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.subItemMarkerLeft.setStroke('rgb(0,0,0)', 16);  
        */
    }

    refreshColorsAndMarker() {
        for(var i = 0; i < this.items.length; i++) {
            if(i == this.selectedItemIndex) {
                this.items[i].setColor(this.highlightedColor());
            }
            else {
                this.items[i].setColor(this.nonHighlightedColor());
            }
        }     

        this.marker.setY(this.menuStartY + this.selectedItemIndex * this.menuItemDistanceY());   

        /*
        this.subItemMarkerLeft.setY(this.menuStartY + this.selectedIndex * this.menuItemDistanceY());   
        this.subItemMarkerRight.setY(this.menuStartY + this.selectedIndex * this.menuItemDistanceY());   
        this.subItemMarkerRight.setY(this.menuStartY + this.selectedIndex * this.menuItemDistanceY());   

        var temp = this.items[i];
        if(temp instanceof ComplexMenuItem)
        {
            this.marker.setVisible(false);
            this.subItemMarkerLeft.setVisible(true);
            this.subItemMarkerRight.setVisible(true);
        } 
        else {
            this.marker.setVisible(true);
            this.subItemMarkerLeft.setVisible(false);
            this.subItemMarkerRight.setVisible(false);
        }
        */
    }

    selectNextItem(sound) {
        if(this.selectedItemIndex < this.items.length - 1) {
            this.selectedItemIndex++;      
            
            sound.play("menuSwitchItemSound");
        }
            
        this.refreshColorsAndMarker();        
    }

    selectPreviousItem(sound) {
        if(this.selectedItemIndex > 0) {
            this.items[this.selectedItemIndex].setColor(this.nonHighlightedColor());
            this.selectedItemIndex--;        

            sound.play("menuSwitchItemSound");
        }

        this.refreshColorsAndMarker();        
    }

    trySelectNextSubItem(sound) {
       var temp = this.items[this.selectedItemIndex];
       if(temp instanceof ComplexMenuItem)
       {
            var item = <ComplexMenuItem>this.items[this.selectedItemIndex];
            item.selectNextItem();

            sound.play("menuSwitchItemSound");
       }       
    }

    confirmSelection(sound) {
        sound.play("menuSelectSound");
    }

    trySelectPreviousSubItem(sound) {
        var temp = this.items[this.selectedItemIndex];
        if(temp instanceof ComplexMenuItem)
        {
             var item = <ComplexMenuItem>this.items[this.selectedItemIndex];
             item.selectPreviousItem();

             sound.play("menuSwitchItemSound");
        }   
     }

     show() {
        this.title.setVisible(true);
        
        if(this.titleIcon != null)
            this.titleIcon.setVisible(true);

        if(this.subtitle != null)
            this.subtitle.setVisible(true);

        if(this.footer != null)
            this.footer.setVisible(true);
        
        if(this.footer2 != null)
            this.footer2.setVisible(true);
        
        this.marker.setVisible(true);

        if(this.subItemMarkerLeft != null)
            this.subItemMarkerLeft.setVisible(true);

        if(this.subItemMarkerRight != null)
            this.subItemMarkerRight.setVisible(true);
        
        this.items.forEach(x => {
            x.setVisible(true);
            if(x instanceof ComplexMenuItem) {
                var icon = x.titleIcon;
                if(icon != null)
                    icon.setVisible(true);
            }
        });
     }

     hide() {
        this.title.setVisible(false);

        if(this.titleIcon != null)
            this.titleIcon.setVisible(false);
        
        if(this.subtitle != null)
            this.subtitle.setVisible(false);

        if(this.footer != null)
            this.footer.setVisible(false);
        
        if(this.footer2 != null)
            this.footer2.setVisible(false);
        
        this.marker.setVisible(false);

        if(this.subItemMarkerLeft != null)
            this.subItemMarkerLeft.setVisible(false);

        if(this.subItemMarkerRight != null)
            this.subItemMarkerRight.setVisible(false);
        
        this.items.forEach(x => {
            x.setVisible(false);
            if(x instanceof ComplexMenuItem) {
                var icon = x.titleIcon;
                if(icon != null)
                    icon.setVisible(false);
            }
        });
    }
}

export class MenuItem extends Phaser.GameObjects.Text {
    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.text = params.text;
    }
}

export class MenuLinkItem extends Phaser.GameObjects.Text {
    menuDestinationLink: Menu;

    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.menuDestinationLink = params.menuDestinationLink;
        this.text = params.text;
    }

    getDestinationMenu(): Menu {
        return this.menuDestinationLink;
    }
}

export class StartGameMenuItem extends Phaser.GameObjects.Text {

    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.text = params.text;
    }    
}

export class StartMultiplayerGameMenuItem extends Phaser.GameObjects.Text {

    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.text = params.text;
    }    
}

export class ContinueGameMenuItem extends Phaser.GameObjects.Text {

    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.text = params.text;
    }    
}

export class ComplexMenuItem extends Phaser.GameObjects.Text {
    subItems: Array<IconValueMapping>;
    itemTitle: string;
    selectedSubItemIndex: integer;
    titleIcon: Phaser.GameObjects.Image;

    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.itemTitle = params.text;
        this.subItems = params.subItems;
        
        this.selectedSubItemIndex = 0;

        this.refreshText();
    }    

    setIcon(scene: Phaser.Scene, texture: string, frame: string, scale: number) {
        //this.titleIcon = scene.add.image(this.x - this.width / 2 - 100, this.y, texture, frame);
        this.titleIcon = scene.add.image(this.x - 100, this.y, texture, frame);
        this.titleIcon.setOrigin(0.5, 0.5);
        this.titleIcon.setScale(scale, scale);
        
        this.titleIcon.setDepth(1);
    }

    selectNextItem() {
        if(this.selectedSubItemIndex < this.subItems.length - 1)
            this.selectedSubItemIndex++;        

        this.refreshText();
    }

    selectPreviousItem() {
        if(this.selectedSubItemIndex > 0)
            this.selectedSubItemIndex--;        

        this.refreshText();
    }

    private refreshText() {
        var subItem = this.subItems[this.selectedSubItemIndex];
        this.text = this.itemTitle + ' - ' + subItem.description;
        if(this.titleIcon != null)
            this.titleIcon.setTexture(subItem.texture, subItem.frame);
            //this.titleIcon.setVisible(true);
    }
}


export class IconValueMapping {
    description: string;
    texture: string;
    frame: string;
    scale: number;

    constructor(params) {
        this.description = params.description;
        this.texture = params.texture;
        this.frame = params.frame;
        this.scale = params.scale;
    }
}
