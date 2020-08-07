const Matrix = require('../core/Matrix');

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x))
}

class NeuralNetwork {
    constructor(input_count, hidden_layer_counts, output_count, initializer) {
        this.layers = []
        this.input_count = input_count
        this.hidden_layer_counts = hidden_layer_counts
        this.output_count = output_count
        this.populate_layers(initializer)
    }

    populate_layers(initializer) {
        const inputs = new Layer(this.input_count, null, initializer)
        this.layers.push(inputs)
        let previous_layer = inputs
        for (const node_count of this.hidden_layer_counts) {
            let layer = new Layer(node_count, previous_layer, initializer)
            this.layers.push(layer)
            previous_layer = layer
        }
        this.layers.push(new Layer(this.output_count, previous_layer, initializer))
    }

    input_layer() {
        return this.layers[0]
    }

    output_layer() {
        return this.layers[this.layers.length - 1]
    }

    feed_forward(inputs) {
        // if (inputs.length !== this.input_layer().size) {
        //     throw new Error("input doesn't match NN")
        // }
        const input_matrix = Matrix.from_array(inputs).transpose()
        this.input_layer().set_values(input_matrix)
        for (const layer of this.layers) {
            layer.feed_forward()
        }
        return this.output_layer().values.to_array()
    }
}

class Layer {
    constructor(node_count, previous_layer, initializer) {
        this.size = node_count
        this.previous_layer = previous_layer
        if (previous_layer) {
            this.weights = new Matrix(node_count, previous_layer.size)
        }
        this.biasses = new Matrix(node_count, 1)
        this.values = new Matrix(node_count, 1)
        this.initializer = initializer || Math.random
        this.initialize()
    }

    initialize() {
        if (this.weights) {
            this.weights = this.weights.for_each(this.initializer)
        }
        this.biasses = this.biasses.for_each(this.initializer)
        this.values = this.values.for_each(this.initializer)
    }

    set_values(m) {
        this.values = this.values.for_each((v, i, j) => {
            return m.get(i, j)
        })
    }

    feed_forward() {
        if (!this.previous_layer) {
            return
        }
        this.values = this.weights.dot(this.previous_layer.values).add(this.biasses).for_each(sigmoid)
    }
}

module.exports = NeuralNetwork