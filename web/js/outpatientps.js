/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var toggle = true;
var alrHidden = false,aaa;
function outpatientps(date, isReset) {
  var chart = d3.parsets()
          .dimensions(["Attendance", "Source of Referral", "Patient Class", "First Visit"])
          .height(400)
          .width(680);

  var vis = d3.select("#psChart").append("svg")
          .attr("width", chart.width())
          .attr("height", chart.height())
          .attr("id", "inpatientChart");

  d3.csv("./data/workload-soc.csv", function (soc) {
    var dateFormat = d3.time.format("%d/%m/%Y").parse;
    soc.forEach(function (d) {
    d.Number = +d.Number;
    d.CaseNo = +d.CaseNo;
    d.DateOfBirth = dateFormat(d.DateOfBirth);
    d.Height = +d.Height;
    d.Weight = +d.Weight;
    d.ContactNo = +d.ContactNo;
    d.AdmissionDate = dateFormat(d.AdmissionDate);
    d.LeadTimeSurgery = +d.LeadTimeSurgery;
    });
    console.log("top");
    console.log(date);
    console.log(isReset);
    console.log(toggle);
    console.log(alrHidden);
    if (date !== 0) {
      // trigger filter!
      soc = soc.filter(function (row) {
        return row['AdmissionDate'] <= dateFormat(date) && row['AdmissionDate'] >= dateFormat(date);
      });
      var noShow = soc.filter(function (row) {
        return row['Attendance'] === "No Show";
      });
      removeChart();
      var tbdy = document.getElementById("noShowTable").children[0];
      if (tbdy.childElementCount > 1) {
        // remove rows after first child
        for (var i = 0; i < tbdy.childElementCount; i++) {
          if (tbdy.children[i] !== tbdy.firstChild) {
            tbdy.children[i].remove();
          }
        }
      }
      for (n in noShow) {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.appendChild(document.createTextNode(noShow[n].Name));
        var td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(noShow[n].IC));
        var td3 = document.createElement("td");
        td3.appendChild(document.createTextNode(noShow[n].ContactNo));
        var td4 = document.createElement("td");
        td4.appendChild(document.createTextNode(noShow[n].Surgeon));
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tbdy.appendChild(tr);
      }
      if (toggle && (noShow.length > 0 && !isReset)) { // need to trigger toggle to show
        console.log("launch");
        fnToggle();
        console.log(document.getElementById("noShow").classList);
        toggle = false;
        alrHidden = false;
      }
    }

    if (isReset) {
      removeChart();
      if (!toggle && !alrHidden) { // trigger toggle to hide due to reset
        console.log("reset so need hide");
        //fnToggle();
        console.log(document.getElementById("noShow").classList);
        toggle = true;
        alrHidden = true;
      }
    }

    if (soc.length > 0) { // can either be reset or filter
      vis.datum(soc).call(chart);
      if (!isReset && noShow === 0) { // check for non-filter but no output to trigger hide
        console.log("no noshow so need hide");
        fnToggle();
        console.log(document.getElementById("noShow").classList);
        toggle = true;
        alrHidden = true;
      }
    } else { // no output cause no appointments == hide!
        console.log("check1");
        console.log(isReset);
        console.log(toggle);
        console.log(alrHidden);
        if (!alrHidden && !toggle) { // toggle here to hide! in case not detected earlier...
          console.log("failsafe? or hindrance?");
          fnToggle();
        console.log(document.getElementById("noShow").classList);
          toggle = true;
          alrHidden = true;
        }
      }
    console.log("end");
    console.log(date);
    console.log(isReset);
    console.log(toggle);
    console.log(alrHidden);
  });
}

function removeChart() {
  document.getElementById("inpatientChart").remove();
}

function fnToggle() {
  document.getElementById("noShow").classList.toggle("hidden");
}