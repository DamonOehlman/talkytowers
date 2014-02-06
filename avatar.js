var crel = require('crel');
var events = require('events');
var throttle = require('cog/throttle');
var util = require('util');
var Sprite = require('spritey/sprite');
var sprites = require('./sprites');


function Avatar() {
  if (! (this instanceof Avatar)) {
    return new Avatar();
  }

  // initialise serializable members
  this.level = 0;
  this.x = 20;
  this.action = 'move';
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
    }
  }
})

Object.defineProperty(proto, 'level', {
  get: function() {
    return this._level;
  },

  set: function(value) {
    if (value !== this._level) {
      if (value > this._level) {
        this.sprite.walk_up();
      }
      else {
        this.sprite.walk_down();
      }

      this._level = value;
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
  this.moveLevel(1);
};

proto.moveDown = function() {
  this.moveLevel(-1);
};

proto.moveX = function(delta) {
  this.x += delta;
};

proto.moveLevel = throttle(function(delta) {
  console.log('moving level');
  this.level += delta;
}, 500, { trailing: false });