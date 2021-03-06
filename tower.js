var assets = require('./assets');
var crel = require('crel');
var qsa = require('fdom/qsa');
var tower = module.exports = qsa('.tower')[0];
var levels = tower.levels = [];
var levelHeight = tower.levelHeight = 80;
var floorHeight = 2;
var doorHeight = assets.doorHeight * 2;
var doorWidth = assets.doorWidth * 2;

// calculate the tower bounds
var bounds = tower.getBoundingClientRect();

var background = crel('canvas', {
  width: bounds.width|0,
  height: bounds.height|0
});

// create the canvas
var canvas = tower.canvas = crel('canvas', {
  width: bounds.width | 0,
  height: bounds.height | 0
});

// get the canvas context
var context = tower.context = canvas.getContext('2d');

function drawLevel(ctx, y) {
  // offset by half pixel to get crisp drawing
  y -= 0.5;

  // fill the rect with the wallpaper
  ctx.fillStyle = ctx.createPattern(assets.getRandomWallpaper(), 'repeat-y');
  ctx.fillRect(0, y - levelHeight, canvas.width, levelHeight);

  for (var ii = 0; ii < 4; ii++) {
    ctx.drawImage(
      assets.getRandomDoor(),
      50 + (ii * 100),
      y - doorHeight - (floorHeight + 1),
      doorWidth,
      doorHeight
    );
  }

  // draw the bottom line
  ctx.fillStyle = 'rgb(200, 200, 200)';
  ctx.fillRect(0, y - floorHeight, canvas.width, floorHeight);
}

// context.fillStyle = 'red';
// context.fillRect(0, 0, canvas.width, canvas.height);

// initialise the tower name
tower.id = 'test';

tower.appendChild(background);
tower.appendChild(canvas);

tower.drawBackground = function() {
  var ctx = background.getContext('2d');
  var y = background.height;

  // clear the background
  ctx.clearRect(0, 0, background.width, background.height);

  // draw the levels
  while (y - levelHeight > 0) {
    // draw the level
    drawLevel(ctx, y);

    y -= levelHeight;
  }
};