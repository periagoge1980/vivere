let timerInterval;
let selectedDay;

netlifyIdentity.on('init', user => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    const storedCommitTime = localStorage.getItem('commitTime');
    if (storedCommitTime) {
      const commitTime = new Date(storedCommitTime);
      $('#startDate').val(moment(commitTime).format('YYYY-MM-DD'));
      displayCalendar(moment(commitTime).format('YYYY-MM-DD'));
      startTimer(commitTime);
    }
  }
});

netlifyIdentity.init();

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

  $('#positiveDay').on('click', () => handleDayTagging('positive'));
  $('#triggeredDay').on('click', () => handleDayTagging('triggered'));
  $('#relapsedDay').on('click', () => handleDayTagging('relapsed'));
  $('#removeNote').on('click', () => handleDayTagging('remove'));
});

function displayCalendar(date) {
  $('#calendar').fullCalendar('destroy'); // Destroy any existing calendar
  $('#calendar').fullCalendar({
    defaultDate: date,
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    events: JSON.parse(localStorage.getItem('calendarEvents')) || [],
    dayClick: function(date) {
      selectedDay = date.format();
      const events = $('#calendar').fullCalendar('clientEvents', event => event.start.format() === selectedDay);
      if (events.length > 0) {
        $('#removeNote').show();
      } else {
        $('#removeNote').hide();
      }
      $('#dayTagModal').show();
    }
  });
}

function handleDayTagging(tag) {
  const events = $('#calendar').fullCalendar('clientEvents');
  const newEvent = {
    title: '',
    start: selectedDay,
    allDay: true
  };

  if (tag === 'positive') {
    newEvent.title = 'Positive';
    newEvent.color = 'green';
  } else if (tag === 'triggered') {
    newEvent.title = 'Triggered';
    newEvent.color = 'red';
  } else if (tag === 'relapsed') {
    newEvent.title = 'Relapsed';
    newEvent.color = 'orange';
    resetTimer();
  } else if (tag === 'remove') {
    const event = events.find(event => event.start.format() === selectedDay);
    if (event) {
      $('#calendar').fullCalendar('removeEvents', event._id);
    }
  }

  if (tag !== 'remove') {
    $('#calendar').fullCalendar('renderEvent', newEvent, true);
  }

  const updatedEvents = $('#calendar').fullCalendar('clientEvents');
  localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));

  $('#dayTagModal').hide();
}

function resetTimer() {
  clearInterval(timerInterval);
  const commitTime = new Date();
  localStorage.setItem('commitTime', commitTime.toISOString());
  startTimer(commitTime);
}

function startTimer(commitTime) {
  clearInterval(timerInterval); // Clear any existing timer

  timerInterval = setInterval(function() {
    const currentTime = new Date();
    const timeDiff = currentTime - commitTime;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    $('#timeCounter').text(`Time since commit: ${days}d ${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`);
  }, 1000);
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
