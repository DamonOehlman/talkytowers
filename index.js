var Avatar = require('./avatar');
var actions = Object.keys(Avatar.prototype);
var crel = require('crel');
var shell = require('game-shell')();
var qc = require('rtc-quickconnect');
var media = require('rtc-media');
var signaller;
var peers = {};
var avatar = new Avatar();

// capture local media
var localStream = media();

function createAvatar(data) {
}

shell.once('init', function() {
  // join the signaller
  signaller = qc('http://rtc.io/switchboard/', { ns: 'talkytower' });

  // create our avatar
  signaller.on('peer:announce', createAvatar);

  signaller.createDataChannel(avatar.building.name);

  signaller.on(avatar.building.name+':open', function(dc, id) {

    dc.send(buildWireAvatar(avatar, 'connect'));

    avatar.on('change', function() {
      dc.send(buildWireAvatar(avatar))
    });

    dc.onmessage = function(evt) {
      var data = JSON.parse(evt.data);
      console.log('recieved event', data);
      if (data.event == 'connect') {
        // Totally draw an avatar on the screen now.
      }
    }
  });
});

shell.bind('moveLeft', 'left', 'A');
shell.bind('moveRight', 'right', 'D');
shell.bind('moveUp', 'up', 'W');
shell.bind('moveDown', 'down', 'S');

shell.on('tick', function() {
  actions.forEach(function(action) {
    if (shell.wasDown(action)) {
      avatar[action].call(avatar);
    }
  });
});

// create the tower

buildWireAvatar = function(avatar, type) {
  var event = type || 'move'
  return JSON.stringify({
    event: event,
    x: avatar.x,
    y: avatar.y,
    name: avatar.name
  });
};