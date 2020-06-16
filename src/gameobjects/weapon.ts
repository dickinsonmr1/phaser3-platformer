export enum WeaponType {
    LaserPistol,
    LaserRepeater, 
    PulseCharge,
    RocketLauncher
}

export class Weapon {

    weaponType: WeaponType;
    bulletVelocityX: number;
    bulletName: string;
    weaponSoundName: string;
    weaponDamage: number;
    playerStandingBulletOffsetY: number;
    bulletTimeInterval: number;
    maxAmmo: number;
    currentAmmo: number;

    constructor(weaponType: WeaponType,
        bulletVelocityX: number,
        bulletName: string,
        weaponSoundName: string,
        weaponDamage: number,
        playerStandingBulletOffsetY: number,
        bulletTimeInterval: number,
        maxAmmo: number) {

            this.weaponType = weaponType;
            this.bulletVelocityX = bulletVelocityX;
            this.bulletName = bulletName;
            this.weaponSoundName = weaponSoundName;
            this.weaponDamage = weaponDamage;
            this.playerStandingBulletOffsetY = playerStandingBulletOffsetY;
            this.bulletTimeInterval = bulletTimeInterval;
            this.maxAmmo = maxAmmo;
            this.currentAmmo = maxAmmo;
    }
}

export class LaserPistol extends Weapon {
    constructor() {
        super(WeaponType.LaserPistol,
            700,
            'playerGunLaser1',
           'laser1Sound',
           50,
           45,
           300,
           10);
    }
}

export class LaserRepeater extends Weapon {
    constructor() {
        super(WeaponType.LaserRepeater,
            900,
            'playerGunLaser2',
           'laser2Sound',
           100,
           45,
           200,
           30);
    }
}

export class PulseCharge extends Weapon {
    constructor() {
        super(WeaponType.PulseCharge,
            900,
            'playerGunLaser3',
           'laser3Sound',
           150,
           70,
           500,
           10);
    }
}

export class RocketLauncher extends Weapon {
    constructor() {
        super(WeaponType.RocketLauncher,
            1000,
            'playerRocket2',
           'laser4Sound',
           500,
           45,
           750,
           5);
    }
}