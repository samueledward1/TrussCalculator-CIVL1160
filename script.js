var forceType = [];
var edgeLength = [];
let modYoung = 200; //GPa
var elongMM =  [];

class Force {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getForceX() {
    return this.x;
  }

  getForceY() {
    return this.y;
  }
}
//analyze function
var height, length, area=100, joints, angle, degree;

function analyze() {
  // get form inputs
  height = $("#height").val();
  length = $("#length").val();
  area = $("#area").val();
  joints = $("#jointNum").val();
  angle = $("#angle").val();
  degree = Math.atan(height / length);
  var text = "Angle of inclination = " + degree.toFixed(3) + " radian";
  //show output of angle
  $("#textangle").html(text);
  

  let cc = Math.cos(degree);
  let ss = Math.sin(degree);
  console.log("cc:", cc);
  console.log("ss: ", ss);

  let NUM_EDGES = 2 * joints - 3;
  var array = [];

  //letters = ["A", "B", "C", "D", "E", "F", "G", "H",
  //"I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  load = {};

  for (i = 0; i < joints; ++i) {
    load[i] = new Force(0, 0);
  }

  load[3].y = 20;
  load[4].y = 20;
  load[5].y = 10;

  var p = [];
  for (i = 0; i < joints; ++i) {
    temp1 = [];
    loadX = load[i].getForceX();
    temp1.push(loadX)

    temp2 = [];
    loadY = load[i].getForceY();
    temp2.push(loadY);

    p.push(temp1);
    p.push(temp2);

  }

  porce = math.matrix(p);

  //PORCE GAES
  console.log("PORCE");
  console.log(porce);
  var minusP = math.dotMultiply(porce, -1);
  //console.log(z);

  var matrix = [];

  for (i = 0; i < NUM_EDGES + 3; ++i) {
    temp = [];
    for (j = 0; j < NUM_EDGES + 3; ++j) {
      temp.push(0);
    }
    matrix.push(temp);

  }

  var start = 0, count = 0;

  for (i = 0; i < NUM_EDGES; ++i) {
    if (i % 2) {
      matrix[start][i] = 1;
      matrix[start + 4][i] = -1;
      start += 2;
    }
    else {
      matrix[start][i] = cc;
      matrix[start + 2][i] = -cc;
      matrix[start + 1][i] = count % 2 ? -ss : ss;
      matrix[start + 3][i] = count % 2 ? ss : -ss;
      count += 1;
    }

  }
  matrix[1][NUM_EDGES] = 1;   // RAY
  matrix[0][NUM_EDGES + 1] = 1;   // RAX
  let point = joints % 2 ? joints : joints - 1;
  matrix[2 * point - 1][NUM_EDGES + 2] = 1;   // RGY

  Matrix = math.matrix(matrix);
  console.log("MATRIX MEN");
  console.log(Matrix);

  inverseMatrix = math.inv(Matrix);

  solutionMatrix = math.multiply(inverseMatrix, minusP);
  console.log("SOLUTION!")
  console.log(solutionMatrix);

  //NGAMBIL WARNA BOSQU

  var temp = "";
  for (i = 0; i < NUM_EDGES + 3; ++i) {
    var check = solutionMatrix.subset(math.index(i, 0));
    temp = check > 0 ? "Tension" : "Compression";
    forceType.push(temp);
    forceType[i] = check == 0 ? "Zero" : forceType[i];
  }

  // for (var key in forceType) {
  //   console.log("Member", key, forceType[key]);
  // }
  for(i  = 0 ; i < NUM_EDGES+3; ++i){
    console.log("Member "+(i+1)+": "+forceType[i]);
  }

  //LENGTH, ELONGATION
  var result = 0, force = 0;
  for(i  = 0 ; i < NUM_EDGES; ++i){
    if(i%2){
      edgeLength.push(2*length);
    }else{
      edgeLength.push(math.sqrt(length**2+height**2));
    }
    force = solutionMatrix.subset(math.index(i, 0));
    result = force*edgeLength[i]*1000/modYoung/area;
    elongMM.push(result);
  }

  for(i  = 0 ; i < NUM_EDGES+3; ++i){
    console.log("Length "+i+": "+edgeLength[i]);
    console.log("Elongation "+i+": "+elongMM[i]);
  }


}

//draw lines
function Line(startX, startY, endX, endY, raphael) {
  var start = {
    x: startX,
    y: startY
  }

  var end = {
    x: endX,
    y: endY
  }

  var getPath = function () {
    return "M" + start.x + " " + start.y + " L" + end.x + " " + end.y;
  }

  var redraw = function () {
    node.attr("path", getPath());
    node.attr("stroke-width", "10");
  }

  var node = raphael.path(getPath());

  return {
    updateStart: function (x, y) {
      start.x = x;
      start.y = y;
      redraw();
      return this;
    },
    updateEnd: function (x, y) {
      end.x = x;
      end.y = y;
      redraw();
      return this;
    }
  }
}

//jQuery
$(document).ready(function () {

  $("#anlBtn").click(function () {//onclick of analyze button
    analyze();
    //gambar bridge
    var bridgeWidth = $("#bridge").width();
    var lengthBar = bridgeWidth / (joints / 2 + 2);
    $("#bridge svg").remove();
    var paper = Raphael("bridge", $("#bridge").width(), lengthBar * 4);

    paper.clear();

    var jointz = paper.set();
    var tenz = paper.set();
    var compz = paper.set();



    //upper joints
    var xCoordUp, xCoordDown;
    for (var i = 0; i < Math.floor(joints / 2); i++) {
      xCoordUp = bridgeWidth / 2 - (Math.floor(joints / 4) * lengthBar);
      jointz.push(paper.circle(xCoordUp + (lengthBar * i), 50, 10));
    }

    //lower joints
    for (var i = 0; i < Math.ceil(joints / 2); i++) {
      var xCoordDown = bridgeWidth / 2 - (Math.floor(joints / 4) * lengthBar) - lengthBar / 2;
      jointz.push(paper.circle(xCoordDown + (lengthBar * i), 50 + lengthBar * Math.sqrt(2), 10));
    }

    //barz
    var barz = paper.set();
    for (var i = 0; i < Math.floor(joints / 2) - 1; i++) {
      barz.push(paper.rect((xCoordUp + 10) + (i * lengthBar), 45, lengthBar - 20, 10));
      var rotating = Math.atan(lengthBar*Math.sqrt(2)/lengthBar);
      console.log(rotating);
      rotating = rotating * (180 / Math.PI);
      console.log(rotating);
      var el = paper.rect((xCoordUp + 10) + (i * lengthBar), 45, lengthBar - 20, 10);
      barz.push(el.rotate(rotating,(xCoordUp) + (i * lengthBar), 50));
    }

    for (var i = 0; i < Math.ceil(joints / 2) - 1; i++) {
      barz.push(paper.rect((xCoordDown + 10) + (i * lengthBar), 45 + lengthBar * Math.sqrt(2), lengthBar - 20, 10));
    }
    barz.attr({ fill: "black" });


    //draw de bar

    line = Line(jointz[0].attr('cx'),jointz[0].attr('cy'),jointz[3].attr('cx'),jointz[3].attr('cy'),paper);
    line.redraw();
    line2 = Line(jointz[0].attr('cx'),jointz[0].attr('cy'),jointz[4].attr('cx'),jointz[4].attr('cy'),paper);
    line2.redraw();
    for(i = 0; i < jointz.length; i++) {
      if(i % 2 == 0) { //even
        
      } else { //odd
        
      }
    }



    jointz.attr({ fill: "black" });
  });

  $("#Hapus").click(function () { //Things to do when button is clicked
    var res = confirm("Reset input?"); //True if "OK"
    if (res) {
      $("#dimension").trigger("reset"); //reset form if pressed "OK"
    }
  });


});


