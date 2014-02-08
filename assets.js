var async = require('async');
var list = [
  'wallpaper',
  'doors'
];
var wallpapers;
var paperHeight = 16;
var doorWidth = exports.doorWidth = 16;
var doorHeight = exports.doorHeight = 32;

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

exports.getRandomDoor = function() {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var doorX = ((Math.random() * (exports.doors.width / doorWidth)) | 0) * doorWidth;
  var doorY = ((Math.random() * (exports.doors.height / doorHeight)) | 0) * doorHeight;

  canvas.width = doorWidth;
  canvas.height = doorHeight;

  context.drawImage(
    exports.doors,
    doorX,
    doorY,
    doorWidth,
    doorHeight,
    0,
    0,
    doorWidth,
    doorHeight
  );

  return canvas;
}
