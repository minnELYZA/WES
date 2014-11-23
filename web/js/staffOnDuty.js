/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var toggle = true;
var alrHidden = false;
function staffDuty(date, numPatients, doToggle) {
  d3.csv("./data/staff-schedule.csv", function (staff) {
    var dateFormat = d3.time.format("%d/%m/%Y").parse;
    staff.forEach(function (d) {
      d.Date = dateFormat(d.Date);
      d.NumNurses = +d.NumNurses;
    });
    console.log(date);
    console.log(numPatients);
    console.log(doToggle);
    console.log(toggle);
    if (date !== 0 && numPatients > 0) {
      alrHidden = false;
      staff = staff.filter(function (row) {
        return row['Date'] <= dateFormat(date) && row['Date'] >= dateFormat(date);
      });
      for (r in staff) {
        if (document.getElementById("dr").innerHTML === "") {
          document.getElementById("dr").innerHTML = staff[r].Doctor1 + "<br>" + staff[r].Doctor2 + "<br>" + staff[r].Doctor3;
        } else {
          document.getElementById("dr").innerHTML = staff[r].Doctor1 + "<br>" + staff[r].Doctor2 + "<br>" + staff[r].Doctor3;
        }
        if (document.getElementById("nurses").innerHTML === "") {
          document.getElementById("nurses").innerHTML = staff[r].NumNurses;
        } else {
          document.getElementById("nurses").innerHTML = staff[r].NumNurses;
        }
        if (document.getElementById("patients").innerHTML === "") {
          document.getElementById("patients").innerHTML = numPatients;
        } else {
          document.getElementById("patients").innerHTML = numPatients;
        }
      }
    } else if (numPatients <= 0) {
      console.log("hide");
    }

    if (toggle && !doToggle) {
      if (!alrHidden) {
      fnToggle();
      toggle = false;
    }
    } else if (!toggle && doToggle) {
      toggle = true;
    } else if (!toggle && !doToggle && numPatients <= 0) {
      if (!alrHidden) {
        fnToggle();
      }
      alrHidden = true;
    }
  });
}

function fnToggle() {
  document.getElementById("duty").classList.toggle("hidden");
}