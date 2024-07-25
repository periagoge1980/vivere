$(document).ready(function() {
  // Initialize the small calendar
  let smallCalendarEl = document.getElementById('smallCalendar');
  let smallCalendar = new FullCalendar.Calendar(smallCalendarEl, {
    initialView: 'dayGridMonth',
    dateClick: function(info) {
      $('#commitDate').val(info.dateStr);
      highlightCommitDate(info.dateStr);
    }
  });

  smallCalendar.render();

  // Initialize the large calendar
  let largeCalendarEl = document.getElementById('largeCalendar');
  let largeCalendar = new FullCalendar.Calendar(largeCalendarEl, {
    initialView: 'dayGridMonth'
  });

  largeCalendar.render();

  // Set default date to today
  let today = new Date().toISOString().split('T')[0];
  $('#commitDate').val(today);
  highlightCommitDate(today);

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

  // Update calendars when date is changed
  $('#commitDate').on('change', function() {
    let selectedDate = $(this).val();
    highlightCommitDate(selectedDate);
  });
});
