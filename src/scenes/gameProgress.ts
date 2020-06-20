export class GameProgress {

    // https://www.dynetisgames.com/2018/10/28/how-save-load-player-progress-localstorage/
    // https://github.com/Jerenaux/clicker/blob/master/js/game.js
    public getAvailableSaveFiles() {

    }

    public load() {

    }

    public save() {
        /*
        var file = {
            gemsCollected: this.mainScene.player.gemsCollected,
            health: this.mainScene.player.health
        };
        */

        var saveFile = new SaveGameFile();
        
        saveFile.world01Cleared = true;
        saveFile.world02Cleared = true;
        saveFile.world03Cleared = true;
        saveFile.world04Cleared = true;
        saveFile.world05Cleared = true;
        saveFile.modifiedDateTime = Date.now();

        localStorage.setItem('saveFile', JSON.stringify(saveFile));
    }
}

export class SaveGameFile {
    world01Cleared: boolean;
    world02Cleared: boolean;
    world03Cleared: boolean;
    world04Cleared: boolean;
    world05Cleared: boolean;
    modifiedDateTime: number;
}