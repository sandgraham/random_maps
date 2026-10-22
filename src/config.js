// map settings
// derived values are computed once here, with tileSize = 1, and are not recomputed
// when tileSize changes later
export const createMapConfig = () => {
	const config = {
		// modifiable
		tileSize: 1,
		roughness: 10,
		// constants
		mapSize: 1024,
		mapFraction: 2,
		mapCanvasW: 500,
		mapCanvasH: 500,
	};
	config.mapCanvasTileW = config.mapCanvasW / config.tileSize;
	config.mapCanvasTileH = config.mapCanvasH / config.tileSize;
	config.mapTileCount = config.mapSize / config.mapFraction;
	config.mapTileMax = config.mapTileCount - 1;
	config.mapTileMultiplier = config.tileSize / config.mapFraction; // 1, 2, 4, 8
	config.mapTileSquare = config.mapTileMultiplier * config.mapTileMultiplier; // 1, 4, 16, 64
	config.mapCanvasHalfTiles = config.mapCanvasTileW / 2;
	return config;
};
