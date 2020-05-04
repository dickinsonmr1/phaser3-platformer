export class Menu {
    title: Phaser.GameObjects.Text;
    marker: Phaser.GameObjects.Text;
    items: Phaser.GameObjects.Group;
    selectedIndex: integer;

    menuStartX: number;
    menuStartY: number;

    titleOffsetX(): number {return -100;}
    titleOffsetY(): number {return -100;}

    markerOffsetX(): number {return -100;}
    menuItemDistanceY(): number {return 60;}

    constructor(scene: Phaser.Scene) {
        this.items = scene.add.group();
        this.selectedIndex = 0;

        this.menuStartX = scene.game.canvas.width / 4;
        this.menuStartY = scene.game.canvas.height / 4;
    }

    addMenuItem(scene: Phaser.Scene, text: string) {
        var item = scene.add.text(this.menuStartX, this.menuStartY + this.menuItemDistanceY() * this.items.getLength(), text,
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 64,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        item.setStroke('rgb(0,0,0)', 16);
        this.items.add(item);
    }

    setTitle(scene: Phaser.Scene, text: string) {
        this.title = scene.add.text(this.menuStartX + this.titleOffsetX(), this.menuStartY + this.titleOffsetY(), text,
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 96,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.title.setStroke('rgb(0,0,0)', 16);
    }

    setMarker(scene: Phaser.Scene, text: string) {
        this.marker = scene.add.text(this.menuStartX + this.markerOffsetX(), this.menuStartY, text,
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 64,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.marker.setStroke('rgb(0,0,0)', 16);  
    }

    selectNextItem() {
        if(this.selectedIndex < this.items.getLength() - 1)
            this.selectedIndex++;        

        this.marker.setY(this.menuStartY + this.selectedIndex * this.menuItemDistanceY())
    }

    selectPreviousItem() {
        if(this.selectedIndex > 0)
            this.selectedIndex--;        

        this.marker.setY(this.menuStartY + this.selectedIndex * this.menuItemDistanceY())
    }
 }