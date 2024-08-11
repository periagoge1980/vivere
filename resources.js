function initializePage() {
  const storedNotes = JSON.parse(localStorage.getItem('notes')) || {};
  const storedCommitTime = localStorage.getItem('commitTime');

  $('#dateForm').off('submit').on('submit', function(e) {
    e.preventDefault();
    const selectedDate = $('#startDate').val();
    if (selectedDate) {
      const commitTime = new Date();
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
    $('#calendar').fullCalendar('destroy');
    $('#calendar').fullCalendar({
      defaultDate: date,
      editable: true,
      eventLimit: true,
      dayClick: function(date) {
        const selectedDate = date.format('YYYY-MM-DD');
        $('#note-popup').data('date', selectedDate).show();
        displayNotes(selectedDate);
      },
      events: getStoredEvents()
    });
  }

  function getStoredEvents() {
    const events = [];
    for (const date in storedNotes) {
      storedNotes[date].forEach(note => {
        events.push({
          title: note.title,
          start: date,
          color: note.color || 'blue'  // Default color if none provided
        });
      });
    }
    return events;
  }

  function displayNotes(date) {
    const notesContainer = $('#notes-container');
    notesContainer.empty();
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

  $('#positive').off('click').on('click', () => saveNoteToCalendar('Positive', 'green'));
  $('#triggered').off('click').on('click', () => saveNoteToCalendar('Triggered', 'red'));
  $('#relapsed').off('click').on('click', () => {
    saveNoteToCalendar('Relapsed', 'orange');
    resetTimer();
  });
  $('#add-note').off('click').on('click', () => {
    $('#note-popup').hide();
    $('#note-input-popup').show();
  });
  $('#remove-note').off('click').on('click', () => removeNoteFromCalendar());
  $('#view-day').off('click').on('click', () => viewDayJournal());

  $('#save-note').off('click').on('click', () => {
    const selectedDate = $('#note-popup').data('date');
    const customNote = $('#custom-note').val();
    if (customNote) {
      addNoteToDate(selectedDate, {
        title: customNote,
        color: 'blue',
        note: customNote
      });
      $('#custom-note').val('');
      $('#note-input-popup').hide();
      displayCalendar($('#startDate').val());
    }
  });

  $('#cancel-note').off('click').on('click', () => {
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

  $('#journal-popup button').off('click').on('click', () => {
    $('#journal-popup').hide();
  });

  $('#popup-overlay, #note-popup-overlay').off('click').on('click', () => {
    $('#note-popup').hide();
    $('#journal-popup').hide();
    $('#note-input-popup').hide();
  });

  let timerInterval;

  function startTimer(commitTime) {
    clearInterval(timerInterval);

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
  loginButton.removeEventListener('click', openLogin);
  loginButton.addEventListener('click', openLogin);

  function openLogin() {
    netlifyIdentity.open();
  }

  netlifyIdentity.off('login').on('login', user => {
    console.log('User logged in:', user);
    netlifyIdentity.close();
  });

  netlifyIdentity.off('logout').on('logout', () => {
    console.log('User logged out');
    window.location.href = 'index.html';
  });
}

$(document).ready(initializePage);
