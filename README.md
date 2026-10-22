random_maps
===========

A (very) minimal interface for creating random maps.

Running locally
---------------

The app uses native ES modules, which browsers won't load over `file://`, so opening `index.html` directly won't work. Serve the repo root with a local server instead:

```
python3 -m http.server
```

Then open http://localhost:8000.

There is no build step and there are no dependencies.

Layout: `index.html`, `src/` modules (`config.js`, `terrain.js`, `render.js`, `main.js`), `map.css`, `bijou.min.css`.
