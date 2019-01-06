/// <reference path='../lib/phaser.d.ts'/>
module Example{
    export class InitPhaser {
 
        static gameRef:Phaser.Game;
 
        public static initGame() {
 
            let config = {
                type: Phaser.AUTO,
                width: 1280,
                height: 720,
                scene: [],
                banner: true,
                title: 'Example',
                url: 'http://mdickinson.me',
                version: '1.0.0'
            }
 
            this.gameRef = new Phaser.Game(config);
        }
    }
}
 
window.onload = () => {
    Example.InitPhaser.initGame();
};