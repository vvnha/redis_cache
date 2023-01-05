const hexEncode = function (text) {
  var hex, i;

  var result = '';
  for (i = 0; i < text.length; i++) {
    hex = text.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-4);
  }

  return result;
};

const hexDecode = function (text) {
  var j;
  var hexes = text.match(/.{1,4}/g) || [];
  var back = '';
  for (j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
};

console.log(hexDecode('004e006800e3'));
