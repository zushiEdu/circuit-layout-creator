import { rgb } from "./rgb.js";
import { pin } from "./pin.js";

export const name = "getBuiltinComponent";

export class getBuiltinComponent {
    getComponentProperty() {
        if (this.componentProperty.hasOwnProperty(this.type)) {
            return this.componentProperty[this.type];
        } else {
            return null;
        }
    }

    constructor(type) {
        this.type = type;

        this.componentProperty = {
            "capacitor-polarized": {
                height: 1,
                width: 1,
                type: "capacitor-polarized",
                name: "Capacitor",
                value: "10uF",
                colors: [new rgb(50, 50, 50), new rgb(150, 150, 150)],
                rotation: 0,
                layer: 4,
                pins: [new pin(1, 1), new pin(3, 1)],
            },
            "resistor-pot": {
                height: 1,
                width: 1,
                type: "resistor-pot",
                name: "Potentiometer",
                value: "10kΩ",
                colors: [new rgb(0, 0, 255), new rgb(255, 255, 255)],
                rotation: 0,
                layer: 4,
                pins: [new pin(1, 1), new pin(3, 1)],
            },
            "resistor-default": {
                height: 1,
                width: 1,
                type: "resistor-default",
                name: "Resistor",
                value: "1kΩ",
                colors: [new rgb(1, 174, 243), new rgb(130, 59, 21), new rgb(0, 5, 0), new rgb(253, 1, 6), new rgb(255, 190, 5)],
                rotation: 0,
                layer: 4,
                pins: [new pin(1, 1), new pin(4, 1)],
            },
            "ic-4b4": {
                height: 1,
                width: 1,
                type: "ic-4b4",
                name: "4x4",
                value: null,
                colors: [new rgb(50, 50, 50), new rgb(255, 255, 255), new rgb(102, 102, 102), new rgb(255, 255, 255), new rgb(0, 0, 0)],
                rotation: 0,
                layer: 4,
                pins: [new pin(1, 1), new pin(2, 1), new pin(3, 1), new pin(4, 1), new pin(1, 4), new pin(2, 4), new pin(3, 4), new pin(4, 4)],
                additionalDetails: {
                    displayName: "555",
                },
            },
            "ic-8b4": {
                height: 1,
                width: 1,
                type: "ic-8b4",
                name: "8x4",
                value: null,
                colors: [new rgb(50, 50, 50), new rgb(255, 255, 255), new rgb(102, 102, 102), new rgb(255, 255, 255), new rgb(0, 0, 0)],
                rotation: 0,
                layer: 4,
                pins: [new pin(1, 1), new pin(2, 1), new pin(3, 1), new pin(4, 1), new pin(5, 1), new pin(6, 1), new pin(7, 1), new pin(8, 1), new pin(1, 4), new pin(2, 4), new pin(3, 4), new pin(4, 4), new pin(5, 4), new pin(6, 4), new pin(7, 4), new pin(8, 4)],
                additionalDetails: {
                    displayName: "L293D",
                },
            },
            "header-female": {
                height: 1,
                width: 3,
                type: "header-female",
                name: "Female Header",
                value: null,
                colors: [new rgb(50, 50, 50), new rgb(150, 150, 150)],
                rotation: 0,
                layer: 4,
                pins: [new pin(1, 1), new pin(3, 1)],
            },
            "header-male": {
                height: 1,
                width: 3,
                type: "header-male",
                name: "Male Header",
                value: null,
                colors: [new rgb(50, 50, 50), new rgb(150, 150, 150)],
                rotation: 0,
                layer: 4,
                pins: [new pin(1, 1), new pin(3, 1)],
            },
            "diode-led": {
                height: 1,
                width: 1,
                type: "diode-led",
                name: "LED",
                value: null,
                colors: [new rgb(255, 0, 0), new rgb(100, 100, 100)],
                rotation: 0,
                layer: 4,
                pins: [new pin(1, 1), new pin(3, 1)],
            },
            "board-perf": {
                height: 9,
                width: 9,
                type: "board-perf",
                name: "Perf Board",
                value: null,
                colors: [new rgb(175, 135, 63), new rgb(232, 177, 137), new rgb(29, 32, 33)],
                rotation: 0,
                layer: 1,
                pins: [new pin(1, 1)],
            },
            "capacitor-default": {
                height: 1,
                width: 1,
                type: "capacitor-default",
                name: "Ceramic Capacitor",
                value: "10uF",
                colors: [new rgb(204, 134, 40)],
                rotation: 0,
                layer: 4,
                pins: [new pin(1, 1), new pin(2, 1)],
            },
            "resistor-photo": {
                height: 1,
                width: 1,
                type: "resistor-photo",
                name: "Photo Resistor",
                value: null,
                colors: [new rgb(206, 52, 4), new rgb(183, 175, 167)],
                rotation: 0,
                layer: 4,
                pins: [new pin(1, 1), new pin(3, 1)],
            }
        }
    }
}