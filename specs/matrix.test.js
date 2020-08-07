const Matrix = require('../core/Matrix');
const Vector = require('../core/Vector');

test('initialize matrix', () => {
  m = new Matrix(3, 3, value = 2)
  expect(m.get(2, 2)).toBe(2)
})

test('get size', () => {
  m = new Matrix(2, 3)
  expect(m.dimensions).toStrictEqual([2, 3])
})

test('from array square', () => {
  values = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ]
  m = Matrix.from_array(values)
  expect(m.get(1, 2)).toBe(5)
})
test('from array 2x3', () => {
  values = [
    [0, 1, 2],
    [3, 4, 5],
  ]
  m = Matrix.from_array(values)
  expect(m.get(1, 2)).toBe(5)
})
test('from array 3x2', () => {
  values = [
    [0, 1],
    [2, 3],
    [4, 5],
  ]
  m = Matrix.from_array(values)
  expect(m.get(2, 1)).toBe(5)
})
test('to array', () => {
  values = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ]
  m = Matrix.from_array(values)
  expect(m.to_array()).toStrictEqual(values)
})

test('set values', () => {
  m = new Matrix(3, 3)
  m.set(1, 1, 5)
  expect(m.get(1, 1)).toBe(5)
})

test('addition different size', () => {
  m1 = new Matrix(1, 2)
  m2 = new Matrix(2, 1)
  expect(() => m1.add(m2)).toThrowError(Error)
})

test('sum', () => {
  m1 = Matrix.from_array([
    [1, 2],
    [3, 4],
  ])
  m2 = Matrix.from_array([
    [5, 6],
    [7, 8],
  ])
  sum = m1.add(m2)
  expect(sum.get(1, 1)).toBe(12)
  expect(sum.get(0, 0)).toBe(6)
})

test('sum with value', () => {
  m1 = Matrix.from_array([
    [1, 2],
    [3, 4],
  ])
  sum = m1.add(5)
  expect(sum.get(1, 1)).toBe(9)
  expect(sum.get(0, 0)).toBe(6)
})

test('hadamard multiply ', () => {
  m1 = Matrix.from_array([
    [1, 2],
    [3, 4],
  ])
  m2 = Matrix.from_array([
    [5, 6],
    [7, 8],
  ])
  sum = m1.multiply(m2)
  expect(sum.get(1, 1)).toBe(32)
  expect(sum.get(0, 0)).toBe(5)
})

test('multiply with value', () => {
  m1 = Matrix.from_array([
    [1, 2],
    [3, 4],
  ])
  product = m1.multiply(2)
  expect(product.get(1, 1)).toBe(8)
  expect(product.get(0, 0)).toBe(2)
})

test('get row', () => {
  m1 = Matrix.from_array([
    [1, 2],
    [3, 4],
  ])
  expect(m1.col(0)).toBeInstanceOf(Vector)
  expect(m1.row(0).to_array()).toStrictEqual([1, 2])
  expect(m1.col(0)).toBeInstanceOf(Vector)
  expect(m1.row(1).to_array()).toStrictEqual([3, 4])
})

test('get column', () => {
  m = Matrix.from_array([
    [1, 2],
    [3, 4],
  ])
  expect(m1.col(0)).toBeInstanceOf(Vector)
  expect(m1.col(0).to_array()).toStrictEqual([1, 3])
  expect(m1.col(1)).toBeInstanceOf(Vector)
  expect(m1.col(1).to_array()).toStrictEqual([2, 4])
})

test('dot product wrong sizes 2x3.2x3', () => {
  m1 = Matrix.from_array([
    [1, 2, 3],
    [4, 5, 6],
  ])
  m2 = Matrix.from_array([
    [7, 8, 9],
    [0, 1, 2],
  ])
  expect(() => { m1.dot(m2) }).toThrowError(Error)
})
test('dot correct sizes 2x2.2x1', () => {
  m1 = Matrix.from_array([
    [1, 2],
    [4, 5],
  ])
  m2 = Matrix.from_array([
    [7],
    [0],
  ])
  dot = m1.dot(m2)
  expect(dot.get(0, 0)).toBe(1 * 7 + 2 * 0)
  expect(dot.get(1, 0)).toBe(4 * 7 + 5 * 0)
})
test('dot product', () => {
  m1 = Matrix.from_array([
    [1, 2, 3],
    [4, 5, 6],
  ])
  m2 = Matrix.from_array([
    [7, 8],
    [9, 0],
    [1, 2],
  ])
  dot = m1.dot(m2)
  expect(dot.get(0, 0)).toBe(1 * 7 + 2 * 9 + 3 * 1)
  expect(dot.get(0, 1)).toBe(1 * 8 + 2 * 0 + 3 * 2)
  expect(dot.get(1, 0)).toBe(4 * 7 + 5 * 9 + 6 * 1)
  expect(dot.get(1, 1)).toBe(4 * 8 + 5 * 0 + 6 * 2)
  expect(dot.dimensions).toStrictEqual([2, 2])
})

test('transpose', () => {
  m = Matrix.from_array([
    [1, 2, 3],
    [4, 5, 6],
  ])
  T = m.transpose()
  expect(T.dimensions).toStrictEqual([3, 2])
  expect(T.get(0, 1)).toBe(4)
  expect(T.get(2, 0)).toBe(3)
})

test('for each', () => {
  m = Matrix.from_array([
    [1, 2, 3],
    [4, 5, 6],
  ])
  res = m.for_each((v) => v * 2)
  expect(res.get(0, 1)).toBe(4)
  expect(res.get(1, 2)).toBe(12)
})