$(document).ready(function() {
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

  function displayCalendar(date) {
    $('#calendar').fullCalendar('destroy'); // Destroy any existing calendar
    $('#calendar').fullCalendar({
      defaultDate: date,
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      dayClick: function(date) {
        const selectedDate = date.format('YYYY-MM-DD');
        const existingNote = localStorage.getItem(selectedDate);
        $('#note-popup-overlay').show();
        $('#note-popup').show();
        $('#positive').off().on('click', function() {
          saveNoteAndStyleDay(selectedDate, 'positive', 'green');
        });
        $('#triggered').off().on('click', function() {
          saveNoteAndStyleDay(selectedDate, 'triggered', 'red');
        });
        $('#relapsed').off().on('click', function() {
          resetTimer();
          saveNoteAndStyleDay(selectedDate, 'relapsed', 'orange');
        });
        if (existingNote) {
          $('#remove-note').show().off().on('click', function() {
            removeNoteAndStyleDay(selectedDate);
          });
        } else {
          $('#remove-note').hide();
        },
            events: getStoredEvents()
    });
  }

  function saveNoteAndStyleDay(date, note, color) {
    localStorage.setItem(date, note);
    $('#calendar').fullCalendar('renderEvent', {
      title: note.charAt(0).toUpperCase() + note.slice(1),
      start: date,
      color: color
    }, true);
    closePopup(); // Close the popup
  }

  function removeNoteAndStyleDay(date) {
    localStorage.removeItem(date);
    $('#calendar').fullCalendar('removeEvents', function(event) {
      return event.start.format('YYYY-MM-DD') === date;
    });
    closePopup(); // Close the popup
  }

  function closePopup() {
    $('#note-popup').hide();
    $('#note-popup-overlay').hide();
  }

  $('#note-popup-overlay').on('click', closePopup);

  function getStoredEvents() {
    let events = [];
    for (let i = 0; i < localStorage.length; i++) {
      let date = localStorage.key(i);
      let note = localStorage.getItem(date);
      if (date && note && date !== 'commitTime') {
        let color = note === 'positive' ? 'green' : note === 'triggered' ? 'red' : 'orange';
        events.push({
          title: note.charAt(0).toUpperCase() + note.slice(1),
          start: date,
          color: color
        });
      }
    }
    return events;
  }

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
    const newCommitTime = new Date();
    localStorage.setItem('commitTime', newCommitTime.toISOString());
    startTimer(newCommitTime);
  }

  function formatTime(unit) {
    return unit < 10 ? '0' + unit : unit;
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

  // Initialize the calendar with stored events
  const storedCommitTime = localStorage.getItem('commitTime');
  if (storedCommitTime) {
    const commitTime = new Date(storedCommitTime);
    $('#startDate').val(moment(commitTime).format('YYYY-MM-DD'));
    displayCalendar(moment(commitTime).format('YYYY-MM-DD'));
    startTimer(commitTime);
  } else {
    displayCalendar(new Date());
  }
});
