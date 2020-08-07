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

test('activation function', () => {
    nn = new NeuralNetwork(2, [], 3)
    activation_function = (x) => x + 1
    nn.set_activation_functions(null, [], activation_function)
    expect(nn.layers[1].activation_function(5)).toBe(6)
})

test('activation function for hidden layers', () => {
    nn = new NeuralNetwork(2, [3, 4, 5], 3)
    h1_f = (x) => x + 1
    h2_f = (x) => x + 2
    h3_f = (x) => x + 3
    nn.set_activation_functions(null, [h1_f, h2_f, h3_f], null)
    expect(nn.layers[1].activation_function(5)).toBe(6)
    expect(nn.layers[2].activation_function(5)).toBe(7)
    expect(nn.layers[3].activation_function(5)).toBe(8)
})

test('feed forward', () => {
    initializer = () => { return 1 }
    nn = new NeuralNetwork(2, [], 2, initializer)
    nn.set_activation_functions(null, [], (x) => x + 1)
    input = [[2, 2]]
    expected = (2 * 1 + 2 * 1 + 1) + 1 //f(w1*x1+w2*x2+bias)
    actual = nn.feed_forward(input)
    expect(actual).toStrictEqual([[expected], [expected]])
})

test('feed forward with hidden layer', () => {
    initializer = () => { return 1 }
    nn = new NeuralNetwork(2, [3], 1, initializer)
    nn.set_activation_functions(null, [(x) => x + 2], (x) => x + 1)
    input = [[2, 3]]
    //  /| 1, 1 |   | 2 |   | 1 |\      /| 6 |\    | 8 |
    //f| | 1, 1 | x | 3 | + | 1 | | = f| | 6 | | = | 8 |
    //  \| 1, 1 |           | 1 |/      \| 6 |/    | 8 |
    hidden_expected = 7

    //  /              | 8 |        \
    //f| | 1, 1, 1 | x | 8 | + | 1 | | = f(| 25 |) = | 26 |
    //  \              | 8 |        /
    output_expected = 26
    actual = nn.feed_forward(input)
    expect(actual).toStrictEqual([[output_expected]])
})
