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
  this.y = 0;
  this.x = 0;

  this.building = {
    name: 'building1'
  }

  this.name = localStorage.username || window.prompt("What is your name?");

  localStorage.username = this.name

  //
  this._timer = 0;
  this._ymove = 0;
  this.tower = tower;

  this.frameIndex = 0;
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
  this.moveX(-1);
};

proto.moveRight = function() {
  this.moveX(1);
};

proto.moveUp = function() {
  this.moveY(1);
};

proto.moveDown = function() {
  if (this.y >= 0) {
    this.moveY(-1);
  }
};

proto.moveX = function(delta) {
  this.x += delta;
  transform(this.canvas, 'translate(' + this.x + 'px, 0px)');
  this._changed(delta);
}

proto.moveY = function(delta) {
  var avatar = this;

  clearTimeout(this._ymove);
  this._ymove = setTimeout(function() {
    avatar.y += delta;
    avatar._changeLevel();
    avatar._changed();
  }, 50);
}

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
  if (this.canvas.parentNode) {
    this.canvas.parentNode.removeChild(this.canvas);
  }

  // add ourselves to the tower
  this.tower.floors[this.y].appendChild(this.canvas);
};

proto._draw = function() {
  console.log(this.frameIndex);
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