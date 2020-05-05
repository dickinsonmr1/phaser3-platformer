export class World {
    map: Phaser.Tilemaps.Tilemap;
    
    layer01: Phaser.Tilemaps.StaticTilemapLayer;
    layer03: Phaser.Tilemaps.StaticTilemapLayer;
    layer03A: Phaser.Tilemaps.StaticTilemapLayer;
    layer04: Phaser.Tilemaps.StaticTilemapLayer;
    layer05: Phaser.Tilemaps.DynamicTilemapLayer;
    layer06: Phaser.Tilemaps.StaticTilemapLayer;
    layer07: Phaser.Tilemaps.DynamicTilemapLayer;
    layer02: Phaser.Tilemaps.DynamicTilemapLayer;
    isWorldLoaded: boolean;
    sky: Phaser.GameObjects.TileSprite;
}