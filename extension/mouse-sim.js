// append required DOM elements
$('body').after('\
  <div id="eye-mouse-cursor"></div>\
  <canvas id="eye-mouse-canvas"></canvas>\
  <video id="eye-mouse-video" style="display: none;" autoplay></video>\
');

$eyeMouseCanvas = $('#eye-mouse-canvas')
console.log($eyeMouseCanvas)

$eyeMouseCanvas.mouseenter(function () {
  console.log('mouseenter')
  $eyeMouseCanvas.animate({
    right: '0px',
    bottom: '0px',
    opacity: 1
  });
});
$eyeMouseCanvas.mouseleave(function () {
  $eyeMouseCanvas.animate({
    right: '-480px',
    bottom: '-360px',
    opacity: 0.5
  });
});

var prevx = $(window).width()/2;
var prevy = $(window).height()/2;
var x = prevx;
var y = prevy;
var simx = x;
var simy = y;
var amp = 25;

var running_xavg = new Array();
var running_yavg = new Array();

function update_cursor(x, y) {
  document.getElementById("eye-mouse-cursor").style.backgroundColor = "#0f0";
  document.getElementById("eye-mouse-cursor").style.top=(y+2).toString() + "px";
  document.getElementById("eye-mouse-cursor").style.left=(x+2).toString() + "px";
}

var min = 1;
var xmax = $(window).width()-1;
var ymax = $(window).height()-1;
var gaze_center =  new camgaze.structures.Point(xmax/2, ymax/2);

function set_gaze_center (new_center) {
  x = new_center.getX();
  y = new_center.getY();
  prevx = x; 
  prevy = y;
  simx = x;
  simy = y;
  for (var i = 0; i < 10; i++) {
    running_xavg.push(x);
    running_yavg.push(y);
  }
}

function bounds_check() {
  if (simx < min) simx = min;
  if (simy < min) simy = min;
  if (simx >= $(window).width()) simx = $(window).width()-1 - min;
  if (simy >= $(window).width()) simy = $(window).width()-1 - min;
}

function move_from_centroid(c) {
  prevx = x; prevy = y;
  x = c.getX();
  y = c.getY();
  simx -= (c.getX() - prevx) * amp;
  simy += (c.getY() - prevy) * amp;
  bounds_check();
  running_xavg.push(simx);
  running_xavg.shift();
  running_yavg.push(simy);
  running_yavg.shift();
  var xavg = running_xavg.reduce(function(a,b) { return a+b }) / running_xavg.length;
  var yavg = running_yavg.reduce(function(a,b) { return a+b }) / running_yavg.length;
  update_cursor(xavg, yavg);
}

function wink(side) {
  document.getElementById("eye-mouse-cursor").style.backgroundColor = "#00f";
  var e = document.elementFromPoint(simx, simy);
  if (e != null && e.tagName == "A" && e.hasAttribute("HREF")) window.location.replace(e.getAttribute("HREF"));
}

$(window).load(function() {
  update_cursor(simx, simy);
});

