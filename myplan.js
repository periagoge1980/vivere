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
      commitTime.setHours(0, 0, 0, 0);
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
        }
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
      if (date && note) {
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
      const timeDiff = currentTime - commitTime;
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff %
