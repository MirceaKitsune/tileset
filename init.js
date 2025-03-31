// Test world

data.load_image_tileset("terrain", "img/tilesets/terrain.png");
data.load_image_tileset("cave", "img/tilesets/cave.png");
data.load_func(load);

const map_test = new map("Init", 8, 8, 4);

const edit = new editor();

function load() {
	console.log("Loaded.");
}
