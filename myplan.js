let timerInterval;
let selectedDate;

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
      commitTime.setHours(0, 0, 0, 0);
      localStorage.setItem('commitTime', commitTime.toISOString());
      displayCalendar(selectedDate);
      startTimer(commitTime);
    }
  });

  $('.eventButton').on('click', function() {
    const eventType = $(this).text();
    const eventColor = $(this).data('color');

    const events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
    events.push({
      title: eventType,
      start: selectedDate,
      color: eventColor
    });
    localStorage.setItem('calendarEvents', JSON.stringify(events));

    $('#calendar').fullCalendar('renderEvent', {
      title: eventType,
      start: selectedDate,
      color: eventColor
    }, true);

    if (eventType === 'Relapse') {
      localStorage.setItem('commitTime', new Date().toISOString());
      startTimer(new Date());
    }

    $('#myModal').css('display', 'none');
  });

  const modal = document.getElementById('myModal');
  const span = document.getElementsByClassName('close')[0];

  span.onclick = function() {
    modal.style.display = 'none';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }

  $('#calendar').fullCalendar({
    editable: true,
    eventLimit: true,
    defaultDate: new Date(),
    events: JSON.parse(localStorage.getItem('calendarEvents')) || [],
    dayClick: function(date, jsEvent, view) {
      selectedDate = date.format();
      $('#myModal').css('display', 'block');
    }
  });
});

function displayCalendar(date) {
  $('#calendar').fullCalendar('destroy'); // Destroy any existing calendar
  $('#calendar').fullCalendar({
    defaultDate: date,
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    events: JSON.parse(localStorage.getItem('calendarEvents')) || []
  });
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
