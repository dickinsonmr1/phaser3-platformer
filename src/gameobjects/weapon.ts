export enum WeaponType {
    LaserPistol,
    LaserRepeater, 
    PulseCharge,
    RocketLauncher
}

export class Weapon {

    weaponType: WeaponType;
    weaponDisplayName: string;
    bulletVelocityX: number;
    bulletName: string;
    weaponSoundName: string;
    weaponDamage: number;
    playerStandingBulletOffsetY: number;
    bulletTimeInterval: number;
    maxAmmo: number;
    currentAmmo: number;

    constructor(weaponType: WeaponType,
        weaponDisplayName: string,
        bulletVelocityX: number,
        bulletName: string,
        weaponSoundName: string,
        weaponDamage: number,
        playerStandingBulletOffsetY: number,
        bulletTimeInterval: number,
        maxAmmo: number) {

            this.weaponType = weaponType;
            this.weaponDisplayName = weaponDisplayName;
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
            "LASER PISTOL",
            700,
            'playerGunLaser1',
           'laser1Sound',
           50,
           35,
           300,
           10);
    }
}

export class LaserRepeater extends Weapon {
    constructor() {
        super(WeaponType.LaserRepeater,
            "LASER REPEATER",
            900,
            'playerGunLaser2',
           'laser2Sound',
           100,
           35,
           200,
           30);
    }
}

export class PulseCharge extends Weapon {
    constructor() {
        super(WeaponType.PulseCharge,
            "PULSE CHARGE",
            900,
            'playerGunLaser3',
           'laser3Sound',
           150,
           30,
           500,
           10);
    }
}

export class RocketLauncher extends Weapon {
    constructor() {
        super(WeaponType.RocketLauncher,
            "ROCKET LAUNCHER",
            1000,
            'playerRocket2',
           'laser4Sound',
           500,
           35,
           750,
           5);
    }
}