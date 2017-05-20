var path = require('path');

module.exports = {
  entry: './test/viewer/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'test/viewer')
  }
};
