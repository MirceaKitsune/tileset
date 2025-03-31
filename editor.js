const editor_info_bar = "LMB: Paint tile, RMB: Copy tile, Space: Clear, 0 - 9: Layer, []: Step, Numpad: Collision";
const editor_info_tileset = "LMB: Single tile, RMB: Multiple frames, Space: Clear";

class editor {
	constructor() {
		// Elements: Main
		this.element = element(undefined, "div", "editor", "editor");
		this.element.onmousedown = this.event_element.bind(this);
		this.element.onmouseup = this.event_element.bind(this);
		this.element.onmousemove = this.event_element.bind(this);
		this.element.oncontextmenu = function() { return false; };
		{
			// Elements: Main, brush
			this.element_window_brush = element(this.element, "div", "editor_brush", "editor_brush");
			this.element_window_brush.style.width = px(settings.size * settings.zoom);
			this.element_window_brush.style.height = px(settings.size * settings.zoom);
			this.element_window_brush.style.fontSize = px(settings.size * settings.size_font_small);
			this.element_window_brush.style.textShadow = shadow(true, true, true, true, settings.size_font_small * 2, "white");
			this.element_window_brush.innerHTML = 0;

			// Elements: Main, window
			this.element_window = element(this.element, "div", "editor", "editor_window");
			this.element_window.style.width = px(settings.width);
			this.element_window.style.height = px(settings.height);
			{
				// Elements: Main, window, bar
				this.element_window_bar = element(this.element_window, "div", "editor_bar", "editor_panel editor_panel_bar");
				{
					// Elements: Main, window, bar, editor
					this.element_window_bar_editor = element(this.element_window_bar, "button", "editor_bar_button", "editor_panel_bar_button");
					this.element_window_bar_editor.value = "`";
					this.element_window_bar_editor.onclick = this.event_element.bind(this);
					this.element_window_bar_editor.innerHTML = "` - Editor";

					// Elements: Main, window, bar, bar
					this.element_window_bar_bar = element(this.element_window_bar, "button", "editor_bar_button", "editor_panel_bar_button");
					this.element_window_bar_bar.value = "B";
					this.element_window_bar_bar.onclick = this.event_element.bind(this);
					this.element_window_bar_bar.innerHTML = "B - Bar";

					// Elements: Main, window, bar, bar
					this.element_window_bar_tileset = element(this.element_window_bar, "button", "editor_bar_button", "editor_panel_bar_button");
					this.element_window_bar_tileset.value = "T";
					this.element_window_bar_tileset.onclick = this.event_element.bind(this);
					this.element_window_bar_tileset.innerHTML = "T - Tileset";

					// Elements: Main, window, bar, label
					this.element_window_bar_label = element(this.element_window_bar, "span", "editor_bar_label", "element_label");
					this.element_window_bar_label.style.fontSize = px(settings.size * settings.size_font_small);
					this.element_window_bar_label.innerHTML = "";
				}

				// Elements: Main, window, tileset
				this.element_window_tileset = element(undefined, "div", "editor_tileset", "editor_panel editor_panel_tileset");
				{
					// Elements: Main, window, tileset, label
					this.element_window_tileset_label = element(this.element_window_tileset, "span", "editor_tileset_label", "element_label");
					this.element_window_tileset_label.style.fontSize = px(settings.size * settings.size_font_large);
					this.element_window_tileset_label.innerHTML = "Tileset";

					// Elements: Main, window, tileset, select
					this.element_window_tileset_select = element(this.element_window_tileset, "select", "editor_tileset_select", "editor_panel_tileset_select");
					this.element_window_tileset_select.onchange = this.event_element.bind(this);
					{
						// Elements: Main, window, tileset, select, options
						this.element_window_tileset_select_option = [];
						for(let i in data.images_tileset) {
							this.element_window_tileset_select_option[i] = element(this.element_window_tileset_select, "option", undefined, undefined);
							this.element_window_tileset_select_option[i].value = i;
							this.element_window_tileset_select_option[i].text = i;
						}
					}

					// Elements: Main, window, tileset, select, layers
					this.element_window_tileset_layer = [];
					for(let i = 0; i < 10; i++) {
						this.element_window_tileset_layer[i] = element(this.element_window_tileset, "button", "editor_tileset_layer", "editor_panel_tileset_button");
						this.element_window_tileset_layer[i].onclick = this.event_element.bind(this);
						this.element_window_tileset_layer[i].disabled = true;
						this.element_window_tileset_layer[i].value = i;
						this.element_window_tileset_layer[i].innerHTML = i;
					}

					// Elements: Main, window, tileset, step
					this.element_window_tileset_step = element(this.element_window_tileset, "input", "editor_tileset_step", "editor_panel_tileset_slider");
					this.element_window_tileset_step.min = 0;
					this.element_window_tileset_step.max = 10;
					this.element_window_tileset_step.step = 1;
					this.element_window_tileset_step.value = 0;
					this.element_window_tileset_step.type = "range";
					this.element_window_tileset_step.onchange = this.event_element.bind(this);

					// Elements: Main, window, tileset, edge
					this.element_window_tileset_collision_checkbox = [];
					this.element_window_tileset_collision_label = [];
					for(let i = 0; i < 4; i++) {
						this.element_window_tileset_collision_checkbox[i] = element(this.element_window_tileset, "input", "editor_tileset_collision_checkbox", "editor_panel_tileset_checkbox");
						this.element_window_tileset_collision_checkbox[i].onchange = this.event_element.bind(this);
						this.element_window_tileset_collision_checkbox[i].type = "checkbox";
						this.element_window_tileset_collision_checkbox[i].value = [1, 2, 4, 8][i];
						this.element_window_tileset_collision_label[i] = element(this.element_window_tileset, "label", "editor_tileset_collision_label", "editor_panel_tileset_label");
						this.element_window_tileset_collision_label[i].innerHTML = ["Up ", "Down ", "Left ", "Right "][i];
					}

					// Elements: Main, window, tileset, info
					element(this.element_window_tileset, "br", undefined, undefined);
					this.element_window_tileset_info = element(this.element_window_tileset, "span", "editor_tileset_info", "element_label");
					this.element_window_tileset_info.style.fontSize = px(settings.size * settings.size_font_small);
					this.element_window_tileset_info.innerHTML = "";

					// Elements: Main, window, tileset, preview
					this.element_window_tileset_preview = element(this.element_window_tileset, "div", "editor_tileset_preview", "editor_panel_tileset_image");
					{
						// Elements: Main, window, tileset, preview, image
						this.element_window_tileset_preview_image = element(this.element_window_tileset_preview, "img", "editor_tileset_preview_image", "image");
						this.element_window_tileset_preview_image.src = data.url_images_tileset(undefined);

						// Elements: Main, window, tileset, preview, marker
						this.element_window_tileset_preview_marker = element(this.element_window_tileset_preview, "div", "editor_tileset_preview_marker", "editor_marker");
						this.element_window_tileset_preview_marker.style.width = px(settings.size);
						this.element_window_tileset_preview_marker.style.height = px(settings.size);
						this.element_window_tileset_preview_marker.style.fontSize = px(settings.size * settings.size_font_small);
						this.element_window_tileset_preview_marker.style.textShadow = shadow(true, true, true, true, settings.size_font_small * 2, "white");
						this.element_window_tileset_preview_marker.innerHTML = 0;
						this.element_window_tileset_preview_marker_frame = [];
					}
				}
			}
		}

		this.map = undefined;
		this.tileset_brush = undefined;
		this.tileset_selection = {pos: [0, 0, 0], name: Object.keys(data.images_tileset)[0], tiles: [], step: 0, collision: 0};
		this.tileset_marker = [0, 0];
		this.update_map();
		this.update_tileset(true);
		addEventListener("keydown", this.event_key.bind(this));
	}

	toggle(parent, child, state) {
		// Attach or detach an element, if a desired state isn't specified the element is toggled
		if(state != false && !parent.contains(child))
			parent.appendChild(child);
		else if(state != true && parent.contains(child))
			parent.removeChild(child);
	}

	update_map() {
		this.map = maps[maps_active];
		this.element.style.width = px(this.map.size[0] * settings.size * settings.zoom);
		this.element.style.height = px(this.map.size[1] * settings.size * settings.zoom);
		this.element_window_bar_label.innerHTML = maps_active + ": X = " + this.map.size[0] + ", Y = " + this.map.size[1] + ", Layers = " + this.map.layers.length + "\n" + editor_info_bar;

		// Disable the buttons of layers greater than those available on the active map
		for(let i = 0; i < 10; i++)
			this.element_window_tileset_layer[i].disabled = this.element_window_tileset_layer[i].value >= this.map.layers.length;
	}

	update_map_tile(change) {
		if(change) {
			if(this.tileset_brush && (this.tileset_brush[0] != this.tileset_selection.pos[0] || this.tileset_brush[1] != this.tileset_selection.pos[1] || this.tileset_brush[2] != this.tileset_selection.pos[2])) {
				this.map.tile_set(this.tileset_selection.pos, this.tileset_selection.name, this.tileset_selection.tiles, this.tileset_selection.step, this.tileset_selection.collision);
				this.tileset_brush = this.tileset_selection.pos.slice();
			}
		} else {
			const data = this.map.tile_get(this.tileset_selection.pos);
			if(data) {
				this.tileset_selection = {pos: this.tileset_selection.pos, name: data[0], tiles: data[1], step: data[2], collision: data[3]};
				this.update_tileset(false);
			} else {
				this.update_tileset(true);
			}
		}
	}

	update_tileset(clear_tiles) {
		if(clear_tiles) {
			for(let i = 0; i < this.element_window_tileset_preview_marker_frame.length; i++)
				this.element_window_tileset_preview_marker_frame[i].remove();
			this.element_window_tileset_preview_marker_frame = [];

			this.tileset_selection.tiles = [];
			this.tileset_selection.step = 0;
			this.tileset_selection.collision = 0;
		}

		// Update step slider and collision checkboxes
		this.element_window_tileset_step.value = this.tileset_selection.step;
		for(let i = 0; i < 4; i++)
			this.element_window_tileset_collision_checkbox[i].checked = this.tileset_selection.collision & this.element_window_tileset_collision_checkbox[i].value;

		// Text displayed on the brush and in the window describing the tileset selection and options
		const value_layer = this.tileset_selection.pos[2];
		const value_tiles = this.tileset_selection.tiles.length == 0 ? "Clear" : (this.tileset_selection.tiles.length == 1 ? this.tileset_selection.tiles[0][0] + "x" + this.tileset_selection.tiles[0][1] : "#" + this.tileset_selection.tiles.length);
		const value_step = this.tileset_selection.tiles.length <= 1 ? "Static" : (this.tileset_selection.step == 0 ? "Random" : "x" + this.tileset_selection.step);
		const value_collision = this.tileset_selection.collision == 0 ? "None" : ((this.tileset_selection.collision & 1 ? "U" : "") + (this.tileset_selection.collision & 2 ? "D" : "") + (this.tileset_selection.collision & 4 ? "L" : "") + (this.tileset_selection.collision & 8 ? "R" : ""));
		const label_short = "L " + value_layer + (this.tileset_selection.tiles.length > 0 ? "\nT " + value_tiles : "") + (this.tileset_selection.tiles.length > 0 ? "\nS " + value_step : "") + (this.tileset_selection.tiles.length > 0 && this.tileset_selection.collision > 0 ? "\nC " + value_collision : "");
		const label_long = "Layer: " + value_layer + " | Tiles: " + value_tiles + " | Step: " + value_step + " | Collision: " + value_collision + "\n" + editor_info_tileset;
		const edges = this.tileset_selection.tiles.length == 0 ? "" : shadow(this.tileset_selection.collision & 1, this.tileset_selection.collision & 2, this.tileset_selection.collision & 4, this.tileset_selection.collision & 8, settings.zoom, "white");

		this.element_window_tileset_preview_marker.innerHTML = this.tileset_selection.tiles.length;
		this.element_window_tileset_info.innerHTML = label_long;
		this.element_window_brush.innerHTML = label_short;
		this.element_window_brush.style.boxShadow = edges;
		if(this.tileset_selection.tiles.length > 0) {
			this.element_window_brush.style.background = "url(" + data.url_images_tileset(this.tileset_selection.name) + ")";
			this.element_window_brush.style.backgroundPosition = px(this.tileset_selection.tiles[0][0] * settings.size * settings.zoom * -1, this.tileset_selection.tiles[0][1] * settings.size * settings.zoom * -1);
			this.element_window_brush.style.backgroundSize = px(this.element_window_tileset_preview_image.width * settings.zoom, this.element_window_tileset_preview_image.height * settings.zoom);
		} else {
			this.element_window_brush.style.background = "transparent";
			this.element_window_brush.style.backgroundPosition = px(0, 0);
			this.element_window_brush.style.backgroundSize = px(0, 0);
		}
	}

	key(key) {
		if(key == "`")
			this.toggle(root, this.element, undefined);
		if(root.contains(this.element)) {
			const key_let = key.toUpperCase();
			const key_num = parseInt(key);
			if(!event.location) {
				// Standard keys
				if(key_let == "B")
					this.toggle(this.element_window, this.element_window_bar, undefined);
				else if(key_let == "T")
					this.toggle(this.element_window, this.element_window_tileset, undefined);
				else if(key_let == "[")
					this.tileset_selection.step = Math.max(this.tileset_selection.step - 1, 0);
				else if(key_let == "]")
					this.tileset_selection.step = Math.min(this.tileset_selection.step + 1, 10);
				else if(key_let == " ")
					this.update_tileset(true);
				else if(!isNaN(key_num) && key_num < this.map.layers.length)
					this.tileset_selection.pos[2] = key_num;
			} else {
				// Numpad keys
				this.tileset_selection.collision = 15 - this.tileset_selection.collision;
				if(key != "Delete" && key != ".")
					this.tileset_selection.collision = 0;
				if(key_num == 5 || key == "Unidentified")
					this.tileset_selection.collision = 15;
				if((key_num == 8 || key == "ArrowUp") || (key_num == 7 || key == "Home") || (key_num == 9 || key == "PageUp") || (key == "-" || key == "/"))
					this.tileset_selection.collision += 1;
				if((key_num == 2 || key == "ArrowDown") || (key_num == 1 || key == "End") || (key_num == 3 || key == "PageDown") || (key == "-" || key == "/"))
					this.tileset_selection.collision += 2;
				if((key_num == 4 || key == "ArrowLeft") || (key_num == 7 || key == "Home") || (key_num == 1 || key == "End") || (key == "+") || key == "*")
					this.tileset_selection.collision += 4;
				if((key_num == 6 || key == "ArrowRight") || (key_num == 9 || key == "PageUp") || (key_num == 3 || key == "PageDown") || (key == "+" || key == "*"))
					this.tileset_selection.collision += 8;
			}
			this.update_tileset(false);	
		}
	}

	event_key(event) {
		if(event.type == "keydown" && !event.repeat)
			this.key(event.key);
	}

	event_element(event) {
		if(event.target.id == "editor" && event.type == "mousedown") {
			// Editor: Mouse, down
			if(event.button == 0)
				this.tileset_brush = [];
			this.update_map_tile(event.button == 0);
		} else if(event.target.id == "editor" && event.type == "mouseup") {
			// Editor: Mouse, up
			if(event.button == 0)
				this.tileset_brush = undefined;
			this.update_map_tile(event.button == 0);
		} else if(event.target.id == "editor" && event.type == "mousemove") {
			// Editor: Mouse, move
			this.tileset_selection.pos[0] = Math.floor(event.layerX / (settings.size * settings.zoom));
			this.tileset_selection.pos[1] = Math.floor(event.layerY / (settings.size * settings.zoom));
			this.element_window_brush.style.left = px(this.tileset_selection.pos[0] * settings.size * settings.zoom);
			this.element_window_brush.style.top = px(this.tileset_selection.pos[1] * settings.size * settings.zoom);
			this.update_map_tile(true);
		} else if(event.target.id == "editor_bar_button" && event.type == "click") {
			// Editor, bar, button: Click
			this.key(event.target.value);
		} else if(event.target.id == "editor_tileset_select" && event.type == "change") {
			// Editor, tileset, select: Change
			this.tileset_selection.name = event.target.value;
			this.element_window_tileset_preview_image.src = data.url_images_tileset(this.tileset_selection.name);
			this.update_tileset(true);
		} else if(event.target.id == "editor_tileset_layer" && event.type == "click") {
			// Editor, tileset, layer: Click
			this.tileset_selection.pos[2] = event.target.value;
			this.update_tileset(false);
		} else if(event.target.id == "editor_tileset_step" && event.type == "change") {
			// Editor, tileset, step: Change
			this.tileset_selection.step = event.target.value;
			this.update_tileset(false);
		} else if(event.target.id == "editor_tileset_collision_checkbox" && event.type == "change") {
			// Editor, tileset, collision: Change
			if(event.target.checked)
				this.tileset_selection.collision += parseInt(event.target.value);
			else
				this.tileset_selection.collision -= parseInt(event.target.value);
			this.update_tileset(false);
		} else if(event.target.id == "editor_tileset_preview_image" && event.type == "mousedown") {
			// Editor, tileset, preview, image: Mouse, down
			if(event.button == 0 || (event.button == 2 && this.tileset_selection.tiles.length < 100)) {
				if(event.button == 0)
					this.update_tileset(true);
				this.tileset_selection.tiles.push([this.tileset_marker[0], this.tileset_marker[1]]);
				this.update_tileset(false);

				const i = this.tileset_selection.tiles.length - 1;
				this.element_window_tileset_preview_marker_frame[i] = element(this.element_window_tileset_preview, "div", "editor_tileset_preview_marker_tile", "editor_marker_frame");
				this.element_window_tileset_preview_marker_frame[i].style.left = px(this.tileset_marker[0] * settings.size);
				this.element_window_tileset_preview_marker_frame[i].style.top = px(this.tileset_marker[1] * settings.size);
				this.element_window_tileset_preview_marker_frame[i].style.width = px(settings.size);
				this.element_window_tileset_preview_marker_frame[i].style.height = px(settings.size);
				this.element_window_tileset_preview_marker_frame[i].style.fontSize = px(settings.size * settings.size_font_small);
				this.element_window_tileset_preview_marker_frame[i].style.textShadow = shadow(true, true, true, true, settings.size_font_small * 2, "black");
				this.element_window_tileset_preview_marker_frame[i].innerHTML = i;
			}
		} else if(event.target.id == "editor_tileset_preview_image" && event.type == "mousemove") {
			// Editor, tileset, preview, image: Mouse, move
			this.tileset_marker[0] = Math.floor(event.layerX / settings.size);
			this.tileset_marker[1] = Math.floor(event.layerY / settings.size);
			this.element_window_tileset_preview_marker.style.left = px(this.tileset_marker[0] * settings.size);
			this.element_window_tileset_preview_marker.style.top = px(this.tileset_marker[1] * settings.size);
		}
	}
}
