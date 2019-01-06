"use strict";
/// <reference path='../lib/phaser.d.ts'/>
var Example;
(function (Example) {
    var InitPhaser = /** @class */ (function () {
        function InitPhaser() {
        }
        InitPhaser.initGame = function () {
            var config = {
                type: Phaser.AUTO,
                width: 1280,
                height: 720,
                scene: [],
                banner: true,
                title: 'Example',
                url: 'http://mdickinson.me',
                version: '1.0.0'
            };
            this.gameRef = new Phaser.Game(config);
        };
        return InitPhaser;
    }());
    Example.InitPhaser = InitPhaser;
})(Example || (Example = {}));
window.onload = function () {
    Example.InitPhaser.initGame();
};
