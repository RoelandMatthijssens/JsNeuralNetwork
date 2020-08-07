const NeuralNetwork = require('../core/NN');

test('initialize nn', () => {
    nn = new NeuralNetwork(2, [], 2)
    expect(nn.layers.length).toBe(2)
})
test('initialize with hidden layers', () => {
    nn = new NeuralNetwork(2, [2, 5], 2)
    expect(nn.layers.length).toBe(4)
})
test('initialize count nodes', () => {
    nn = new NeuralNetwork(2, [3, 5], 4)
    expect(nn.layers.length).toBe(4)
    expect(nn.layers[0].size).toBe(2)
    expect(nn.layers[1].size).toBe(3)
    expect(nn.layers[2].size).toBe(5)
    expect(nn.layers[3].size).toBe(4)
})
test('initializer', () => {
    initializer = () => { return 1 }
    nn = new NeuralNetwork(2, [], 3, initializer)
    expect(nn.layers[0].values.to_array()).toStrictEqual([[1], [1]])
    expect(nn.layers[1].values.to_array()).toStrictEqual([[1], [1], [1]])
})
test('weights dimensions', () => {
    nn = new NeuralNetwork(2, [], 3)
    expect(nn.layers[1].weights.dimensions).toStrictEqual([3, 2])
})
test('weights dimensions hidden layers', () => {
    nn = new NeuralNetwork(2, [4, 3], 3)
    expect(nn.layers[1].weights.dimensions).toStrictEqual([4, 2])
    expect(nn.layers[2].weights.dimensions).toStrictEqual([3, 4])
})
test('feed forward', () => {
    initializer = () => { return 1 }
    nn = new NeuralNetwork(2, [], 2, initializer)
    input = [[2, 2]]
    result = nn.feed_forward(input)
    console.log(result)
    expect(1).toBe(2)
})
