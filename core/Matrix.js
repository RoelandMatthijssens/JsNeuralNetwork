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