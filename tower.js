var crel = require('crel');
var tower = module.exports = crel('article', { class: 'tower' });
var floors = tower.floors = [];
var FLOOR_COUNT = 3;

// create the floors
for (var ii = FLOOR_COUNT; ii--; ) {
  floors[ii] = crel('article', { class: 'level' }, crel('h1', 'Level ' + (ii + 1)));
  tower.appendChild(floors[ii]);
}

tower.init = function() {
  document.body.appendChild(tower);
};
