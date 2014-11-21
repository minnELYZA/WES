/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var duty = d3.select("#duty").append(svg)
        .attr("id", "staff")
        .append(g);

function inpatientps(date) {
  d3.csv("./data/staff-schedule.csv", function (staff) {
    var dateFormat = d3.time.format("%d/%m/%Y").parse;
    inpatient.forEach(function (d) {
      d.Date = dateFormat(d.Date);
      d.NumNurses = +d.NumNurses;
    });
    if (date !== 0) {
      inpatient = inpatient.filter(function (row) {
        return row['Date'] === dateFormat(date);
      });
      document.getElementById("staff").remove();
    }
    
  });
}