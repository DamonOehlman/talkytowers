var crel = require('crel');
var events = require('events');
var transform = require('feature/css')('transform');
var util = require('util');
var flip = require('./flip');
var sprite = require('./sprite');

function Avatar(tower) {
  if (! (this instanceof Avatar)) {
    return new Avatar(tower);
  }

  // initialise the level
  this._y = 0;
  this._x = 0;

  this.building = {
    name: 'building1'
  }

  //
  this._timer = 0;
  this._ymove = 0;
  this.tower = tower;

  this.frameIndex = 0;
  this.walkRightFrames = sprite('assets/walk/p1_walk{{ 0 }}.png', 11);
  this.walkLeftFrames = this.walkRightFrames.map(flip.x);

  this.el = crel('div', { class: 'avatar' });

  // create a canvas
  this.canvas = crel('canvas', { class: 'sprite', width: 100, height: 100 });
  this.context = this.canvas.getContext('2d');
  this.el.appendChild(this.canvas);

  // create a small video tag for the person
  this.video = crel('video', { width: 120, height: 90 });
  this.el.appendChild(this.video);

  // initialise the name
  this.name = localStorage.username || window.prompt("What is your name?");

  // add ourselves to the tower
  tower.floors[this.y].appendChild(this.el);

  // draw frame
  this._draw();
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

      this._x = value;
      transform(this.el, 'translate(' + value + 'px, 0px)');
      this._changed(delta);
    }
  }
})

Object.defineProperty(proto, 'y', {
  get: function() {
    return this._y;
  },

  set: function(value) {
    if (value !== this._y) {
      this._y = value;
      this._changeLevel();
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

proto.remove = function() {
  if (this.el.parentNode) {
    this.el.parentNode.removeChild(this.el);
  }
};

proto._changed = function(frameChange) {
  var avatar = this;

  if (frameChange) {
    this.frameIndex = (this.frameIndex + frameChange) % this.walkRightFrames.length;
    this._draw();
  }

  clearTimeout(this._timer);
  this._timer = setTimeout(function() {
    avatar.emit('change');
  }, 0);
};

proto._changeLevel = function() {
  this.remove();
  
  // add ourselves to the tower
  this.tower.floors[this.y].appendChild(this.el);
};

proto._draw = function() {
  var frames = this.walkRightFrames; // this.frameIndex >= 0 ? this.walkRightFrames : this.walkLeftFrames;
  var frame = frames[Math.abs(this.frameIndex)];
  var offsetX;
  var offsetY;

  if (frame.width === 0 || frame.height === 0) {
    return frame.addEventListener('load', this._draw.bind(this));
  }

  offsetX = (this.canvas.width - frame.width) >> 1;
  offsetY = this.canvas.height - frame.height;

  this.context.clearRect(0, 0, 100, 100);
  this.context.drawImage(frame, offsetX, offsetY);
};