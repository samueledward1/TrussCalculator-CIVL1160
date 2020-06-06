function getCoord(objectSet, index) {
  var obj = {
    x: objectSet[index].attr('cx'),
    y: objectSet[index].attr('cy')
  }
  return obj;
}

function draw() {
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