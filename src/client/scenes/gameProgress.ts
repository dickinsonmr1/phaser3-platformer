export class GameProgress {

    // https://www.dynetisgames.com/2018/10/28/how-save-load-player-progress-localstorage/
    // https://github.com/Jerenaux/clicker/blob/master/js/game.js
    public loadAllSaveFiles(): Array<SaveGameFile> {

        var slot0 = JSON.parse(localStorage.getItem("saveFile0"));
        var slot1 = JSON.parse(localStorage.getItem("saveFile1"));
        var slot2 = JSON.parse(localStorage.getItem("saveFile2"));
        
        var returnItems = new Array<SaveGameFile>();

        if(slot0 != null)
            returnItems.push(slot0);
        if(slot1 != null)
            returnItems.push(slot1);
        if(slot2 != null)
            returnItems.push(slot2);

        return returnItems;
    }

    public save(destinationName: string) {
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
        saveFile.name = "Slot 1";
        saveFile.destinationName = destinationName;

        localStorage.setItem('saveFile0', JSON.stringify(saveFile));
    }

    public deleteAll() {
        localStorage.clear();
    }
}

export class SaveGameFile {
    name: string;
    destinationName: string;
    world01Cleared: boolean;
    world02Cleared: boolean;
    world03Cleared: boolean;
    world04Cleared: boolean;
    world05Cleared: boolean;
    modifiedDateTime: number;
}