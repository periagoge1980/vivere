$(document).ready(function() {
  $('#dateForm').on('submit', function(e) {
    e.preventDefault();
    var selectedDate = $('#startDate').val();
    if (selectedDate) {
      displayCalendar(selectedDate);
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
