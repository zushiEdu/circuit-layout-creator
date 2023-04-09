import { pin } from "./pin.js";

export const name = "componentProperties";

export class componentProperties {
    constructor(height, width, name, type, value, colors, pins, rotation, layer) {
        this.height = height;
        this.width = width;
        this.name = name;
        this.colors = colors;
        this.value = value;
        this.type = type;
        this.pins = pins;
        this.rotation = rotation;
        this.layer = layer;
    }
}