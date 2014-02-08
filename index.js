var async = require('async');
var Avatar = require('./avatar');
var tower = require('./tower');
var actions = Object.keys(Avatar.prototype);
var crel = require('crel');
var shell = require('game-shell')();
var qc = require('rtc-quickconnect');
var media = require('rtc-media');
var qsa = require('fdom/qsa');
var signaller, dataChannel;
var peers = {};
var avatar = new Avatar();
var assets = require('./assets');

var SIGSRV = 'http://rtc.io/switchboard/';

// capture local media
var localStream = media();

// render the video
localStream.render(qsa('.localvideo')[0]);

function createAvatar(data) {
}

function run() {
  // join the signaller
  signaller = qc(SIGSRV, { room: 'talkytower-' + tower.id });

  tower.drawBackground();

  // create our avatar
  signaller.on('peer:announce', createAvatar);
  signaller.on('peer:leave', function(id) {
    console.log('peer ' + id + ' left');
    if (peers[id]) {
      peers[id].remove();
    }
  });

  signaller.createDataChannel(tower.id);

  signaller.on(tower.id + ':open', function(dc, id) {

    dc.send(buildWireAvatar(avatar, 'connect'));

    dataChannel = dc;

    var lastPos = {}
    avatar.on('change', function() {
      if (avatar.x === lastPos.x && avatar.level === lastPos.level) return;
      
      if (avatar.level !== lastPos.level) {
        //We've moved floors.
        //Connect to the media stream associated with our new floor.
        console.log('changed floors');

        // if we are already have a channel, leave that floor
        if (avatar.floorChannel) {
          avatar.floorChannel.leave();
        }

        // create join the room channel (cloning our signaller id)
        avatar.floorChannel = qc(SIGSRV, {
          id: signaller.id + ':video',
          room: avatar.building.name+'_'+avatar.level
        });

        //Broadcast our media to our new friends
        if (localStream.stream !== null) avatar.floorChannel.broadcast(localStream.stream);

        //Look at our friend's faces
        avatar.floorChannel.on('peer:connect', function(pc, id, data) {
          var coreId = id.split(':')[0];

          console.log('received peer:connect for media from: ' + id);

          if (peers[coreId] && pc.getRemoteStreams().length > 0) {
            media(pc.getRemoteStreams()[0]).render(peers[coreId].video);
          }
        });

      }

      lastPos = {x: avatar.x, level: avatar.level};

      //Send our new position out to the world
      dc.send(buildWireAvatar(avatar))
    });

    dc.onmessage = function(evt) {
      var data = JSON.parse(evt.data);
      console.log('recieved event', data);
      if (data.event == 'connect') {
        // Totally draw an avatar on the screen now.
        peers[id] = new Avatar();
        peers[id].name = data.name;
        peers[id].spriteIdx = data.sprite;
      }

      if (typeof data.x != 'undefined') {
        peers[id].x = data.x;
      }

      if (typeof data.level != 'undefined') {
        peers[id].level = data.level;
      }
      if (data.event == 'bell' && data.level === avatar.level) {
        document.getElementById('bellSound').play();
      }
    }
  });
}

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
  actions.forEach(function(action) {
    if (shell.wasDown(action)) {
      avatar[action].call(avatar);
    }
  });

  tower.context.clearRect(0, 0, tower.canvas.width, tower.canvas.height);

  // redraw our avatar
  avatar.sprite.draw(
    tower.context,
    avatar.x,
    tower.canvas.height - 32 - (avatar.level * tower.levelHeight)
  );
});

// create the tower

var buildWireAvatar = function(avatar, type) {
  var event = type || 'move'
  return JSON.stringify({
    event: event,
    x: avatar.x,
    level: avatar.level,
    name: avatar.name,
    sprite: avatar.spriteIdx
  });
};

var sendBell = function() {
  dataChannel.send(buildWireAvatar(avatar, 'bell'));
};