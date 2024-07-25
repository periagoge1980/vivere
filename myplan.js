$(document).ready(function() {
  // Initialize the calendar
  let calendarEl = document.getElementById('calendar');
  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    dateClick: function(info) {
      $('#commitDate').val(info.dateStr);
      highlightCommitDate(info.dateStr);
    }
  });

  calendar.render();

  // Set default date to today
  let today = new Date().toISOString().split('T')[0];
  $('#commitDate').val(today);
  highlightCommitDate(today);

  // Highlight the selected date
  function highlightCommitDate(date) {
    calendar.removeAllEvents();
    calendar.addEvent({
      title: 'Commitment Start',
      start: date,
      display: 'background',
      backgroundColor: '#00FF00',
      borderColor: '#00FF00'
    });
  }

  // Update calendar when date is changed
  $('#commitDate').on('change', function() {
    let selectedDate = $(this).val();
    highlightCommitDate(selectedDate);
  });
});
