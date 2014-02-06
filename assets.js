var async = require('async');
var list = [
  'bluedoor'
];

function loadAsset(name, callback) {
  var img = exports[name] = new Image();
  img.src = 'assets/' + name + '.png';
  img.onload = callback;
}

exports.load = function(callback) {
  async.forEach(list, loadAsset, callback);
};