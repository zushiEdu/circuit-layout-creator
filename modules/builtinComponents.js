import { rgb } from "./rgb.js";
import { pin } from "./pin.js";

const polarizedCapacitor = {
    height: 1,
    width: 1,
    type: "capacitor-polarized",
    name: "Capacitor",
    value: "10uF",
    colors: [new rgb(50, 50, 50), new rgb(150, 150, 150)],
    rotation: 0,
    layer: 4,
    pins: [new pin(1, 1), new pin(3, 1)],
}

const resistorPotentiometer = {
    height: 1,
    width: 1,
    type: "resistor-pot",
    name: "Potentiometer",
    value: "10kΩ",
    colors: [new rgb(0, 0, 255), new rgb(255, 255, 255)],
    rotation: 0,
    layer: 4,
    pins: [new pin(1, 1), new pin(3, 1)],
}

const resistorDefault = {
    height: 1,
    width: 1,
    type: "resistor-default",
    name: "Resistor",
    value: "1kΩ",
    colors: [new rgb(1, 174, 243), new rgb(130, 59, 21), new rgb(0, 5, 0), new rgb(253, 1, 6), new rgb(255, 190, 5)],
    rotation: 0,
    layer: 4,
    pins: [new pin(1, 1), new pin(4, 1)],
}

const integratedCircuit4b4 = {
    height: 1,
    width: 1,
    type: "ic-4b4",
    name: "4x4",
    value: null,
    colors: [new rgb(50, 50, 50), new rgb(255, 255, 255), new rgb(102, 102, 102), new rgb(255, 255, 255), new rgb(0, 0, 0)],
    rotation: 0,
    layer: 4,
    pins: [new pin(1, 1), new pin(2, 1), new pin(3, 1), new pin(4, 1), new pin(1, 4), new pin(2, 4), new pin(3, 4), new pin(4, 4)],
}

const headerFemale = {
    height: 1,
    width: 3,
    type: "header-female",
    name: "Female Header",
    value: null,
    colors: [new rgb(50, 50, 50), new rgb(150, 150, 150)],
    rotation: 0,
    layer: 4,
    pins: [new pin(1, 1), new pin(2, 1)],
}

const headerMale = {
    height: 1,
    width: 3,
    type: "header-male",
    name: "Male Header",
    value: null,
    colors: [new rgb(50, 50, 50), new rgb(150, 150, 150)],
    rotation: 0,
    layer: 4,
    pins: [new pin(1, 1), new pin(2, 1)],
}

const diodeLed = {
    height: 1,
    width: 1,
    type: "diode-led",
    name: "LED",
    value: null,
    colors: [new rgb(255, 0, 0), new rgb(100, 100, 100)],
    rotation: 0,
    layer: 4,
    pins: [new pin(1, 1), new pin(3, 1)],
}

const perfBoard = {
    height: 9,
    width: 9,
    type: "board-perf",
    name: "Perf Board",
    value: null,
    colors: [new rgb(175, 135, 63), new rgb(232, 177, 137), new rgb(29, 32, 33)],
    rotation: 0,
    layer: 1,
    pins: [new pin(1, 1)],
}

export const name = "builtinComponents";
export const builtinComponents = [
    polarizedCapacitor,
    resistorPotentiometer,
    resistorDefault,
    integratedCircuit4b4,
    headerFemale,
    headerMale,
    diodeLed,
    perfBoard
]
