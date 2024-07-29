$(document).ready(function() {
  const storedNotes = JSON.parse(localStorage.getItem('notes')) || {};
  const storedCommitTime = localStorage.getItem('commitTime');

  $('#dateForm').on('submit', function(e) {
    e.preventDefault();
    const selectedDate = $('#startDate').val();
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
      events: Object.keys(storedNotes).map(date => ({
        title: storedNotes[date].type,
        start: date,
        color: storedNotes[date].type === 'Positive' ? 'green' : (storedNotes[date].type === 'Triggered' ? 'red' : 'orange')
      }))
    });
  }

  function displayNotes(date) {
    const notes = storedNotes[date];
    if (notes) {
      $('#remove-note').show();
      $('#note-popup-content').html(
        (notes.type ? `<p>${notes.type}</p>` : '') +
        (notes.note ? `<p>${notes.note}</p>` : '')
      );
    } else {
      $('#remove-note').hide();
      $('#note-popup-content').empty();
    }
  }

  $('#positive').click(() => saveNoteToCalendar('Positive'));
  $('#triggered').click(() => saveNoteToCalendar('Triggered'));
  $('#relapsed').click(() => {
    saveNoteToCalendar('Relapsed');
    resetTimer();
  });
  $('#add-note').click(() => addCustomNoteToCalendar());
  $('#remove-note').click(() => removeNoteFromCalendar());

  function saveNoteToCalendar(type) {
    const selectedDate = $('#note-popup').data('date');
    storedNotes[selectedDate] = storedNotes[selectedDate] || {};
    storedNotes[selectedDate].type = type;
    localStorage.setItem('notes', JSON.stringify(storedNotes));
    $('#note-popup').hide();
    displayCalendar($('#startDate').val());
  }

  function addCustomNoteToCalendar() {
    const selectedDate = $('#note-popup').data('date');
    const noteText = prompt('Enter your note:');
    if (!noteText) return;
    storedNotes[selectedDate] = storedNotes[selectedDate] || {};
    storedNotes[selectedDate].note = noteText;
    localStorage.setItem('notes', JSON.stringify(storedNotes));
    $('#note-popup').hide();
    displayCalendar($('#startDate').val());
  }

  function removeNoteFromCalendar() {
    const selectedDate = $('#note-popup').data('date');
    delete storedNotes[selectedDate];
    localStorage.setItem('notes', JSON.stringify(storedNotes));
    $('#note-popup').hide();
    displayCalendar($('#startDate').val());
  }

  $('#note-popup-overlay').on('click', function() {
    $('#note-popup').hide();
    $(this).hide();
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

  // Language support
  const translations = {
    en: {
      headerTitle: 'My Plan - The Vivere Project',
      timeCounter: 'Time since commit: 00:00:00',
      positive: 'Positive',
      triggered: 'Triggered',
      relapsed: 'Relapsed',
      addNote: 'Add a Note',
      removeNote: 'Remove Note',
      dayStatusPrompt: 'How was that day?'
    },
    fr: {
      headerTitle: 'Mon Plan - Le Projet Vivere',
      timeCounter: 'Temps depuis l\'engagement : 00:00:00',
      positive: 'Positif',
      triggered: 'Déclenché',
      relapsed: 'Rechute',
      addNote: 'Ajouter une Note',
      removeNote: 'Supprimer la Note',
      dayStatusPrompt: 'Comment était cette journée ?'
    }
  };

  const setLanguage = (lang) => {
    const translation = translations[lang];
    document.getElementById('header-title').textContent = translation.headerTitle;
    document.getElementById('timeCounter').textContent = translation.timeCounter;
    document.getElementById('positive').textContent = translation.positive;
    document.getElementById('triggered').textContent = translation.triggered;
    document.getElementById('relapsed').textContent = translation.relapsed;
    document.getElementById('add-note').textContent = translation.addNote;
    document.getElementById('remove-note').textContent = translation.removeNote;
    document.querySelector('#note-popup p').textContent = translation.dayStatusPrompt;
  };

  document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
  document.getElementById('lang-fr').addEventListener('click', () => setLanguage('fr'));

  // Set default language to French
  setLanguage('fr');
});
