/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var startYear = 2013,
    endYear = 2015,
    months = {"Jan": 2, "Feb": 6.5, "Mar": 10.5, "Apr": 15, "May": 19.3, "Jun": 23.5, "Jul": 28, "Aug": 32.2, "Sep": 36.7, "Oct": 41, "Nov": 45.2, "Dec": 49.5},
    days = {0.8: "M", 1.8: "T", 2.8: "W", 3.8: "T", 4.8: "F", 5.8: "S", 6.8: "S"},
    maxBeds = 50, // default
    test, inp;

var margin = {top: 15.5, right: 0, bottom: 5.5, left: 19.5},
    width = 960 - margin.left - margin.right,
        height = 140 - margin.top - margin.bottom,
        size = height / 7;

var day = function (d) { return (d.getDay() + 6) % 7; }, // monday = 0
        week = d3.time.format("%W"), // monday-based week number
        date = d3.time.format("%d/%m/%Y");
//percent = d3.format("+.1%");

var color = d3.scale.quantize()
        .domain([0, maxBeds])
        .range(d3.range(9));

var selectObj = document.getElementById("calYear");
var options = d3.range(startYear, endYear);
for (var i = 0; i < options.length; i++) {
  var opt = document.createElement('option');
  opt.value = options[i];
  opt.innerHTML = options[i];
  selectObj.appendChild(opt);
}

var svg = d3.select("#heatMap").selectAll("svg")
        .data(options)
        .enter().append("svg")
        .attr("id", function (d) { return d; })
        .attr("class", "YlOrBr")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/*svg.append("text")
 .attr("transform", "translate(-6," + size * 3.5 + ")rotate(-90)")
 .attr("text-anchor", "middle")
 .text(function(d) { return d; });*/

svg.selectAll(".days")
        .data(d3.entries(days))
        .enter().append("text")
        .attr("x", -12)
        .attr("y", function (d) { return d.key * size; })
//    .attr("transform", function (d) { "translate(-12," + size * d.key + ")"; })
        .attr("class", "days")
        .style("text-anchor", "middle")
        .text(function (d) { return d.value; });

svg.selectAll(".months")
        .data(d3.entries(months))
        .enter().append("text")
        .attr("x", function (d) { return d.value * size; })
        .attr("y", -9)
//    .attr("transform", "translate(" + size * 2 +", -9)")
        .style("text-anchor", "center")
        .text(function (d) { return d.key; });

var rect = svg.selectAll(".day")
        .data(function (d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", size)
        .attr("height", size)
        .attr("x", function (d) { return week(d) * size; })
        .attr("y", function (d) { return day(d) * size; })
        .map(date);

rect.append("title")
        .text(function (d) { return d; });

svg.selectAll(".month")
        .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);

d3.csv("./data/workload-inpatient.csv", function (inpatient) {
  var dateFormat = d3.time.format("%d/%m/%Y").parse;
  inpatient.forEach(function (d) {
    d.Number = +d.Number;
    d.CaseNo = +d.CaseNo;
    d.DateOfBirth = dateFormat(d.DateOfBirth);
    d.Height = +d.Height;
    d.Weight = +d.Weight;
    d.AdmissionDate = dateFormat(d.AdmissionDate);
    d.LengthOfStay = +d.LengthOfStay;
    d.DischargeDate = dateFormat(d.DischargeDate);
  });

  //compute counter to display bed occupancy
  var counter = [];
  for (i in inpatient) {
    if (inpatient[i].LengthOfStay > 1) {
      for (var j = 0; j < inpatient[i].LengthOfStay; j++) {
        var tempDate = new Date(inpatient[i].AdmissionDate.getTime());
        counter.push(new Date(tempDate.setDate(tempDate.getDate() + j)));
      }
    } else {
      counter.push(inpatient[i].AdmissionDate);
    }
  }

  var data = d3.nest()
          .key(function (d) { return date(d); })
          .rollup(function (leaves) { return leaves.length; })
          .map(counter);

  //maxBeds = Math.max.apply(Math,Object.keys(data).map(function(key) { return data[key]; }));
  rect.filter(function (d) { return d in data; })
          .attr("class", function (d) { return "day q" + color(data[d]) + "-9"; })
          .select("title")
          .text(function (d) { return d + ":\n" + data[d] + " patients"; });

  var rects = d3.selectAll("rect")
          .on("click", function (d) {
            inpatientps(d, false); // filter parset
            document.getElementById("day").innerHTML = d;
            var numPatients = this.childNodes[0].innerHTML;
            numPatients = numPatients.substring(numPatients.lastIndexOf(':') + 1).trim();
            numPatients = numPatients.substring(0, numPatients.lastIndexOf(' ')).trim();
            staffDuty(d, numPatients, false); // trigger duty list
          })
          .on("mouseover", function () {
            this.style.cursor = "pointer";
          });

  inpatientps(0);
});

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
          d0 = +day(t0), w0 = +week(t0),
          d1 = +day(t1), w1 = +week(t1);
  return "M" + (w0 + 1) * size + "," + d0 * size
          + "H" + w0 * size + "V" + 7 * size
          + "H" + w1 * size + "V" + (d1 + 1) * size
          + "H" + (w1 + 1) * size + "V" + 0
          + "H" + (w0 + 1) * size + "Z";
}
