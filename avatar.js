var crel = require('crel');
var events = require('events');
var transform = require('feature/css')('transform');
var util = require('util');
var spriteLoader = require('spritey/loader')('node_modules/spritey/sprite/3', {
  scale: 3,
  transform: false
});

var sprites = [
  require('spritey/sprite/firefox.json'),
  require('spritey/sprite/goblin.json')
].map(spriteLoader);

function Avatar() {
  if (! (this instanceof Avatar)) {
    return new Avatar();
  }

  // initialise the level
  this._y = 0;
  this._x = 20;

  this.building = {
    name: 'building1'
  }

  //
  this._timer = 0;
  this._ymove = 0;

  this.frameIndex = 0;

  this.spriteIdx = (Math.random() * sprites.length) | 0;
  this.sprite = sprites[this.spriteIdx];
  this.el = crel('div', { class: 'avatar' });

  // initialise the name
  this.name = localStorage.username || window.prompt("What is your name?");
}

util.inherits(Avatar, events.EventEmitter);
module.exports = Avatar;

var proto = Avatar.prototype;

Object.defineProperty(proto, 'name', {
  get: function() {
    return this._name;
  },

  set: function(value) {
    if (value !== this._name) {
      localStorage.username = this._name;

      if (this.canvas) {
        this.canvas.setAttribute('data-name', value);
      }
    }
  }
});

Object.defineProperty(proto, 'x', {
  get: function() {
    return this._x;
  },

  set: function(value) {
    if (value !== this._x) {
      var delta = value - this._x;

      if (delta > 0) {
        this.sprite.walk_right();
      }
      else {
        this.sprite.walk_left();
      }

      this._x = value;
      this._changed();
    }
  }
})

Object.defineProperty(proto, 'y', {
  get: function() {
    return this._y;
  },

  set: function(value) {
    if (value !== this._y) {
      if (value > this._y) {
        this.sprite.walk_up();
      }
      else {
        this.sprite.walk_down();
      }

      this._y = value;
      this._changed();
    }
  }
});

proto.moveLeft = function() {
  this.moveX(-1);
};

proto.moveRight = function() {
  this.moveX(1);
};

proto.moveUp = function() {
  this.moveY(1);
};

proto.moveDown = function() {
  this.moveY(-1);
};

proto.moveX = function(delta) {
  this.x += delta;
}

proto.moveY = function(delta) {
  var avatar = this;

  clearTimeout(this._ymove);
  this._ymove = setTimeout(function() {
    avatar.y += delta;
  }, 50);
}

proto._changed = function() {
  var avatar = this;

  clearTimeout(this._timer);
  this._timer = setTimeout(function() {
    avatar.emit('change');
  }, 0);
};