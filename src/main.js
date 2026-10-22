import { createMapConfig } from './config.js';
import { multiDimensionalArray, seedMap } from './terrain.js';
import { generateMap, drawMap } from './render.js';

const config = createMapConfig();
// one persistent array, reused across generations
const mapData = multiDimensionalArray(config.mapSize + 1, config.mapSize + 1);

// canvas
const mapCanvas = document.getElementById('mapCanvas');
const mapContext = mapCanvas.getContext('2d');
mapCanvas.width = config.mapCanvasW;
mapCanvas.height = config.mapCanvasH;

const render = () => {
	seedMap(config, mapData);
	drawMap(config, mapContext, generateMap(config, mapData));
};

const tileSizes = { 1: 10, 2: 5, 3: 4, 4: 2, 5: 1 };

render();

document.getElementById('create').addEventListener('click', () => {
	const roughness = parseInt(document.getElementById('roughness-input').value);
	config.roughness = roughness || 10;

	const altitude = parseInt(document.getElementById('altitude-input').value);
	// altitude outside 1-5 gives undefined, as before
	config.tileSize = altitude ? tileSizes[altitude] : 1;

	render();
});
