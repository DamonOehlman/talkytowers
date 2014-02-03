// adapted from: http://jsfiddle.net/yong/ZJQX5/
function flipImage(img, flipH, flipV) {
  var scaleH = flipH ? -1 : 1;
  var scaleV = flipV ? -1 : 1;
  var posX = flipH ? img.width * -1 : 0;
  var posY = flipV ? img.height * -1 : 0;

  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext('2d');

  if (img.width === 0 || img.height === 0) {
    img.addEventListener('load', function() {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.save();
      ctx.scale(scaleH, scaleV); // Set scale to flip the image
      ctx.drawImage(img, posX, posY, img.width, img.height); // draw the image
      ctx.restore(); // Restore the last saved state
    });
  }
  

  return canvas;  
}

exports.x = function(img) {
  return flipImage(img, true, false);
};