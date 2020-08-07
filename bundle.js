(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Vector = require('../core/Vector');

class Matrix {
    constructor(n, m, value = 0) {
        this.values = []
        this.rows = n
        this.cols = m
        this.dimensions = [n, m]
        this._initialize(value)
    }

    static from_array(a) {
        const rows = a.length
        const cols = a[0].length
        const m = new Matrix(rows, cols)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                m.set(i, j, a[i][j])
            }
        }
        return m
    }
    to_array() {
        const res = []
        for (const i of this.values) {
            const row = []
            for (const j of i) {
                row.push(j)
            }
            res.push(row)
        }
        return res
    }

    set(i, j, value) {
        this.values[i][j] = value
    }
    get(i, j) {
        return this.values[i][j]
    }
    row(i) {
        return Vector.from_array(this.values[i])
    }
    col(j) {
        const result = []
        for (let i = 0; i < this.rows; i++) {
            result.push(this.values[i][j])
        }
        return Vector.from_array(result)
    }
    add(term) {
        if (term instanceof Matrix) {
            return this._element_wise(term, (a, b) => a + b)
        } else {
            return this._each((val) => val + term)
        }
    }
    multiply(factor) {
        if (factor instanceof Matrix) {
            return this._shur_product(factor)
        } else {
            return this._scale(factor)
        }
    }
    dot(m2) {
        if (this.cols !== m2.rows) {
            throw new Error('Wrong matrix dimensions')
        }
        const result = new Matrix(this.rows, m2.cols)
        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.rows; j++) {
                const row = this.row(i)
                const col = m2.col(j)
                result.set(i, j, row.dot(col))
            }
        }
        return result
    }
    cross() {
        throw new Error('not implemented')
    }
    transpose() {
        const T = new Matrix(this.cols, this.rows)
        this._each((val, i, j) => {
            let a = 1
            T.set(j, i, val)
            return 0
        })
        return T
    }
    determinant() {
        throw new Error('not implemented')
    }
    for_each(f) {
        return this._each(f)
    }

    //Private 
    //-------------------------
    _initialize(value) {
        let i = 0
        let j = 0
        while (i < this.rows) {
            this.values[i] = []
            while (j < this.cols) {
                this.values[i][j] = value
                j += 1
            }
            j = 0
            i += 1
        }
    }
    _scale(scalar) {
        return this._each((val) => val * scalar)
    }
    _shur_product(m2) {
        return this._element_wise(m2, (a, b) => a * b)
    }
    _validate_same_dimensions(m2) {
        const same_dimension = this.dimensions.every((val, index) => val === m2.dimensions[index])
        if (!same_dimension) {
            throw Error("Wrong matrix dimensions")
        }
    }
    _each(f) {
        // f:: val, index, index -> val
        const result = new Matrix(...this.dimensions)
        let i = 0
        let j = 0
        while (j < this.cols) {
            while (i < this.rows) {
                const val = this.get(i, j)
                result.set(i, j, f(val, i, j))
                i += 1
            }
            i = 0
            j += 1
        }
        return result
    }
    _element_wise(m2, f) {
        // f:: val, val -> val
        this._validate_same_dimensions(m2)
        const result = new Matrix(...this.dimensions)
        return this._each((val, i, j) => f(val, m2.get(i, j)))
    }
}

module.exports = Matrix
},{"../core/Vector":3}],2:[function(require,module,exports){
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
},{"../core/Matrix":1}],3:[function(require,module,exports){
class Vector {
    constructor(size, value = 0) {
        this.size = size
        this.values = []
        this._initalize(value)
    }
    static from_array(a) {
        const v = new Vector(a.length)
        v.values = a
        return v
    }
    to_array() {
        return this.values
    }
    get(index) {
        return this.values[index]
    }
    dot(v2) {
        let result = 0
        for (let i = 0; i < this.size; i++) {
            result += this.get(i) * v2.get(i)
        }
        return result
    }

    //Private 
    //-------------------------
    _initalize(value) {
        for (let i = 0; i < this.size; i++) {
            this.values[i] = value
        }
    }
}


module.exports = Vector
},{}],4:[function(require,module,exports){
const NeuralNetwork = require('./core/NN');

window.main = function () {
    nn = new NeuralNetwork(2, [4, 5], 17)
    input = [[2, 2]]
    output = nn.feed_forward(input)

    console.log(output)
};

},{"./core/NN":2}]},{},[4]);
