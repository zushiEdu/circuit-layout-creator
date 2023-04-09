export const name = "circuit"

export class circuit {
    constructor(circuitProperty, components, traces) {
        this.circuitProperty = circuitProperty;
        this.components = components;
        this.traces = traces;
    }

    addComponent(component) {
        if (component != null) {
            this.components.push(component);
        }
    }
}
