const NeuralNetwork = require('./core/NN');

window.main = function () {
    nn = new NeuralNetwork(2, [4, 5], 17)
    input = [[2, 2]]
    output = nn.feed_forward(input)

    console.log(output)
};