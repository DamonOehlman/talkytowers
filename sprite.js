var formatter = require('formatter');

module.exports = function(location, frames) {
  var pattern = formatter(location);
  var images = [];

  for (var ii = 0; ii < frames; ii++) {
    var indexStr = (ii + 1).toString();
    while (indexStr.length < 2) {
      indexStr = '0' + indexStr;
    }

    console.log(indexStr);

    images[ii] = new Image();
    images[ii].src = pattern(indexStr);
  }

  return images;
};