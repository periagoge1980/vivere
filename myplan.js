$(document).ready(function() {
  const storedNotes = JSON.parse(localStorage.getItem('notes')) || {};
  const storedCommitTime = localStorage.getItem('commitTime');

  $('#dateForm').on('submit', function(e) {
    e.preventDefault();
    var selectedDate = $('#startDate').val();
    if (selectedDate) {
      const commitTime = new Date(); // Capture the exact time of commit
      const selectedDateArray = selectedDate.split('-');
      commitTime.setFullYear(
        selectedDateArray[0],
        selectedDateArray[1] - 1,
        selectedDateArray[2]
      );
      localStorage.setItem('commitTime', commitTime.toISOString());
      displayCalendar(selectedDate);
      startTimer(commitTime);
    }
  });

  if (storedCommitTime) {
    const commitTime = new Date(storedCommitTime);
    $('#startDate').val(moment(commitTime).format('YYYY-MM-DD'));
    displayCalendar(moment(commitTime).format('YYYY-MM-DD'));
    startTimer(commitTime);
  }

  function displayCalendar(date) {
    $('#calendar').fullCalendar('destroy'); // Destroy any existing calendar
    $('#calendar').fullCalendar({
      defaultDate: date,
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      dayClick: function(date) {
        const selectedDate = date.format();
        $('#popup').data('date', selectedDate).show();
        if (storedNotes[selectedDate]) {
          $('#removeNoteButton').show();
        } else {
          $('#removeNoteButton').hide();
        }
      },
      events: Object.keys(storedNotes).map(date => ({
        title: storedNotes[date],
        start: date,
        color: storedNotes[date] === 'Positive' ? 'green' : (storedNotes[date] === 'Triggered' ? 'red' : 'orange')
      }))
    });
  }

  $('#positiveButton').click(() => saveNoteToCalendar('Positive'));
  $('#triggeredButton').click(() => saveNoteToCalendar('Triggered'));
  $('#relapsedButton').click(() => {
    saveNoteToCalendar('Relapsed');
    resetTimer();
  });
  $('#removeNoteButton').click(() => removeNoteFromCalendar());

  function saveNoteToCalendar(note) {
    const selectedDate = $('#popup').data('date');
    storedNotes[selectedDate] = note;
    localStorage.setItem('notes', JSON.stringify(storedNotes));
    $('#popup').hide();
    displayCalendar($('#startDate').val());
  }

  function removeNoteFromCalendar() {
    const selectedDate = $('#popup').data('date');
    delete storedNotes[selectedDate];
    localStorage.setItem('notes', JSON.stringify(storedNotes));
    $('#popup').hide();
    displayCalendar($('#startDate').val());
  }

  $('#popup button').click(() => {
    $('#popup').hide();
  });

  let timerInterval;

  function startTimer(commitTime) {
    clearInterval(timerInterval); // Clear any existing timer

    timerInterval = setInterval(function() {
      const currentTime = new Date();
      const timeDiff = currentTime - new Date(commitTime);
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      $('#timeCounter').text(`Time since commit: ${days}d ${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`);
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    localStorage.removeItem('commitTime');
    $('#timeCounter').text('Time since commit: 00:00:00');
  }

  const loginButton = document.getElementById('login');
  loginButton.addEventListener('click', () => {
    netlifyIdentity.open();
  });

  netlifyIdentity.on('login', user => {
    console.log('User logged in:', user);
    netlifyIdentity.close();
  });

  netlifyIdentity.on('logout', () => {
    console.log('User logged out');
    window.location.href = 'index.html';
  });
});

function formatTime(unit) {
  return unit < 10 ? '0' + unit : unit;
}
