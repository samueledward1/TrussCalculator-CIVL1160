
function analyze() {
  console.log("KUDA");
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

  //for (i = 0; i < NUM_EDGES + 3; ++i) {
    //console.log("Length " + i + ": " + edgeLength[i]);
    //console.log("Elongation " + i + ": " + elongMM[i]);}

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
