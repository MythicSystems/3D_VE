// ///////////////////////////////////////////////////////////
// Interactive 3D Vector Equilibrium in Rainbow Space ///////
// http://michaelgaio.com/lab/html5/ve1
// ///////////////////////////////////////////////////////////
// adapted from dice's "GURUGURU (3d rotation)" http://jsdo.it/dice/l08r

var cos = Math.cos;
var sin = Math.sin;
var trad = Math.PI / 180;
var center = 232;
var mrds = 200;
var centerX = center;
var centerY = center;
var canvas, ctx;
var rect;
var i;
var shapeList = [];
var ry, rx, rz;

function _mousemove(e){
  var mouseX, mouseY;
  var yd, xd, dis;
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  yd = mouseY - centerY;
  xd = mouseX - centerX;
  dis = Math.sqrt(yd*yd+xd*xd);
  if(dis > mrds) dis = mrds;
  sp = dis * 0.02;
  var r = Math.atan2(yd, xd);
  ry = cos(r) * sp;
  rx = -sin(r) * sp;
}

function Shape(x,y,z){
  var scale = 100;
  var color_scale = 125;
  var color_offset = 125;
  this.x = x * scale;
  this.y = y * scale;
  this.z = z * scale;
  this.r = x * color_scale + color_offset;//x / 50;//(x + 64) / 128;
  this.g = y * color_scale + color_offset;//(y + 64) / 128;
  this.b = z * color_scale + color_offset;//(z + 64) / 128;
}

function mySort(a,b){
  return a.z - b.z;
}

var oldtime;
var width = 32;
var frameCnt = 0;
var framerate = 24;
var fps = 0;

function checkFPS(){
  ++frameCnt;
  var now = (new Date()).getTime();
  if (now - oldtime >= 1000){
    fps = (frameCnt * 1000 / (now - oldtime)) >> 0;
    oldtime = now;
    frameCnt = 0;
  }
  ctx.fillStyle = "white";
  ctx.fillText("FPS: " + fps +"/" + framerate, 10, 20);
}

var lPosX = (centerX-width*0.25);
var lPosY = (centerY-width*0.3);
var grad, brn;

function drawing(){
  ctx.fillStyle = "rgba(0,0,0,1)"; // background, 0.8 : trail
  ctx.fillRect(0,0,465,465);
  ctx.fillStyle = "rgba(0,0,0,1)";
  var pLen = shapeList.length;
  for(var i=0; i<pLen; i++){
    af3(shapeList[i]);
  }
  shapeList.sort(mySort);
  var w, scale;
  for(i=0; i<pLen; i++) {
    var p = shapeList[i];
    scale = Math.sqrt(p.x * p.x + p.y * p.y + (p.z - 300) * (p.z - 300)); 
    w = (width * (7 + 3 * ((p.z + center) * 0.0025))) * 0.1;
    brn = (6 + 4 * (p.z/ mrds)) * 0.1;
    grad  = ctx.createRadialGradient(p.x + lPosX,p.y + lPosY,0,p.x + lPosX,p.y + lPosY,w);
    grad.addColorStop(0.2,"rgba("+(255 * brn >> 0)+","+(255 * brn >> 0)+","+(255 * brn >> 0)+",1)");
    grad.addColorStop(0.5,"rgba("+(p.r * brn >> 0)+","+(p.g * brn >> 0)+","+(p.b * brn >> 0)+",1)");
    grad.addColorStop(0.6,"rgba("+(p.r * brn >> 0)+","+(p.g * brn >> 0)+","+(p.b * brn >> 0)+",1)");
    grad.addColorStop(1,"rgba(0,0,0,1)");
    drawCircle(p.x, p.y, w, grad, brn);
  }
  checkFPS();
}

var r360 = Math.PI * 2;
function drawCircle(x, y, w, col, b){
  ctx.beginPath();
  ctx.strokeStyle = "rgba("+(255 * b >> 0)+","+(255 * b >> 0)+","+(255 * b >> 0)+",1)";
  ctx.fillStyle = col;
  ctx.arc(x + centerX, y + centerY, w, 0, r360, true);
  ctx.fill();
  ctx.stroke();

}

function randomInt(n){
  return Math.random() * n >> 0;
}

function af3(p){
  var x1, y1, z1;
  x1 = (p.x * cos(ry * trad)) + (p.z * sin(ry * trad));
  z1 = (p.x * -sin(ry * trad)) + (p.z * cos(ry * trad));
  p.x = x1;
  p.z = z1;
  x1 = (p.x * cos(rz * trad)) + (p.y * -sin(rz * trad));
  y1 = (p.x * sin(rz * trad)) + (p.y * cos(rz * trad));
  p.x = x1;
  p.y = y1;
  y1 = (p.y * cos(rx * trad)) + (p.z * -sin(rx * trad));
  z1 = (p.y * sin(rx * trad)) + (p.z * cos(rx * trad));
  p.y = y1;
  p.z = z1;
}

function init(){
  canvas = document.getElementById("canvas");
  canvas.addEventListener("mousemove", _mousemove, true);
  ctx = canvas.getContext("2d");
  ctx.font = "16px _sans";
  ctx.lineWidth = 2;
  rect = canvas.getBoundingClientRect();
  
  // VE
  shapeList[0] = new Shape(0, 0, 0);
  shapeList[1] = new Shape(-1, 0, -1);
  shapeList[2] = new Shape(-1, -1, 0);
  shapeList[3] = new Shape(1, -1, 0);
  shapeList[4] = new Shape(0, -1, 1);
  shapeList[5] = new Shape(1, 1, 0);
  shapeList[6] = new Shape(0, 1, 1);
  shapeList[7] = new Shape(-1, 1, 0);
  shapeList[8] = new Shape(1, 0, 1);
  shapeList[9] = new Shape(0, 1, -1);
  shapeList[10] = new Shape(-1, 0, 1);
  shapeList[11] = new Shape(1, 0, -1);
  shapeList[12] = new Shape(0, -1, -1);
    
  for(i=0; i<13; i++){
    ry = 1;//randomInt(360);
    rx = 1;//randomInt(360);
    rz = 0;
    af3(shapeList[i]);
  }
  ry = 0;
  rx = 0;
  rz = 0;
  oldtime = new Date().getTime();
  setInterval(drawing, 250 / framerate);
}

window.addEventListener("load", init, true);