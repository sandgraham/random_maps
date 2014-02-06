// Experiment with Midpoint Displacement Algorithm

// map constructor
function Map() {
	// modifiable
	this.tileSize = 1;
	this.roughness = 10;
	// constants
	this.mapSize = 1024;
	this.mapFraction = 2;
	this.mapCanvasW = 500;
	this.mapCanvasH = 500;
	this.mapCanvasTileW = this.mapCanvasW / this.tileSize;
  	this.mapCanvasTileH = this.mapCanvasH / this.tileSize;
  	this.mapTileCount = this.mapSize/this.mapFraction;
  	this.mapTileMax = this.mapTileCount-1;
  	this.mapTileMultiplier = this.tileSize / this.mapFraction; // 1, 2, 4, 8
  	this.mapTileSquare = this.mapTileMultiplier*this.mapTileMultiplier; // 1, 4, 16, 64
  	this.mapCanvasHalfTiles = this.mapCanvasTileW/2;
}

// globals
var map = new Map();
var mapData = multiDimensionalArray( map.mapSize+1, map.mapSize+1 );
var mapArray;
var mapOffsetX, mapOffsetY, drawOffsetX, drawOffsetY;

// canvas
var mapCanvas = document.getElementById("mapCanvas");
var mapContext = mapCanvas.getContext("2d");
mapCanvas.width = map.mapCanvasW;
mapCanvas.height = map.mapCanvasH;

// seedMap
// starts off the map generation, seeds the first 4 corners
function seedMap(dataObject) {
	var x = map.mapSize, y = map.mapSize, tr, tl, t, br, bl, b, r, l, center;
	
	// top left
	dataObject[0][0] = Math.random();
	tl = dataObject[0][0];
		
	// bottom left
	dataObject[0][map.mapSize] = Math.random();
	bl = dataObject[0][map.mapSize];
		
	// top right
	dataObject[map.mapSize][0] = Math.random();
	tr = dataObject[map.mapSize][0];
		
	// bottom right
	dataObject[map.mapSize][map.mapSize] = Math.random();
	br = dataObject[map.mapSize][map.mapSize]
		
	// center
	dataObject[map.mapSize / 2][map.mapSize / 2] = dataObject[0][0] + dataObject[0][map.mapSize] + dataObject[map.mapSize][0] + dataObject[map.mapSize][map.mapSize] / 4;
	dataObject[map.mapSize / 2][map.mapSize / 2] = normalize(dataObject[map.mapSize / 2][map.mapSize / 2]);
	center = dataObject[map.mapSize / 2][map.mapSize / 2];
		
	dataObject[map.mapSize / 2][map.mapSize] = bl + br + center / 3;
	dataObject[map.mapSize / 2][0] = tl + tr + center / 3;
	dataObject[map.mapSize][map.mapSize / 2] = tr + br + center / 3;
	dataObject[0][map.mapSize / 2] = tl + bl + center / 3;
		
	// call displacment 
	midpointDisplacement(dataObject, map.mapSize);
}

// terrain generation
// Based on Make No Wonder http://www.matthewhollett.com/wonder/
function midpointDisplacement(dataObject, dimension) {
	var newDimension = dimension / 2, top, topRight, topLeft, bottom, bottomLeft, bottomRight, right, left, center, i, j;
		
	if (newDimension > map.mapFraction) {
		for (var i=newDimension; i<=map.mapSize; i+=newDimension) {
			for (var j=newDimension; j<=map.mapSize; j+=newDimension) {
				x = i - (newDimension / 2);
				y = j - (newDimension / 2);
					
				topLeft = dataObject[i - newDimension][j - newDimension];
				topRight = dataObject[i][j - newDimension];
				bottomLeft = dataObject[i - newDimension][j];
				bottomRight = dataObject[i][j];
					
				// center				
				dataObject[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(dimension);
				dataObject[x][y] = normalize(dataObject[x][y]);
				center = dataObject[x][y];
				//console.log("center: " + x + " " + y);	
					
				// top
				if (j - (newDimension * 2) + (newDimension / 2) > 0) {
					dataObject[x][j - newDimension] = (topLeft + topRight + center + dataObject[x][j - dimension + (newDimension / 2)]) / 4 + displace(dimension);
				} else {
					dataObject[x][j - newDimension] = (topLeft + topRight + center) / 3+ displace(dimension);
				}
					dataObject[x][j - newDimension] = normalize(dataObject[x][j - newDimension]);
				//console.log("top: " + x + " " + (j-newDimension));
			
				// bottom
				if (j + (newDimension / 2) < map.mapSize) {
					dataObject[x][j] = (bottomLeft + bottomRight + center + dataObject[x][j + (newDimension / 2)]) / 4+ displace(dimension);
				} else {
					dataObject[x][j] = (bottomLeft + bottomRight + center) / 3+ displace(dimension);
				}
					
				dataObject[x][j] = normalize(dataObject[x][j]);
				//console.log("bottom: " + x + " " + j);


				// right
				if (i + (newDimension / 2) < map.mapSize) {
					dataObject[i][y] = (topRight + bottomRight + center + dataObject[i + (newDimension / 2)][y]) / 4+ displace(dimension);
				} else {
					dataObject[i][y] = (topRight + bottomRight + center) / 3+ displace(dimension);
				}
					
				dataObject[i][y] = normalize(dataObject[i][y]);
				//console.log("right: " + i + " " + y);
					
				// left
				if (i - (newDimension * 2) + (newDimension / 2) > 0) {
					dataObject[i - newDimension][y] = (topLeft + bottomLeft + center + dataObject[i - dimension + (newDimension / 2)][y]) / 4 + displace(dimension);
				} else {
					dataObject[i - newDimension][y] = (topLeft + bottomLeft + center) / 3+ displace(dimension);
				}
					
				dataObject[i - newDimension][y] = normalize(dataObject[i - newDimension][y]);
				//console.log("left: " + (i-newDimension) + " " + y);
			}
		}
		midpointDisplacement(dataObject, newDimension);
	}
}

function generateMap() {
	mapArray = multiDimensionalArray(map.mapTileCount, map.mapTileCount);

	// build mapArray from mapData, round terrain values, fix terrain value spikes
	for (var x=0; x<map.mapTileCount; x++) {
	 	for (var y=0; y<map.mapTileCount; y++) {
	    	mapArray[x][y] = Math.round(mapData[x*map.mapFraction][y*map.mapFraction]*100)/100; // round terrain values to .00 places
	    	if (mapArray[x][y] > 1) {
		 	  	mapArray[x][y] = 1;
		 	}
		}
	}
}

function drawMap() {
	mapContext.clearRect(0, 0, map.mapCanvasW, map.mapCanvasH);

	// if view area is odd number of tiles wide and high (map.mapCanvasTileW%2 is 0 if even number of tiles, 1 if odd number of tiles)
	map.mapCanvasHalfTiles = map.mapCanvasTileW/2;
  	if (map.mapCanvasTileW%2) {
   		map.mapCanvasHalfTiles = map.mapCanvasHalfTiles - 0.5;
  	}

  	mapOffsetX = Math.round(map.mapTileCount/2) - map.mapCanvasHalfTiles; // @ center
	mapOffsetY = Math.round(map.mapTileCount/2) - map.mapCanvasHalfTiles; // @ center
  	drawOffsetX = mapOffsetX * map.tileSize;
  	drawOffsetY = mapOffsetY * map.tileSize;

  	drawTerrain();
}

function drawTerrain() {

	// water, waves
	mapContext.fillStyle = '#5591b0';
	for (var x=0; x<=map.mapCanvasTileW; x++) {
	for (var y=0; y<=map.mapCanvasTileH; y++) {
		if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < map.mapTileCount) {
		if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < map.mapTileCount) {
			if (mapArray[x+mapOffsetX][y+mapOffsetY] <= 0.45 || (mapArray[x+mapOffsetX][y+mapOffsetY] > 3 && mapArray[x+mapOffsetX][y+mapOffsetY] < 5)) {
				mapContext.fillRect(x*map.tileSize, y*map.tileSize, map.tileSize, map.tileSize);
			}
		}
		}
	}
	}

	// shallows
	mapContext.fillStyle = '#67A0B7';
	for (var x=0; x<=map.mapCanvasTileW; x++) {
	for (var y=0; y<=map.mapCanvasTileH; y++) {
		if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < map.mapTileCount) {
		if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < map.mapTileCount) {
			if (mapArray[x+mapOffsetX][y+mapOffsetY] > 0.45 && mapArray[x+mapOffsetX][y+mapOffsetY] <= 0.55) {
				mapContext.fillRect(x*map.tileSize, y*map.tileSize, map.tileSize, map.tileSize);
			}
		}
		}
	}
	}

	// sand
	mapContext.fillStyle = '#D3D1A5';
	for (var x=0; x<=map.mapCanvasTileW; x++) {
	for (var y=0; y<=map.mapCanvasTileH; y++) {
		if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < map.mapTileCount) {
		if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < map.mapTileCount) {
			if (mapArray[x+mapOffsetX][y+mapOffsetY] > 0.55 && mapArray[x+mapOffsetX][y+mapOffsetY] <= 0.6) {
				mapContext.fillRect(x*map.tileSize, y*map.tileSize, map.tileSize, map.tileSize);
			}
		}
		}
	}
	}

	// field
	mapContext.fillStyle = '#91B58C';
	for (var x=0; x<=map.mapCanvasTileW; x++) {
	for (var y=0; y<=map.mapCanvasTileH; y++) {
		if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < map.mapTileCount) {
		if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < map.mapTileCount) {
			if ( mapArray[x+mapOffsetX][y+mapOffsetY] > 0.6 && mapArray[x+mapOffsetX][y+mapOffsetY] <= 0.85 ) {
				mapContext.fillRect(x*map.tileSize, y*map.tileSize, map.tileSize, map.tileSize);
			}
		}
		}
	}
	}

	// field 2
	mapContext.fillStyle = '#8AAD86';
	for (var x=0; x<=map.mapCanvasTileW; x++) {
	for (var y=0; y<=map.mapCanvasTileH; y++) {
		if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < map.mapTileCount) {
		if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < map.mapTileCount) {
			if ((mapArray[x+mapOffsetX][y+mapOffsetY] > 0.85 && mapArray[x+mapOffsetX][y+mapOffsetY] < 0.92) || (mapArray[x+mapOffsetX][y+mapOffsetY] === 2.4)) {
				mapContext.fillRect(x*map.tileSize, y*map.tileSize, map.tileSize, map.tileSize);
			}
		}
		}
	}
	}

	// mountain
	mapContext.fillStyle = '#8c9074';
	for (var x=0; x<=map.mapCanvasTileW; x++) {
	for (var y=0; y<=map.mapCanvasTileH; y++) {
		if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < map.mapTileCount) {
		if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < map.mapTileCount) {
			if (mapArray[x+mapOffsetX][y+mapOffsetY] >= 0.92 && mapArray[x+mapOffsetX][y+mapOffsetY] < 0.99) {
				mapContext.fillRect(x*map.tileSize, y*map.tileSize, map.tileSize, map.tileSize);
			}
		}
		}
	}
	}

	// snow cap
	mapContext.fillStyle = '#8c9074';
	for (var x = 0; x<=map.mapCanvasTileW; x++) {
	for (var y=0; y<=map.mapCanvasTileH; y++) {
		if (typeof(mapArray[x+mapOffsetX]) !== "undefined" && x+mapOffsetX < map.mapTileCount) {
		if (typeof(mapArray[x+mapOffsetX][y+mapOffsetY]) !== "undefined" && y+mapOffsetY < map.mapTileCount) {
			if (mapArray[x+mapOffsetX][y+mapOffsetY] >= 0.99) {
				mapContext.fillRect(x*map.tileSize, y*map.tileSize, map.tileSize, map.tileSize);
			}
		}
		}
	}
	}

}


// HELPER FUNCTIONS
// create a multi-dimensional array (don't need to fill array, just create it)
function multiDimensionalArray(nRows, nCols) {
	var a = [nRows];
	for (var i=0; i<nRows; i++) {
		var b = [];
		b.length = nCols;
		a[i] = b;
	}
	return a;
}

// normalize a value to make sure it is within bounds
function normalize(value) {
	if (value > 1) {
		value = 1;
	} else if (value < 0) {
		value = 0;
	}
	return value;
}

// random function to offset map center
function displace(num) {
		var max = num / (map.mapSize + map.mapSize) * map.roughness;
		return (Math.random() - 0.5) * max;
}

//------------------------------------------------------------------
//------------------------------------------------------------------
// SEED AND START MAP

$(document).ready(function(){
	var create_button = $('#create');

	seedMap(mapData);
	generateMap();
	drawMap();

	create_button.click(function(){
		var roughness = parseInt($('#roughness-input').val());
		if (roughness) {
			map.roughness = roughness;
		} else {
			map.roughness = 10;
		}
		var altitude = parseInt($('#altitude-input').val());
		console.log(altitude);
		if (altitude) {
			var tileSize;
			switch (altitude) {
				case 1 : tileSize = 10; break;
				case 2 : tileSize = 5; break;
				case 3 : tileSize = 4; break;
				case 4 : tileSize = 2; break;
				case 5 : tileSize = 1; break;
				// case 6 : tileSize = 25; break;
				// case 7 : tileSize = 20; break;
				// case 8 : tileSize = 10; break;
				// case 9 : tileSize = 5; break;
				// case 10 : tileSize = 4; break;
				// case 11 : tileSize = 2; break;
				// case 12 : tileSize = 1; break; 
			}
			map.tileSize = tileSize;
		} else {
			map.tileSize = 1;
		}

		seedMap(mapData);
		generateMap();
		drawMap();
	})

	create_button.hover(function(){
		create_button.toggleClass('create-hover');
		$('.create-text').toggleClass('create-text-hover');
	}, function(){
		create_button.toggleClass('create-hover');
		$('.create-text').toggleClass('create-text-hover');
	})
})


