var crel = require('crel');
var events = require('events');
var util = require('util');
var flip = require('./flip');
var sprite = require('./sprite');

function Avatar(tower) {
  if (! (this instanceof Avatar)) {
    return new Avatar(tower);
  }

  // initialise the level
  this.y = 0;
  this.x = 0;

  this.building = {
    name: 'building1'
  }

  this.name = localStorage.username || window.prompt("What is your name?");

  localStorage.username = this.name

  //
  this._timer = 0;

  this.walkRightFrames = sprite('assets/walk/p1_walk{{ 0 }}.png', 11);
  this.walkLeftFrames = this.walkRightFrames.map(flip.x);

  // create a canvas
  this.canvas = crel('canvas', { width: 100, height: 100 });
  this.context = this.canvas.getContext('2d');

  // add ourselves to the tower
  tower.floors[this.y].appendChild(this.canvas);

  // draw frame
  this._draw();
}

util.inherits(Avatar, events.EventEmitter);
module.exports = Avatar;

var proto = Avatar.prototype;

proto.moveLeft = function() {
  this.x -= 1;
  this._changed(-1);
};

proto.moveRight = function() {
  this.x += 1;
  this._changed(1);
};

proto.moveUp = function() {
  this.y += 1;
  this._changed();
};

proto.moveDown = function() {
  this.y -= 1;
  this._changed();
};

proto._changed = function() {
  var avatar = this;

  clearTimeout(this._timer);
  this._timer = setTimeout(function() {
    avatar.emit('change');
  }, 0);
};

proto._draw = function() {
  var frame = this.walkRightFrames[0];
  var offsetX;
  var offsetY;

  if (frame.width === 0 || frame.height === 0) {
    return frame.addEventListener('load', this._draw.bind(this));
  }

  offsetX = (this.canvas.width - frame.width) >> 1;
  offsetY = this.canvas.height - frame.height;

  this.context.drawImage(frame, offsetX, offsetY);
};
