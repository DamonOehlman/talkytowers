var Sprite = require('spritey/sprite');
var sprites = require('./sprites');
var Ooze = require('ooze');

module.exports = function() {
  var data = {
    level: 0,
    x: 20,
    sprite: 0
  };

  var avatar = new Ooze(data);
  var sprite = avatar.sprite = sprites.avatars[avatar.get('sprite')].clone();
  var lastX = avatar.get('x');
  var lastLevel = avatar.get('level');

  function updateState(x, level) {
    avatar.set('state', [ x, level ]);
  }

  avatar.on('state', function(state) {
    avatar.set('x', state[0] );
    avatar.set('level', state[1] );
  });

  avatar.on('x', function(x) {
    if (lastX < x) {
      sprite.walk_right();
    }
    else if (lastX > x) {
      sprite.walk_left();
    }

    lastX = x;
    updateState(x, avatar.get('level'));
  });

  avatar.on('level', function(level) {
    if (lastLevel < level) {
      sprite.walk_up();
    }
    else if (lastLevel > level) {
      sprite.walk_down();
    }

    lastLevel = level;
    updateState(avatar.get('x'), level);
  });

  // handle sprite change
  avatar.on('sprite', function(idx) {
    sprite = avatar.sprite = sprites.avatars[idx].clone();
  });

  avatar.draw = function(tower) {
    // redraw our avatar
    sprite.draw(
      tower.context,
      lastX,
      tower.canvas.height - (lastLevel * tower.levelHeight)
    );
  }

  return avatar;
};