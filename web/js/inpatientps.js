/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function inpatientps(date, isReset) {
  var chart = d3.parsets()
          .dimensions(["Clinic", "Subspecialty", "Reason Admitted"])
          .height(400)
          .width(680);

  var vis = d3.select("#psChart").append("svg")
          .attr("width", chart.width())
          .attr("height", chart.height())
          .attr("id", "inpatientChart");

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
    if (date !== 0) {
      inpatient = inpatient.filter(function (row) {
        return row['AdmissionDate'] <= dateFormat(date) && row['DischargeDate'] >= dateFormat(date);
      });
      removeChart();
    }

    if (isReset) {
      removeChart();
    }

    if (inpatient.length > 0) {
      vis.datum(inpatient).call(chart);
    }
  });
}

function removeChart() {
  document.getElementById("inpatientChart").remove();
}