/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var fil;
function inpatientps(date) {
  var chart = d3.parsets()
          .dimensions(["Clinic", "Subspecialty", "ReasonAdmitted"])
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
      document.getElementById("inpatientChart").remove();
//      var toDelete = document.getElementsByClassName("parsets tooltip");
//      while (toDelete.length > 0) {
//        toDelete[0].parentNode.removeChild(toDelete[0]);
//      }
    }
    //fil = inpatient;

    if(inpatient.length > 0) {
      vis.datum(inpatient).call(chart);
    }
  });
}