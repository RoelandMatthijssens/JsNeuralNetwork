const Vector = require('../core/Vector');

test('initialize vector', () => {
    v = new Vector(3, value = 2)
    expect(v.get(2)).toBe(2)
})

test('from array', () => {
    v = Vector.from_array([1, 2, 3])
    expect(v.get(2)).toBe(3)
})

test('to array', () => {
    v1 = Vector.from_array([1, 2, 3])
    expect(v1.to_array()).toStrictEqual([1, 2, 3])
})

test('dot', () => {
    v1 = Vector.from_array([1, 2, 3])
    v2 = Vector.from_array([4, 5, 6])
    expect(v1.dot(v2)).toBe(1 * 4 + 2 * 5 + 3 * 6)
})


