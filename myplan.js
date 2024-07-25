$(document).ready(function() {
  $('#dateForm').on('submit', function(e) {
    e.preventDefault();
    var selectedDate = $('#startDate').val();
    if (selectedDate) {
      displayCalendar(selectedDate);
      startTimer();
    }
  });
});

function displayCalendar(date) {
  $('#calendar').fullCalendar('destroy'); // Destroy any existing calendar
  $('#calendar').fullCalendar({
    defaultDate: date,
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    events: [
      {
        title: 'Start of Addiction-Free Life',
        start: date,
        color: 'red',    // Highlight color
      }
    ]
  });
}

let timerInterval;

function startTimer() {
  clearInterval(timerInterval); // Clear any existing timer
  const startTime = new Date();
  timerInterval = setInterval(function() {
    const currentTime = new Date();
    const timeDiff = currentTime - startTime;
    const hours = Math.floor(timeDiff / 3600000);
    const minutes = Math.floor((timeDiff % 3600000) / 60000);
    const seconds = Math.floor((timeDiff % 60000) / 1000);
    $('#timeCounter').text(`Time since commit: ${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`);
  }, 1000);
}

function formatTime(unit) {
  return unit < 10 ? '0' + unit : unit;
}
