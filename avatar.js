var events = require('events');
var util = require('util');

function Avatar() {
  if (! (this instanceof Avatar)) {
    return new Avatar();
  }

  // initialise the level
  this.y = 0;
  this.x = 0;

  //
  this._timer = 0;
}

util.inherits(Avatar, events.EventEmitter);
module.exports = Avatar;

var proto = Avatar.prototype;

proto.moveLeft = function() {
  this.x -= 1;
  this._changed();
};

proto.moveRight = function() {
  this.x += 1;
  this._changed();
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