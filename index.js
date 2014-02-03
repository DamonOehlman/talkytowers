var Avatar = require('./avatar');
var actions = Object.keys(Avatar.prototype);
var shell = require('game-shell')();
var qc = require('rtc-quickconnect');
var signaller;
var peers = {};
var avatar = new Avatar();

function createAvatar(data) {
}

shell.once('init', function() {
  // join the signaller
  signaller = qc('http://rtc.io/switchboard/', { ns: 'talkytower' });

  // create our avatar
  signaller.on('peer:announce', createAvatar);

  // on change, send info through the data channel
  avatar.on('change', function() {
    console.log('avatar changed');
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