var async = require('async');
var list = [
  'door1',
  'door2',
  'door3',
  'door4',
  'door5',
  'door6'
];

function loadAsset(name, callback) {
  var img = exports[name] = new Image();

  function checkLoaded() {
    if (img.width > 0) {
      return callback();
    }

    setTimeout(checkLoaded, 10);
  }

  img.src = 'assets/' + name + '.png';
  img.onload = checkLoaded;
}

exports.load = function(callback) {
  async.forEach(list, loadAsset, callback);
};