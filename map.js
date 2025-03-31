// Tile: [tile_x, tile_y, tile_layer] = [tileset, [[frame1_x, frame1_y], [frame2_x, frame2_y]], speed, collision]
var maps_active = undefined;
var maps = {};

class map {
	constructor(name, tiles_x, tiles_y, layers) {
		maps[name] = this;
		if(!maps_active)
			maps_active = name;

		this.size = [tiles_x, tiles_y];
		this.element = element(undefined, "div", "map", "tileset");
		this.element.style.width = px(this.size[0] * settings.size * settings.zoom);
		this.element.style.height = px(this.size[1] * settings.size * settings.zoom);

		this.tiles = {};
		this.layers = [];

		for (let i = 0; i < layers; i++) {
			this.layers[i] = document.createElement("canvas");
			this.layers[i].setAttribute("class", "tileset_layer");
			this.layers[i].style.zIndex = i;
			this.layers[i].width = this.size[0] * settings.size;
			this.layers[i].height = this.size[1] * settings.size;
			this.element.appendChild(this.layers[i]);
		}

		this.toggle(true);
	}

	toggle(enabled) {
		if(enabled) {
			if(!root.contains(this.element))
				root.appendChild(this.element);
			this.interval = setInterval(this.update.bind(this), settings.rate);
		} else {
			if(root.contains(this.element))
				root.removeChild(this.element);
			clearInterval(this.interval);
		}
	}

	update_tile(pos) {
		const tile = pos.split(",");
		const context = this.layers[tile[2]].getContext("2d");
		context.clearRect(tile[0] * settings.size, tile[1] * settings.size, settings.size, settings.size);

		if(this.tiles[pos]) {
			const parm = {name: this.tiles[pos][0], frames: this.tiles[pos][1], step: this.tiles[pos][2], collision: this.tiles[pos][3]};
			const date = new Date();
			const frame = parm.step > 0 ? Math.floor(date.getTime() / (parm.step * settings.rate)) % parm.frames.length : Math.floor(Math.random() * parm.frames.length);
			const cord = parm.frames[frame].split(",");
			context.drawImage(data.images_tileset[parm.name], cord[0] * settings.size, cord[1] * settings.size, settings.size, settings.size, tile[0] * settings.size, tile[1] * settings.size, settings.size, settings.size);
		}
	}

	update() {
		for(let pos in this.tiles) {
			const parm = {name: this.tiles[pos][0], frames: this.tiles[pos][1], step: this.tiles[pos][2], collision: this.tiles[pos][3]};
			if(parm.frames.length > 0)
				this.update_tile(pos);
		}
	}

	tile_get(pos) {
		const pos_key = pos.toString();
		if(this.tiles[pos_key]) {
			const tiles = [];
			for(let i in this.tiles[pos_key][1])
				tiles[i] = this.tiles[pos_key][1][i].split(",");
			return [this.tiles[pos_key][0], tiles, this.tiles[pos_key][2], this.tiles[pos_key][3]];
		}
	}

	tile_set(pos, name, tiles, speed, collision) {
		const pos_key = pos.toString();
		const tiles_key = [];
		for(let i in tiles)
			tiles_key[i] = tiles[i].toString();

		if(tiles_key.length > 0)
			this.tiles[pos_key] = [name, tiles_key, speed, collision];
		else
			delete this.tiles[pos_key];
		this.update_tile(pos_key);
	}
}
