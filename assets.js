var async = require('async');
var list = [
  'wallpaper',
  'door1',
  'door2',
  'door3',
  'door4',
  'door5',
  'door6'
];
var wallpapers;
var paperHeight = 16;

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

function segmentWallpapers() {
  var ii = 0;
  var canvas;

  // initialise the wallpapers array
  wallpapers = [];

  // slice the wallpapers out of the image lookup
  while (ii  * paperHeight < exports.wallpaper.height) {
    canvas = wallpapers[ii] = document.createElement('canvas');
    canvas.width = exports.wallpaper.width;
    canvas.height = paperHeight;

    canvas.getContext('2d').drawImage(
      exports.wallpaper,
      0,
      ii * paperHeight,
      exports.wallpaper.width,
      paperHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    ii += 1;
  }
}

exports.load = function(callback) {
  async.forEach(list, loadAsset, callback);
};

exports.getRandomWallpaper = function() {
  if (! wallpapers) {
    segmentWallpapers();
  }

  return wallpapers[(Math.random() * wallpapers.length) | 0];
};