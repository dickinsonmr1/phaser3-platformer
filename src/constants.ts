
export class Constants {
    // 1012, 981, 1076, 1044, 1013, 233, 1898, 1771, 1803, 1835, 1867, 1482, 1514, 1772
    public static get tileKeyBlueKey(): number { return 1012; }
    public static get tileKeyGemGreen(): number { return 981; }
    public static get tileKeyGemRed(): number { return 1076; }
    public static get tileKeyGemYellow(): number { return 1044; }
    public static get tileKeyGemBlue(): number { return 1013; }
    public static get tileKeyBattery(): number { return 233; }
    public static get tileKeySpring1(): number { return 1898; }
    public static get tileKeySpring2(): number { return 1930; }
    public static get tileLockYellow(): number { return 1771; }
    public static get tileLockRed(): number { return 1803; }
    public static get tileLockGreen(): number { return 1835; }
    public static get tileLockBlue(): number { return 1867; }
    public static get tileWaterTop(): number { return 1482; }
    public static get tileWater(): number { return 1514; }
    public static get tileOpenDoor(): number { return 1772; }
    public static get tileDoorTitle(): number { return 217; }

    public static get tileHealth(): number { return 848; }
    
    public static get tileGun1(): number { return 357; }
    public static get tileGun2(): number { return 358; }
    public static get tileGun3(): number { return 355; }
    public static get tileGun4(): number { return 356; }    

    public static get playerBlueSpawnTile(): number { return 3078; }
    public static get playerPinkSpawnTile(): number { return 3049; }
    public static get playerYellowSpawnTile(): number { return 3035; }
    public static get playerTanSpawnTile(): number { return 3006; }
    public static get playerGreenSpawnTile(): number { return 2897; }
    public static get playerSpaceShipSpawnTile(): number { return 3000; }

    public static get portalBlueTile(): number { return 671; }
    public static get portalRedTile(): number { return 716; }
    public static get portalGreenTile(): number { return 715; }
    public static get portalYellowTile(): number { return 672; }
    
    public static get enemy01SpawnTile(): number { return 2967; }
    public static get enemy02SpawnTile(): number { return 2953; }
    public static get enemy03SpawnTile(): number { return 2939; }
    public static get enemy04SpawnTile(): number { return 2925; }
    public static get enemy05SpawnTile(): number { return 2911; }
    public static get enemy06SpawnTile(): number { return 2924; }
    public static get enemy07SpawnTile(): number { return 2910; }
    public static get enemy08SpawnTile(): number { return 2896; }
    public static get enemy09SpawnTile(): number { return 3077; }
    public static get enemy10SpawnTile(): number { return 3063; }

    public static get tileTwoSpikesGround(): number { return 142; }
    public static get tileTwoSpikesCeiling(): number { return 98; }
    public static get tileSawBlade(): number { return 187; }
    public static get tileSawBladeinGround1(): number { return 188; }
    public static get tileSawBladeinGround2(): number { return 189; }
    public static get tileThreeSpikesFloor(): number { return 1962; }

    // the next block is not updated yet
    public static get tileYellowFlagDown(): number { return 129; }
    public static get tileYellowFlagWave1(): number { return 150; }
    public static get tileYellowFlagWave2(): number { return 155; }
    public static get tileGreenFlagDown(): number { return 146; }
    public static get tileGreenFlagWave1(): number { return 130; }
    public static get tileGreenFlagWave2(): number { return 138; }
    public static get tileBlueFlagDown(): number { return 139; }
    public static get tileBlueFlagWave1(): number { return 154; }
    public static get tileBlueFlagWave2(): number { return 131; }
    public static get tileRedFlagDown(): number { return 153; }
    public static get tileRedFlagWave1(): number { return 137; }
    public static get tileRedFlagWave2(): number { return 145; }

    
    public static get depthSky(): number {return 0;}
    public static get depthLayer01(): number {return 1;}
    public static get depthLayer02(): number {return 2;}

    public static get depthSprings(): number {return 2;}
    public static get depthPortals(): number {return 2;}
    
    public static get depthEnemies(): number {return 3;}
    public static get depthPlayer(): number  {return 3;}
    public static get depthBullets(): number {return 3;}

    public static get depthParticles(): number {return 4;}

    public static get depthLayer03(): number {return 4;}
    public static get depthLayer04(): number {return 5;}
    public static get depthLayer05(): number {return 6;}
    public static get depthExpiringMessages(): number {return 7;}
    public static get depthHealthBar(): number {return 7;}

    //618, 617, 620, 619, 576, 575, 574, 573
    //https://labs.phaser.io/edit.html?src=src\game%20objects\tilemap\dynamic\put%20tiles.js
    public static get tileRedSwitchOn(): number { return 617; }
    public static get tileRedSwitchOff(): number { return 618; }
    public static get tileBlueSwitchOn(): number { return 619; }
    public static get tileBlueSwitchOff(): number { return 620; }
    public static get tileGreenSwitchOn(): number { return 575; }
    public static get tileGreenSwitchOff(): number { return 576; }
    public static get tileYellowSwitchOn(): number { return 573; }
    public static get tileYellowSwitchOff(): number { return 574; }

    public static get tileYellowEnergyBeamHorizontal(): number { return 625; }
    public static get tileYellowEnergyBeamVertical(): number { return 581; }
    public static get tileGreenEnergyBeamHorizontal(): number { return 626; }
    public static get tileGreenEnergyBeamVertical(): number { return 582; }
    public static get tileRedEnergyBeamHorizontal(): number { return 627; }
    public static get tileRedEnergyBeamVertical(): number { return 583; }
    public static get tileBlueEnergyBeamHorizontal(): number { return 628; }
    public static get tileBlueEnergyBeamVertical(): number { return 584; }
    
    public static get enemySpeed(): number {return 200;}
    public static get playerDrawScale(): number {return 0.5;}
    public static get enemyDrawScale(): number {return 1;}
    public static get playerOffsetX(): number {return 32;}
    public static get playerOffsetY(): number {return 128;}

    public static get gemScore(): number {return 100;}
    
    public static get playerDuckingGunOffsetY(): number {return 12;}
    public static get enemyOffsetY(): number {return 10;}    

    public static get gamepadIndexSelect (): number {return 0;}   
    public static get gamepadIndexInteract (): number {return 2;}   
    public static get gamepadIndexLeft (): number {return 14;}   
    public static get gamepadIndexRight (): number {return 15;}   
    public static get gamepadIndexUp (): number {return 12;}   
    public static get gamepadIndexDown (): number {return 13;}   

    public static get gamepadIndexJump (): number {return 13;}   
    
    // A 0
    // B 1
    // X 2
    // Y 3
    // LB 4
    // RB 5
    // LT 6
    // RT 7
    // window 8
    // options 9
    // LS 10
    // RS 11
    // up 12
    // down 13
    // left 14
    // right 15
}

export enum ForceFieldColor {
    Yellow,
    Blue,
    Green,
    Red
}