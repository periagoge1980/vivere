$(document).ready(function() {
  const storedNotes = JSON.parse(localStorage.getItem('notes')) || {};
  const storedCommitTime = localStorage.getItem('commitTime');

  // Event delegation for form submit
  $(document).on('submit', '#dateForm', function(e) {
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
  } else {
    displayCalendar(new Date());
  }

  function displayCalendar(date) {
    $('#calendar').fullCalendar('destroy'); // Destroy any existing calendar
    $('#calendar').fullCalendar({
      defaultDate: date,
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      dayClick: function(date) {
        const selectedDate = date.format('YYYY-MM-DD');
        $('#note-popup').data('date', selectedDate).show();
        displayNotes(selectedDate);
      },
      events: getStoredEvents()
    });
  }

  function getStoredEvents() {
    let events = [];
    for (let date in storedNotes) {
      storedNotes[date].forEach(note => {
        events.push({
          title: note.title,
          start: date,
          color: note.color
        });
      });
    }
    return events;
  }

  function displayNotes(date) {
    const notesContainer = $('#notes-container');
    notesContainer.empty(); // Clear any previous notes
    if (storedNotes[date]) {
      storedNotes[date].forEach(note => {
        const noteBlock = `<div class="note-block" style="background-color: ${note.color};">${note.note}</div>`;
        notesContainer.append(noteBlock);
      });
      $('#remove-note').show();
    } else {
      notesContainer.append('<div class="note-block">No notes for this day.</div>');
      $('#remove-note').hide();
    }
  }

  // Event delegation for button clicks
  $(document).on('click', '#positive', () => saveNoteToCalendar('Positive', 'green'));
  $(document).on('click', '#triggered', () => saveNoteToCalendar('Triggered', 'red'));
  $(document).on('click', '#relapsed', () => {
    saveNoteToCalendar('Relapsed', 'orange');
    resetTimer();
  });
  $(document).on('click', '#add-note', () => {
    $('#note-popup').hide();
    $('#note-input-popup').show();
  });
  $(document).on('click', '#remove-note', () => removeNoteFromCalendar());
  $(document).on('click', '#view-day', () => viewDayJournal());

  $('#save-note').click(() => {
    const selectedDate = $('#note-popup').data('date');
    const customNote = $('#custom-note').val();
    if (customNote) {
      addNoteToDate(selectedDate, {
        title: customNote,
        color: 'blue',
        note: customNote
      });
      $('#custom-note').val(''); // Clear the input
      $('#note-input-popup').hide();
      displayCalendar($('#startDate').val());
    }
  });

  $('#cancel-note').click(() => {
    $('#note-input-popup').hide();
  });

  function saveNoteToCalendar(note, color) {
    const selectedDate = $('#note-popup').data('date');
    addNoteToDate(selectedDate, {
      title: note,
      color: color,
      note: note
    });
    $('#note-popup').hide();
    displayCalendar($('#startDate').val());
  }

  function addNoteToDate(date, note) {
    if (!storedNotes[date]) {
      storedNotes[date] = [];
    }
    storedNotes[date].push(note);
    localStorage.setItem('notes', JSON.stringify(storedNotes));
  }

  function removeNoteFromCalendar() {
    const selectedDate = $('#note-popup').data('date');
    delete storedNotes[selectedDate];
    localStorage.setItem('notes', JSON.stringify(storedNotes));
    $('#note-popup').hide();
    displayCalendar($('#startDate').val());
  }

  function viewDayJournal() {
    const selectedDate = $('#note-popup').data('date');
    const journalEntries = storedNotes[selectedDate]
      ? storedNotes[selectedDate].map(note => `<div class="note-block">${note.note}</div>`).join('')
      : '<div class="note-block">No notes for this day.</div>';
    $('#day-journal').html(journalEntries);
    $('#note-popup').hide();
    $('#journal-popup').show();
  }

  $('#journal-popup button').click(() => {
    $('#journal-popup').hide();
  });

  $('#popup-overlay, #note-popup-overlay').on('click', () => {
    $('#note-popup').hide();
    $('#journal-popup').hide();
    $('#note-input-popup').hide();
  });

  let timerInterval;

function startTimer(commitTime) {
  clearInterval(timerInterval); // Clear any existing timer

  let elapsed = Date.now() - new Date(commitTime).getTime();
  let elapsedDays = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  let elapsedHours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let elapsedMinutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
  let elapsedSeconds = Math.floor((elapsed % (1000 * 60)) / 1000);

  timerInterval = setInterval(function() {
    elapsedSeconds++;
    if (elapsedSeconds >= 60) {
      elapsedMinutes++;
      elapsedSeconds = 0;
    }
    if (elapsedMinutes >= 60) {
      elapsedHours++;
      elapsedMinutes = 0;
    }
    if (elapsedHours >= 24) {
      elapsedDays++;
      elapsedHours = 0;
    }
    $('#timeCounter').text(`Time since commit: ${elapsedDays}d ${formatTime(elapsedHours)}:${formatTime(elapsedMinutes)}:${formatTime(elapsedSeconds)}`);
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
  const commitTime = localStorage.getItem('commitTime');
  if (commitTime) {
    displayCalendar(moment(commitTime).format('YYYY-MM-DD'));
    startTimer(new Date(commitTime));
  } else {
    displayCalendar(new Date());
  }
});
