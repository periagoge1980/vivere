let timerInterval;

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
      if (selectedDate === moment().format('YYYY-MM-DD')) {
        commitTime.setHours(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds(), 0);
      } else {
        commitTime.setHours(0, 0, 0, 0);
      }
      localStorage.setItem('commitTime', commitTime.toISOString());
      displayCalendar(selectedDate);
      startTimer(commitTime);
    }
  });

  // Modal event listeners
  $('#positiveBtn').on('click', () => handleDayTagging('positive'));
  $('#triggeredBtn').on('click', () => handleDayTagging('triggered'));
  $('#relapsedBtn').on('click', () => handleDayTagging('relapsed'));
});

function displayCalendar(date) {
  $('#calendar').fullCalendar('destroy'); // Destroy any existing calendar
  $('#calendar').fullCalendar({
    defaultDate: date,
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    events: [
      {
        title: 'A New Beginning!',
        start: date,
        color: 'red',    // Highlight color
      }
    ],
    dayClick: function(date) {
      $('#tagModal').data('date', date.format()).show();
    }
  });
}

function handleDayTagging(tag) {
  const date = $('#tagModal').data('date');
  const events = $('#calendar').fullCalendar('clientEvents');
  const eventIndex = events.findIndex(event => event.start.format() === date);

  if (eventIndex !== -1) {
    $('#calendar').fullCalendar('removeEvents', events[eventIndex]._id);
  }

  if (tag === 'relapsed') {
    resetTimer();
  } else {
    $('#calendar').fullCalendar('renderEvent', {
      title: tag.charAt(0).toUpperCase() + tag.slice(1),
      start: date,
      color: tag === 'positive' ? '#28a745' : '#dc3545'
    });
  }

  $('#tagModal').hide();
}

function resetTimer() {
  clearInterval(timerInterval);
  localStorage.removeItem('commitTime');
  $('#timeCounter').text('Time since commit: 00:00:00');
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
