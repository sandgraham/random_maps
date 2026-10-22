import { createMapConfig } from './config.js';
import { multiDimensionalArray, seedMap } from './terrain.js';
import { generateMap, drawMap } from './render.js';

const config = createMapConfig();
// one persistent array, reused across generations
const mapData = multiDimensionalArray(config.mapSize + 1, config.mapSize + 1);
let mapArray;

// canvas
const mapCanvas = document.getElementById('mapCanvas');
const mapContext = mapCanvas.getContext('2d');
mapCanvas.width = config.mapCanvasW;
mapCanvas.height = config.mapCanvasH;

const readRoughness = () => {
	const roughness = parseInt(document.getElementById('roughness-input').value, 10);
	return Number.isNaN(roughness) ? 10 : Math.max(0, roughness);
};

const tileSizes = { 1: 10, 2: 5, 3: 4, 4: 2, 5: 1 };

const readTileSize = () => {
	const altitude = parseInt(document.getElementById('altitude-input').value, 10);
	return tileSizes[altitude] ?? 1;
};

const draw = () => {
	config.tileSize = readTileSize();
	drawMap(config, mapContext, mapArray);
};

const generate = () => {
	config.roughness = readRoughness();
	seedMap(config, mapData);
	mapArray = generateMap(config, mapData);
	draw();
};

generate();

document.getElementById('create').addEventListener('click', () => {
	generate();
});

document.getElementById('altitude-input').addEventListener('input', draw);
