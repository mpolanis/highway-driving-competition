import RobotWindow from 'https://cyberbotics.com/wwi/R2023b/RobotWindow.js';

const benchmarkName = 'Highway Driving';
let timeValue = 0;
let distanceValue = 0;
window.robotWindow = new RobotWindow();

const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick); 

window.updateSensorsVisualization = function() {
  window.robotWindow.send('sensors visualization:' + document.getElementById('sensors_visualization_checkbox').checked);
}

window.robotWindow.receive = function(message, robot) {
  if (this.robot === undefined) {
    this.robot = robot;
    updateSensorsVisualization();
  }

  // updates the metric
  if (message.startsWith('update:')) {
    const values = message.substr(7).trim().split(' ');
    timeValue = parseFloat(values[0]);
    distanceValue = parseFloat(values[1]);
    document.getElementById('time-display').innerHTML = parseSecondsIntoReadableTime(timeValue);
    document.getElementById('distance-display').innerHTML = distanceValue.toFixed(3) + 'm';
  } else if (message === 'stop') {
    document.getElementById('time-display').style.color = 'bold';
    document.getElementById('distance-display').style.color = 'bold';
    document.getElementById('distance-display').style.color = 'green';
    document.querySelector(".text").innerHTML = `
      <h2>${benchmarkName} complete</h2>
      <h3>Congratulations you finished the benchmark!</h3>
      <p>Your current performance is: <b style="color:green;">${distanceValue}</b></p>
      <p>If you want to submit your controller to the leaderboard, follow the instructions given by the "Register" button on the benchmark page.</p>
    `
    toggleModal();
  } else
    console.log("Received unknown message for robot '" + robot + "': '" + message + "'");

  function metricToString(s) {
    return parseFloat(s).toFixed(3) + ' m';
  }

  function parseSecondsIntoReadableTime(timeInSeconds) {
    const minutes = timeInSeconds / 60;
    const absoluteMinutes = Math.floor(minutes);
    const m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;
    const seconds = (minutes - absoluteMinutes) * 60;
    const absoluteSeconds = Math.floor(seconds);
    const s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
    let cs = Math.floor((seconds - absoluteSeconds) * 100);
    if (cs < 10)
      cs = '0' + cs;
    return m + ':' + s + ':' + cs;
  }
};
