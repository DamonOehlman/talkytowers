var crel = require('crel');
var qsa = require('fdom/qsa');
var tower = module.exports = qsa('.tower')[0];
var levels = tower.levels = [];
var FLOOR_COUNT = 5;

// initilaise the tower width and level height
tower.width = 768;
tower.levelHeight = 80;

// create the floors
for (var ii = FLOOR_COUNT; ii--; ) {
  var container = crel('article', { class: 'level' }, crel('h2', 'Level ' + (ii + 1)));
  var canvas = crel('canvas', {
    width: tower.width,
    height: tower.levelHeight
  });
  
  levels[ii] = canvas.getContext('2d');
  
  container.appendChild(canvas);
  tower.appendChild(container);
}