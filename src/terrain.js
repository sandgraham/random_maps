// Experiment with Midpoint Displacement Algorithm
// Based on Make No Wonder

// create a multi-dimensional array (don't need to fill array, just create it)
export const multiDimensionalArray = (nRows, nCols) => {
	var a = [nRows];
	for (let i = 0; i < nRows; i++) {
		const b = [];
		b.length = nCols;
		a[i] = b;
	}
	return a;
};

// normalize a value to make sure it is within bounds
export const normalize = (value) => {
	if (value > 1) {
		value = 1;
	} else if (value < 0) {
		value = 0;
	}
	return value;
};

// random function to offset map center
const displace = (config, num) => {
	const max = num / (config.mapSize + config.mapSize) * config.roughness;
	return (Math.random() - 0.5) * max;
};

// terrain generation
const midpointDisplacement = (config, dataObject, dimension) => {
	const newDimension = dimension / 2;
	let topLeft, topRight, bottomLeft, bottomRight, center, x, y;

	if (newDimension > config.mapFraction) {
		for (let i = newDimension; i <= config.mapSize; i += newDimension) {
			for (let j = newDimension; j <= config.mapSize; j += newDimension) {
				x = i - (newDimension / 2);
				y = j - (newDimension / 2);

				topLeft = dataObject[i - newDimension][j - newDimension];
				topRight = dataObject[i][j - newDimension];
				bottomLeft = dataObject[i - newDimension][j];
				bottomRight = dataObject[i][j];

				// center
				dataObject[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(config, dimension);
				dataObject[x][y] = normalize(dataObject[x][y]);
				center = dataObject[x][y];

				// top
				if (j - (newDimension * 2) + (newDimension / 2) > 0) {
					dataObject[x][j - newDimension] = (topLeft + topRight + center + dataObject[x][j - dimension + (newDimension / 2)]) / 4 + displace(config, dimension);
				} else {
					dataObject[x][j - newDimension] = (topLeft + topRight + center) / 3 + displace(config, dimension);
				}
				dataObject[x][j - newDimension] = normalize(dataObject[x][j - newDimension]);

				// bottom
				if (j + (newDimension / 2) < config.mapSize) {
					dataObject[x][j] = (bottomLeft + bottomRight + center + dataObject[x][j + (newDimension / 2)]) / 4 + displace(config, dimension);
				} else {
					dataObject[x][j] = (bottomLeft + bottomRight + center) / 3 + displace(config, dimension);
				}
				dataObject[x][j] = normalize(dataObject[x][j]);

				// right
				if (i + (newDimension / 2) < config.mapSize) {
					dataObject[i][y] = (topRight + bottomRight + center + dataObject[i + (newDimension / 2)][y]) / 4 + displace(config, dimension);
				} else {
					dataObject[i][y] = (topRight + bottomRight + center) / 3 + displace(config, dimension);
				}
				dataObject[i][y] = normalize(dataObject[i][y]);

				// left
				if (i - (newDimension * 2) + (newDimension / 2) > 0) {
					dataObject[i - newDimension][y] = (topLeft + bottomLeft + center + dataObject[i - dimension + (newDimension / 2)][y]) / 4 + displace(config, dimension);
				} else {
					dataObject[i - newDimension][y] = (topLeft + bottomLeft + center) / 3 + displace(config, dimension);
				}
				dataObject[i - newDimension][y] = normalize(dataObject[i - newDimension][y]);
			}
		}
		midpointDisplacement(config, dataObject, newDimension);
	}
};

// seedMap
// starts off the map generation, seeds the first 4 corners
export const seedMap = (config, dataObject) => {
	const size = config.mapSize;

	// top left
	dataObject[0][0] = Math.random();
	const tl = dataObject[0][0];

	// bottom left
	dataObject[0][size] = Math.random();
	const bl = dataObject[0][size];

	// top right
	dataObject[size][0] = Math.random();
	const tr = dataObject[size][0];

	// bottom right
	dataObject[size][size] = Math.random();
	const br = dataObject[size][size];

	// center
	dataObject[size / 2][size / 2] = dataObject[0][0] + dataObject[0][size] + dataObject[size][0] + dataObject[size][size] / 4;
	dataObject[size / 2][size / 2] = normalize(dataObject[size / 2][size / 2]);
	const center = dataObject[size / 2][size / 2];

	dataObject[size / 2][size] = bl + br + center / 3;
	dataObject[size / 2][0] = tl + tr + center / 3;
	dataObject[size][size / 2] = tr + br + center / 3;
	dataObject[0][size / 2] = tl + bl + center / 3;

	// call displacment
	midpointDisplacement(config, dataObject, size);
};
