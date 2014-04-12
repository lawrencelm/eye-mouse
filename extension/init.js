var height = 480;
var width = 640;
var drawPt;
var cGaze = new camgaze.Camgaze(
  width,
  height,
  "eye-mouse-canvas"
);

var eyeTracker = new camgaze.EyeTracker(width, height);
var eyeFilter = new camgaze.EyeFilter();
var drawer = new camgaze.drawing.ImageDrawer();
//var mappedMovingAverage = new camgaze.structures.MovingAveragePoints( new camgaze.structures.Point(0,0), 10);
var runningAvg = new Array();
var lftAvg = new Array();
var rtAvg = new Array();
for (var i = 0; i < 5; i++) runningAvg.push(new camgaze.structures.Point(-1,-1));
for (var i = 0; i < 5; i++) lftAvg.push(new camgaze.structures.Point(-1,-1));
for (var i = 0; i < 5; i++) rtAvg.push(new camgaze.structures.Point(-1,-1));

function average(pts) {
  xsum = 0; ysum = 0;
  for (var i = 0; i < pts.length; i++) {
    xsum += pts[i].getX();
    ysum += pts[i].getY();
  }
  return new camgaze.structures.Point(xsum/pts.length, ysum/pts.length);
}
var calibrating = true;

function isCalibrated() {
  if (calibrating) {
    for (var i = 0; i < runningAvg.length; i++) {
      if (runningAvg[i].getX() < 0 || runningAvg[i].getY() < 0 ||
          lftAvg[i].getX() < 0 || lftAvg[i].getY() < 0 ||
          rtAvg[i].getX() < 0 || rtAvg[i].getY() < 0) 
        return false;
    }
  }
  if (calibrating) {
    set_gaze_center(average(runningAvg));
    console.log (" CALIBRATED!!! ");
  }
  calibrating = false;
  return true;
}

function reCalibrate() {
  for (var i = 0; i < runningAvg.length; i++) {
    runningAvg[i] = new camgaze.structures.Point(-1, -1);
    lftAvg[i] = new camgaze.structures.Point(-1, -1);
    rtAvg[i] = new camgaze.structures.Point(-1, -1);
  }
  calibrating = true;
}

var frameOp = function (image_data, video) {
  var lookingPt;
  var trackingData = eyeTracker.track(image_data, video);
  var gazeList = eyeFilter.getFilteredGaze(trackingData);
            // new HAAR.Detector(haarcascade_frontalface_alt, Parallel)
            //                     .image(image_data) // use the image
            //                     .interval(30) // set detection interval for asynchronous detection (if not parallel)
            //                     .complete(function(){  // onComplete callback
            //                         console.log(this.Selection, this.objects);
            //                         alert(l+" Objects found");
            //                     })
            //                     .detect(1, 1.25, 0.1, 1, true); // go
  
  if (trackingData.eyeList.length == 2) {
    //image_data = drawer.drawCircle(drawPt, 10, -1, "green");
    gazeList = eyeFilter.getFilteredGaze(trackingData);
    var lft_eye = gazeList[0].centroid.unfiltered;
    var rt_eye = gazeList[1].centroid.unfiltered;
    if (lft_eye.getX() > rt_eye.getX()) {
      var tmp = lft_eye;
      lft_eye = rt_eye;
      rt_eye = tmp;
    }
    var ctr_eye = lft_eye.add(rt_eye);
    runningAvg.push(new camgaze.structures.Point(ctr_eye.getX()/2, ctr_eye.getY()/2));
    runningAvg.shift();

    lftAvg.push(lft_eye);
    lftAvg.shift();

    rtAvg.push(rt_eye);
    rtAvg.shift();

    var eyeCenter = average(runningAvg);
    image_data = drawer.drawCircle(image_data, eyeCenter, 5, -1, "green");
    image_data = drawer.drawCircle(image_data, average(lftAvg), 5, -1, "red");
    image_data = drawer.drawCircle(image_data, average(rtAvg), 5, -1, "red");
    if (isCalibrated())
      move_from_centroid(eyeCenter);
  } else if (trackingData.eyeList.length == 1) {
    //console.log("WINK!");
  }
  return image_data;
};
cGaze.setFrameOperator(frameOp);
