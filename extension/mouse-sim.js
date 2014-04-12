// append required DOM elements
$('body').after('\
  <div id="eye-mouse-cursor"></div>\
  <canvas id="eye-mouse-canvas"></canvas>\
  <video id="eye-mouse-video" style="display: none;" autoplay></video>\
');

var prevx = $(window).width()/2;
var prevy = $(window).height()/2;
var x = prevx;
var y = prevy;
var simx = x;
var simy = y;
var amp = 10;
var update_cursor = function (x, y) {
  document.getElementById("eye-mouse-cursor").style.top=(y+2).toString() + "px";
  document.getElementById("eye-mouse-cursor").style.left=(x+2).toString() + "px";
}

var min = 1;
var xmax = $(window).width()-1;
var ymax = $(window).height()-1;
var gaze_center =  new camgaze.structures.Point(xmax/2, ymax/2);

function set_gaze_center (new_center) {
  x = new_center.getX() + 100;
  y = new_center.getY() + 100;
  prevx = x;
  prevy = y;
  simx = x;
  simy = y;
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
  update_cursor(simx, simy);
}

$(window).load(function() {
  update_cursor(simx, simy);
  $(window).click(function() {
    var e = document.elementFromPoint(simx, simy);
    if (e.tagName =="A" && e.hasAttribute("HREF")) {
      window.location.replace(e.getAttribute("HREF"));
    }
  });
});

