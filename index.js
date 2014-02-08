var async = require('async');
var avatar = require('./avatar');
var tower = require('./tower');
var crel = require('crel');
var shell = require('game-shell')();
var qc = require('rtc-quickconnect');
var bufferedchannel = require('rtc-bufferedchannel');
var media = require('rtc-media');
var qsa = require('fdom/qsa');
var signaller, dataChannel;
var assets = require('./assets');
var throttle = require('cog/throttle');

var peers = [];
var channels = [];
var localAvatar = avatar();
var peerAvatars = {};

var SIGSRV = 'http://rtc.io/switchboard/';

var actions = require('actionmap')({
  moveLeft: function() {
    this.set('x', this.get('x') - 1);
  },

  moveRight: function() {
    this.set('x', this.get('x') + 1);
  },

  moveUp: throttle(function() {
    this.set('level', this.get('level') + 1);
  }, 500, { trailing: false }),

  moveDown: throttle(function() {
    this.set('level', this.get('level') - 1);
  }, 500, { trailing: false })
})

// capture local media
var localStream = media();

function sendLocalState(state) {
  var payload = new Uint16Array(state);

  channels.forEach(function(channel) {
    channel.send(payload);
  });
}

// render the video
localStream.render(qsa('.localvideo')[0]);

function run() {
  tower.drawBackground();

  qc(SIGSRV, { room: 'talkytower-' + tower.id })
    .createDataChannel('movement', { reliable: false })
    .on('movement:open', function(dc, id) {
      var channel = bufferedchannel(dc);

      channel.on('data', function(state) {
        peerAvatars[id].set('state', state);
      });

      // create a peer avatar for the peer
      peerAvatars[id] = avatar();
      peers.push(id);
      channels.push(channel);
    })
    .on('peer:update', function(data) {
      console.log('received update from peer: ', data);
    })
    .on('peer:leave', function(id) {
      console.log('peer ' + id + ' has left');
    });
}

localAvatar.on('state', throttle(sendLocalState, 1000 / 25));

async.parallel([
  assets.load,
  shell.once.bind(shell, 'init')
], run);

shell.bind('moveLeft', 'left', 'A');
shell.bind('moveRight', 'right', 'D');
shell.bind('moveUp', 'up', 'W');
shell.bind('moveDown', 'down', 'S');

shell.on('tick', function() {
  if (shell.wasDown('B')) sendBell();

  actions.process(shell, [ localAvatar ]);
  tower.context.clearRect(0, 0, tower.canvas.width, tower.canvas.height);

  // draw the local avatar to the tower
  localAvatar.draw(tower);

  peers.forEach(function(id) {
    var av = peerAvatars[id];

    if (av) {
      av.draw(tower);
    }
  });
});