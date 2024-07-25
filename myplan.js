$(document).ready(function() {
  // Initialize the small calendar
  let smallCalendarEl = document.getElementById('smallCalendar');
  let smallCalendar = new FullCalendar.Calendar(smallCalendarEl, {
    initialView: 'dayGridMonth',
    dateClick: function(info) {
      $('#commitDate').val(info.dateStr);
    }
  });

  smallCalendar.render();

  // Initialize the large calendar
  let largeCalendarEl = document.getElementById('largeCalendar');
  let largeCalendar = new FullCalendar.Calendar(largeCalendarEl, {
    initialView: 'dayGridMonth'
  });

  // Set default date to today
  let today = new Date().toISOString().split('T')[0];
  $('#commitDate').val(today);

  // Handle the commit button click
  $('#commitButton').on('click', function() {
    let selectedDate = $('#commitDate').val();
    highlightCommitDate(selectedDate);
    $('#largeCalendar').show(); // Show the large calendar
    largeCalendar.render();
  });

  // Highlight the selected date on both calendars
  function highlightCommitDate(date) {
    smallCalendar.removeAllEvents();
    largeCalendar.removeAllEvents();

    let event = {
      title: 'Commitment Start',
      start: date,
      display: 'background',
      backgroundColor: '#00FF00',
      borderColor: '#00FF00'
    };

    smallCalendar.addEvent(event);
    largeCalendar.addEvent(event);
  }
});
