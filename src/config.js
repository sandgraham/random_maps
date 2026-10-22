// map settings
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
	config.mapTileCount = config.mapSize / config.mapFraction;
	return config;
};
