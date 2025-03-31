const settings = {
	width: 1024,
	height: 768,
	size: 16,
	size_font_small: 0.75,
	size_font_large: 1,
	zoom: 4,
	rate: 100,
}

// Helper, px: Returns a pixel position string for HTML elements
function px() { return Array.from(arguments).join("px ") + "px "; }

// Helper, rint: Returns a random integer between two values
function rint(min, max) { return Math.round(Math.random() * (max - min)) + min; }

// Helper, element: Create a new HTML element with an id and class
function element(parent, type, id, classname) {
	const element = document.createElement(type);
	if(id)
		element.setAttribute("id", id);
	if(classname)
		element.setAttribute("class", classname);
	if(parent)
		parent.appendChild(element);
	return element;
}

// Helper, style: Return a shadow in 4 directions
function shadow(up, down, left, right, size, parms) {
	const s = [];
	if(up)
		s.push(px(0, -size) + parms);
	if(down)
		s.push(px(0, size) + parms);
	if(left)
		s.push(px(-size, 0) + parms);
	if(right)
		s.push(px(size, 0) + parms);
	return s.toString();
}

const root = document.getElementById("root");
root.style.width = px(settings.width);
root.style.height = px(settings.height);

class storage {
	constructor() {
		this.func = undefined;
		this.images_tileset = {};
		this.loading = 0;
	}

	onload() {
		this.loading--;
		if(this.loading == 0) {
			this.func();
		}
	}

	url_images_tileset(name) {
		const key = name ? name : Object.keys(data.images_tileset)[0];
		return this.images_tileset[key].src;
	}

	load_func(func) {
		this.func = func;
	}

	load_image_tileset(name, source) {
		this.images_tileset[name] = element(undefined, "img", undefined, "image");
		this.images_tileset[name].src = source;
		this.images_tileset[name].onload = this.onload.bind(this);
		this.loading++;
	}
}

const data = new storage();
