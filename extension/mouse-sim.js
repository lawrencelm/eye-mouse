var prevx = $(window).width()/2;
var prevy = $(window).height()/2;
var x = prevx;
var y = prevy;
var simx = x;
var simy = y;
var amp = 1;
function update_cursor(x, y) {
  document.getElementById("eye-mouse-cursor").style.top=(y+2).toString() + "px";
  document.getElementById("eye-mouse-cursor").style.left=(x+2).toString() + "px";
}

var min = 5;
var xmax = $(window).width()-5;
var ymax = $(window).height()-5;
function bounds_check() {
  if (simx < min) simx = min;
  if (simy < min) simy = min;
  if (simx >= $(window).width()) simx = $(window).width()-1 - min;
  if (simy >= $(window).width()) simy = $(window).width()-1 - min;
}

function move_from_gazevec(vec) {
  prevx = simx; prevy = simy;
  simx -= vec.getX()/amp;
  simy += vec.getY()/amp;
  bounds_check();
  update_cursor(simx, simy);
}

function move_from_centroid(c) {
  prevx = x; prevy = y;
  x = c.getX();
  y = c.getY();
  simx += (x - prevx) * amp;
  simy += (y - prevy) * amp;
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

