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