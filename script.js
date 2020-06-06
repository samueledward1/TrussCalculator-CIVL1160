var forceType = [];
var edgeLength = [];
let modYoung = 200; //GPa
var elongMM = [];
var load = {};
var inputForce = [];
var stress = [];

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
var height, length, area = 1000, joints, angle, degree;

function drawplz() {
  $("#bridge").html(""); //ngosongin #bridge
  //gambar bridge
  console.log(joints / 2);
  var bridgeWidth = $("#bridge").width();
  var lengthBar = (bridgeWidth) / (Math.floor(joints / 2) + 1);
  var heightBridge = height / length * lengthBar;
  $("#bridge svg").remove(); //remove paper
  console.log("height" + heightBridge + "length" + lengthBar);
  var paper = Raphael("bridge"); //create paper

  //auto resizze
  paper.setViewBox(0, 0, $("#bridge").width(), heightBridge * 1.7, true);
  var svg = document.querySelector("svg");
  svg.removeAttribute("width");
  svg.removeAttribute("height");

  $("#bridge svg").removeClass("col-12");
  $("#bridge svg").addClass("col-12");
  paper.clear();

  var jointz = paper.set();
  var tenz = paper.set();
  var compz = paper.set();

  // joints
  var xCoordUp, xCoordDown;
  for (var i = 0; i < joints; i++) {
    if (joints % 2) {
      xCoordUp = bridgeWidth / 2 - (joints / 4 - 0.75) * lengthBar;
      xCoordDown = xCoordUp - lengthBar / 2;
    }
    else {
      xCoordDown = bridgeWidth / 2 - (joints / 4 - 0.25) * lengthBar;
      xCoordUp = xCoordDown + lengthBar / 2
    }
    if (i % 2) {
      console.log("tingginya " + paper.height);
      jointz.push(paper.circle(xCoordUp + (lengthBar * Math.floor(i / 2)), heightBridge / 4, 10));
    }
    else {
      jointz.push(paper.circle(xCoordDown + (lengthBar * Math.ceil(i / 2)), heightBridge / 4 + heightBridge, 10));
    }
  }

  jointz.attr({ "fill": '#9d6b53', "stroke": "none" });


  //draw de bar
  var linez = paper.set();

  for (i = 0; i < jointz.length - 1; i++) {

    linez.push(paper.path("M" + getCoord(jointz, i).x + " " + getCoord(jointz, i).y + "L" + getCoord(jointz, i + 1).x + " " + getCoord(jointz, i + 1).y).attr({
      stroke: '#495057',
      "stroke-width": 5
    }));
    if (i < jointz.length - 2) {
      linez.push(paper.path("M" + getCoord(jointz, i).x + " " + getCoord(jointz, i).y + "L" + getCoord(jointz, i + 2).x + " " + getCoord(jointz, i + 2).y).attr({
        stroke: '#495057',
        "stroke-width": 5
      }));
    }

  }

  var textz = paper.set();
  var counter = 1;
  for (i = 0; i < jointz.length - 1; i++) {

    textz.push(paper.text((getCoord(jointz, i).x + getCoord(jointz, i + 1).x) / 2 - 20, (getCoord(jointz, i).y + getCoord(jointz, i + 1).y) / 2 - 5, counter));
    counter++;
    if (i < jointz.length - 2) {
      textz.push(paper.text((getCoord(jointz, i).x + getCoord(jointz, i + 2).x) / 2, (getCoord(jointz, i).y - 20 + getCoord(jointz, i + 2).y) / 2 - 5, counter));
      counter++;
    }
  }
  textz.attr({ "font-size": 14, "fill": "BLACK", "font-weight": "bold" });

  // change kolor+3
  for (i = 0; i < forceType.length - 3; i++) {

    if (forceType[i] == "Tension") {
      linez[i].attr({ stroke: "#33658a", "stroke-width": 5 });
    } else if (forceType[i] == "Compression") {
      linez[i].attr({ stroke: "#a53860", "stroke-width": 5 });
    }

  }
  //add baze

  var baze = paper.set();

  var baze1x = getCoord(jointz, 0).x;
  var baze1y = getCoord(jointz, 0).y + 10;

  baze.push(paper.path("M" + baze1x + " " + baze1y + "L" + (baze1x - 10) + " " + (baze1y + 20) + "L" + (baze1x + 10) + " " + (baze1y + 20) + "Z"));

  var pos = joints % 2 ? joints : joints - 1;
  var baze2x = getCoord(jointz, pos - 1).x;
  var baze2y = getCoord(jointz, pos - 1).y + 10;

  baze.push(paper.path("M" + baze2x + " " + baze2y + "L" + (baze2x - 10) + " " + (baze2y + 20) + "L" + (baze2x + 10) + " " + (baze2y + 20) + "Z"));

  baze.push(paper.circle(baze2x - 5, baze2y + 25, 5));
  baze.push(paper.circle(baze2x + 5, baze2y + 25, 5));

  baze.attr({ "fill": "#495057", "stroke": "none" });

  //add texts above jointz

  var arrowz = paper.set();
  for (i = 1; i < jointz.length; i++) {
    var end = joints % 2 ? joints : joints - 1;
    textz.push(paper.text(getCoord(jointz, i).x - 20, i % 2 ? getCoord(jointz, i).y - 20 : getCoord(jointz, i).y + 20, String.fromCharCode(65 + i))); //draw joint name
    if (i != end - 1) {
      textz.push(paper.text(getCoord(jointz, i).x + 40, i % 2 ? getCoord(jointz, i).y - 20 : getCoord(jointz, i).y + 20, inputForce[i] + " kN")); // draw force value
    }
    //draw joint arrows
    if (i % 2) {
      if (inputForce[i] == 0) {
        arrowz.push(paper.path("M" + getCoord(jointz, i).x + " " + (getCoord(jointz, i).y + 10) + "L" + getCoord(jointz, i).x + " " + (getCoord(jointz, i).y - 30 - Math.abs(inputForce[i] * 0.5))).attr({
          stroke: 'grey',
          "stroke-width": 3,
          "arrow-end": "classic-long-wide"
        }));
      }
      else if (inputForce[i] > 0) {
        arrowz.push(paper.path("M" + getCoord(jointz, i).x + " " + (getCoord(jointz, i).y + 10) + "L" + getCoord(jointz, i).x + " " + (getCoord(jointz, i).y - 30 - Math.abs(inputForce[i] * 0.5))).attr({
          stroke: '#000',
          "stroke-width": 3,
          "arrow-end": "classic-long-wide"
        }));
      }
      else {
        arrowz.push(paper.path("M" + getCoord(jointz, i).x + " " + (getCoord(jointz, i).y - 10) + "L" + getCoord(jointz, i).x + " " + (getCoord(jointz, i).y - 30 - Math.abs(inputForce[i] * 0.5))).attr({
          stroke: '#000',
          "stroke-width": 3,
          "arrow-start": "classic-long-wide"
        }));
      }
    }
    else {
      if (i == end - 1) {
        continue;
      }
      if (inputForce[i] == 0) {
        arrowz.push(paper.path("M" + getCoord(jointz, i).x + " " + (getCoord(jointz, i).y + 30 + Math.abs(inputForce[i] * 0.5)) + "L" + getCoord(jointz, i).x + " " + (getCoord(jointz, i).y + 10)).attr({
          stroke: 'grey',
          "stroke-width": 3,
          "arrow-start": "classic-long-wide"
        }));
      }
      else if (inputForce[i] < 0) {
        arrowz.push(paper.path("M" + getCoord(jointz, i).x + " " + (getCoord(jointz, i).y + 30 + Math.abs(inputForce[i] * 0.5)) + "L" + getCoord(jointz, i).x + " " + (getCoord(jointz, i).y + 10)).attr({
          stroke: '#000',
          "stroke-width": 3,
          "arrow-start": "classic-long-wide"
        }));
      }
      else {
        arrowz.push(paper.path("M" + getCoord(jointz, i).x + " " + (getCoord(jointz, i).y + 30 + Math.abs(inputForce[i] * 0.5)) + "L" + getCoord(jointz, i).x + " " + (getCoord(jointz, i).y + 10)).attr({
          stroke: '#000',
          "stroke-width": 3,
          "arrow-end": "classic-long-wide"
        }));
      }
    }
    arrowz.attr({});
  }
  textz.attr({ "font-size": 20 });

  //REDRAW JOINTZ
  for (var i = 0; i < joints; i++) {
    if (i % 2) {
      console.log("tingginya " + paper.height);
      jointz.push(paper.circle(xCoordUp + (lengthBar * Math.floor(i / 2)), heightBridge / 4, 10));
    }
    else {
      jointz.push(paper.circle(xCoordDown + (lengthBar * Math.ceil(i / 2)), heightBridge / 4 + heightBridge, 10));
    }
  }

  jointz.attr({ "fill": '#9d6b53', "stroke": "none" });
    
  var legendz = paper.set();
  legendz.push(paper.rect(160, heightBridge*1.5+5, 20,20).attr({"fill": "#a53860", "stroke": "none"}));
  legendz.push(paper.text(275, heightBridge*1.5+15, "Bars in compression").attr({"font-size":20}));
  legendz.push(paper.rect(450, heightBridge*1.5+5, 20,20).attr({"fill": "#33658a", "stroke": "none"}));
  legendz.push(paper.text(540, heightBridge*1.5+15, "Bars in tension").attr({"font-size":20}));
  legendz.push(paper.rect(690, heightBridge*1.5+5, 20,20).attr({"fill": "#495057", "stroke": "none"}));
  legendz.push(paper.text(750, heightBridge*1.5+15, "No force").attr({"font-size":20}));
}

function makeForce() {
  if ($("#jointNum").val() >= 3) {
    //create force inputs and dynamic elements
    $("#forces").html("");
    var counter = 0;
    for (i = 0; i < joints; i++) {
      var end = joints % 2 ? joints : joints - 1;
      if (i == 0 || i == end - 1) {
        continue;
      }
      $("#forces").append("<div class='form-group'><div class='input-group'><label for= 'force' class=' unit col-sm-12 col-md-3'>Force " + String.fromCharCode(65 + i) + "</label><input type='number' id='force" + counter + "'class='col-sm-12 col-md-7' step = 10 value = 0  /> <div class='col-sm-12 col-md-2 unit'>kN </div></div></div>");
      counter++;
    }
    $("#forces").append("<div class='col-12 btn-group'><input type='Reset' class='btn btn-danger mb-2 col-12' name='Hapus2' id='Hapus2' Value='Reset'></div>");//<button type='button' id='calcBtn' class='btn btn-success mb-2 col-6'>Analyze Forces</button>
  } else {
    $("#forces").html("<p>Number of Joints must exceed 2!</p>")
  }
}

function analyze() {
  forceType = [];
  edgeLength = [];
  elongMM = [];
  stress = [];
  // get form inputs
  height = $("#height").val();
  length = $("#length").val();
  area = $("#area").val();
  joints = $("#jointNum").val();
  degree = Math.atan(height / length);
  var text = "Angle of inclination = " + degree.toFixed(3) + " radian";
  //show output of angle
  $("#textangle").html(text);


  let cc = Math.cos(degree);
  let ss = Math.sin(degree);
  //console.log("cc:", cc);
  //console.log("ss: ", ss);

  let NUM_EDGES = 2 * joints - 3;
  //LOAD ON EACH JOINT
  load = {};
  let point = joints % 2 ? joints : joints - 1;
  for (i = 0; i < joints; ++i) {
    load[i] = new Force(0, inputForce[i]);
  }

  //MATRIX CREATION
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
  //console.log("PORCE");
  //console.log(porce);
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
    let point = joints % 2 ? joints : joints - 1;

  }
  matrix[1][NUM_EDGES] = 1;   // RAY
  matrix[0][NUM_EDGES + 1] = 1;   // RAX
  matrix[2 * point - 1][NUM_EDGES + 2] = 1;   // RGY

  Matrix = math.matrix(matrix);
  //console.log("MATRIX MEN");
  //console.log(Matrix);

  inverseMatrix = math.inv(Matrix);

  solutionMatrix = math.multiply(inverseMatrix, minusP);
  //console.log("SOLUTION!")
  //console.log(solutionMatrix);

  //NGAMBIL WARNA BOSQU

  var temp = "";
  for (i = 0; i < NUM_EDGES + 3; ++i) {
    var check = solutionMatrix.subset(math.index(i, 0));
    temp = check > 0 ? "Tension" : "Compression";
    forceType.push(temp);
    forceType[i] = Math.abs(check) < 0.001 ? "Zero" : forceType[i];
  }


  for (i = 0; i < NUM_EDGES + 3; ++i) {
    console.log("Member " + (i + 1) + ": " + forceType[i]);
  }

  //LENGTH, ELONGATION
  var result = 0, force = 0;
  for (i = 0; i < NUM_EDGES; ++i) {
    if (i % 2) {
      edgeLength.push(2 * length);
    } else {
      edgeLength.push(math.sqrt(length ** 2 + height ** 2));
    }
    force = solutionMatrix.subset(math.index(i, 0));
    result = force * edgeLength[i] * 1000 / modYoung / area;
    elongMM.push(result);
    stress.push(force / area / 1000);
  }

  for (i = 0; i < NUM_EDGES + 3; ++i) {
    console.log("Length " + i + ": " + edgeLength[i]);
    console.log("Elongation " + i + ": " + elongMM[i]);
  }
  //create hide/show btn

  $("#hideBtn").html("Toggle Solution Table");
  //draw solution table
  $("#solution").css("background-color", "#f1f1f1");
  $("#solTable thead").html("");
  $("#solTable tbody").html("");
  //table header
  $("#solTable thead").append("<th scope='col'>Member No.</th>");
  $("#solTable thead").append("<th scope='col'>Axial Force (kN)</th>");
  $("#solTable thead").append("<th scope='col'>Type</th>");
  $("#solTable thead").append("<th scope='col'>Stress (MPa)</th>");
  $("#solTable thead").append("<th scope='col'>Length (m)</th>");
  $("#solTable thead").append("<th scope='col'>Elongation (mm)</th>");

  //table body
  for (i = 0; i < NUM_EDGES; ++i) {
    $("#solTable tbody").append("<tr>");
    $("#solTable tbody").append("<th scope='row'>" + (i + 1) + "</th>");
    $("#solTable tbody").append("<td>" + solutionMatrix.subset(math.index(i, 0)).toFixed(3) + "</td>");
    $("#solTable tbody").append("<td>" + forceType[i] + "</td>");
    if (Math.abs(stress[i]) > 0.001) {
      $("#solTable tbody").append("<td>" + (stress[i].toFixed(3)) + "</td>");
    } else {
      $("#solTable tbody").append("<td>0.000</td>");
    }
    $("#solTable tbody").append("<td>" + (edgeLength[i].toFixed(3)) + "</td>");
    $("#solTable tbody").append("<td>" + (elongMM[i].toFixed(3)) + "</td>");
    $("#solTable tbody").append("</tr>");
  }
}

function getCoord(objectSet, index) {
  var obj = {
    x: objectSet[index].attr('cx'),
    y: objectSet[index].attr('cy')
  }
  return obj;
}

//jQuery
$(document).ready(function () {
  $("#anlBtn").click(function (e) {//onclick of analyze button
    e.preventDefault();
    if (($("#jointNum").val()) && $("#height").val() && $("#length").val()) { //check if empty
      joints = $("#jointNum").val();
      inputForce = [];
      for (i = 0; i < joints; ++i) {
        inputForce.push(0);
      }
      analyze();
      drawplz();
      makeForce();
      $("#solution").css("border-radius", "0");
      $("#hideBtn").css("padding", "10px");
    }
  });


  $("#forces").on("change", "input", function (e) {
    //ttp ke  atas. gw jg nemunya ini wkkwwk
    e.preventDefault();
    inputForce = [];
    var counter = 0;
    var end = joints % 2 ? joints : joints - 1;
    for (var i = 0; i < joints; ++i) {
      if (i == 0 || i == end - 1) {
        inputForce.push(0);
      }
      else {
        inputForce.push($("#force" + counter).val());
        counter++;
      }
    }

    console.log("test");
    analyze();
    drawplz();
  });

  $("#forces").on("click", "#Hapus2", function () {
    var tes = confirm("Reset input?"); //True if "OK"
    if (tes) {
      $("#forces").trigger("reset"); //reset form if pressed "OK"
      inputForce = [];
      var counter = 0;
      var end = joints % 2 ? joints : joints - 1;
      for (var i = 0; i < joints; ++i) {
        if (i == 0 || i == end - 1) {
          inputForce.push(0);
        }
        else {
          inputForce.push($("#force" + counter).val());
          counter++;
        }
      }
      analyze();
      drawplz();
    }
  });

  $("#Hapus").click(function () { //Things to do when button is clicked
    var res = confirm("Reset input?"); //True if "OK"
    if (res) {
      $("#dimension").trigger("reset"); //reset form if pressed "OK"
      inputForce = [];
      var counter = 0;
      var end = joints % 2 ? joints : joints - 1;
      for (var i = 0; i < joints; ++i) {
        if (i == 0 || i == end - 1) {
          inputForce.push(0);
        }
        else {
          inputForce.push($("#force" + counter).val());
          counter++;
        }
      }
      $("#solTable thead").html("");
      $("#solTable tbody").html("");
      $("#forces").html("Enter # of Joints to start inputting forces");
      $("#bridge").html("Fill all the properties to start!");
      $("#solution").css("border-radius", "0 0 20px 20px");
      $("#solution").show();
      $("#solution").css("background-color","#A89C94FF");
      $("#hideBtn").css("padding", "0px");
      $("#hideBtn").html("");
      $("#textangle").html("");
    }
  });

  $("#forceVis").on("click", "#hideBtn", function () {
    $("#hideBtn").html("");
    $("#hideBtn").html("Toggle Solution Table");
    $("#solution").slideToggle();
  });



  $("#jointNum").change(function () {
    if ($("#jointNum").val() < 3) {
      $("#jointNum").val(3);
    }
    if ($("#jointNum").val() > 26) {
      $("#jointNum").val(26);
    }
  });

  $("#length").change(function () {
    if ($("#length").val() < 0.01) {
      $("#length").val(0.01);
    }
  });

  $("#height").change(function () {
    if ($("#height").val() < 0.01) {
      $("#height").val(0.01);
    }
  });

});


