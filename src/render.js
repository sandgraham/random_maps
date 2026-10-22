import { multiDimensionalArray } from './terrain.js';

// build mapArray from mapData, round terrain values, fix terrain value spikes
export const generateMap = (config, mapData) => {
	const mapArray = multiDimensionalArray(config.mapTileCount, config.mapTileCount);

	for (let x = 0; x < config.mapTileCount; x++) {
		for (let y = 0; y < config.mapTileCount; y++) {
			mapArray[x][y] = Math.round(mapData[x * config.mapFraction][y * config.mapFraction] * 100) / 100; // round terrain values to .00 places
			if (mapArray[x][y] > 1) {
				mapArray[x][y] = 1;
			}
		}
	}
	return mapArray;
};

// each pass fills the tiles whose height matches
const passes = [
	// water, waves
	['#5591b0', (v) => v <= 0.45 || (v > 3 && v < 5)],
	// shallows
	['#67A0B7', (v) => v > 0.45 && v <= 0.55],
	// sand
	['#D3D1A5', (v) => v > 0.55 && v <= 0.6],
	// field
	['#91B58C', (v) => v > 0.6 && v <= 0.85],
	// field 2
	['#8AAD86', (v) => (v > 0.85 && v < 0.92) || v === 2.4],
	// mountain
	['#8c9074', (v) => v >= 0.92 && v < 0.99],
	// snow cap
	['#8c9074', (v) => v >= 0.99],
];

export const drawTerrain = (config, context, mapArray, mapOffsetX, mapOffsetY) => {
	const { tileSize } = config;

	for (const [color, matches] of passes) {
		context.fillStyle = color;
		for (let x = 0; x <= config.mapCanvasTileW; x++) {
			for (let y = 0; y <= config.mapCanvasTileH; y++) {
				if (typeof mapArray[x + mapOffsetX] !== 'undefined' && x + mapOffsetX < config.mapTileCount) {
					if (typeof mapArray[x + mapOffsetX][y + mapOffsetY] !== 'undefined' && y + mapOffsetY < config.mapTileCount) {
						if (matches(mapArray[x + mapOffsetX][y + mapOffsetY])) {
							context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
						}
					}
				}
			}
		}
	}
};

export const drawMap = (config, context, mapArray) => {
	context.clearRect(0, 0, config.mapCanvasW, config.mapCanvasH);

	// if view area is odd number of tiles wide and high (mapCanvasTileW%2 is 0 if even number of tiles, 1 if odd number of tiles)
	config.mapCanvasHalfTiles = config.mapCanvasTileW / 2;
	if (config.mapCanvasTileW % 2) {
		config.mapCanvasHalfTiles = config.mapCanvasHalfTiles - 0.5;
	}

	const mapOffsetX = Math.round(config.mapTileCount / 2) - config.mapCanvasHalfTiles; // @ center
	const mapOffsetY = Math.round(config.mapTileCount / 2) - config.mapCanvasHalfTiles; // @ center

	drawTerrain(config, context, mapArray, mapOffsetX, mapOffsetY);
};
