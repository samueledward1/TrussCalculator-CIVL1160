var forceType = [];
var edgeLength = [];
let modYoung = 200; //GPa
var elongMM = [];
var load = {};
var inputForce = [];
var stress = [];
//analyze function
var height, length, area = 1000, joints, angle, degree;


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


//jQuery
$(document).ready(function () {
  $("#anlBtn").click(function (e) {//onclick of analyze button
    e.preventDefault();
    if (($("#jointNum").val()) && $("#height").val() && $("#length").val()) { //check if empty
      joints = $("#jointNum").val();
      inputForce = [];
      for (var i = 0; i < joints; ++i) {
        inputForce.push(0);
      }
      analyze();
      draw();
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
    draw();
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
      draw();
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
      $("#jointNum").css("background-color", "#a53860");
      $("#jointNum").css("color", "#f1f1f1").delay(700).queue(function(next){
        $(this).css("background-color", "#E7E6DC").css("color", "grey");
        next();
      });
    }
    if ($("#jointNum").val() > 26) {
      $("#jointNum").val(26);
      $("#jointNum").css("background-color", "#a53860");
      $("#jointNum").css("color", "#f1f1f1").delay(700).queue(function(next){
        $(this).css("background-color", "#E7E6DC").css("color", "grey");
        next();
      });
    }
  });

  $("#length").change(function () {
    if ($("#length").val() < 0.01) {
      $("#length").val(0.01);
      $("#length").css("background-color", "#a53860");
      $("#length").css("color", "#f1f1f1").delay(700).queue(function(next){
        $(this).css("background-color", "#E7E6DC").css("color", "grey");
        next();
      });
    }
  });

  $("#height").change(function () {
    if ($("#height").val() < 0.01) {
      $("#height").val(0.01);
      $("#height").css("background-color", "#a53860");
      $("#height").css("color", "#f1f1f1").delay(700).queue(function(next){
        $(this).css("background-color", "#E7E6DC").css("color", "grey");
        next();
      });
    }
  });

  $(window).resize(function(e){
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

    analyze();
    draw();
  });

});


