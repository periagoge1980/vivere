<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Plan</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.2/fullcalendar.min.css" rel="stylesheet">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    header {
      background-color: #007BFF;
      color: white;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    header h1 {
      margin: 0;
    }
    .container {
      flex: 1;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    form {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    input[type="date"] {
      padding: 10px;
      margin-right: 10px;
      font-size: 16px;
    }
    button {
      padding: 10px;
      background-color: #007BFF;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover {
      background-color: #0056b3;
    }
    #timeCounter {
      text-align: center;
      margin: 20px 0;
      font-size: 20px;
      color: #333;
    }
    #calendar {
      max-width: 900px;
      margin: 0 auto;
      margin-top: 20px;
    }
    a {
      text-decoration: none;
      color: #007BFF;
      border: 1px solid #007BFF;
      padding: 10px 20px;
      margin: 5px;
      display: inline-block;
    }
    a:hover {
      background-color: #007BFF;
      color: white;
    }
    footer {
      background-color: #f1f1f1;
      padding: 10px;
      text-align: center;
      margin-top: auto;
    }
    .login-link {
      color: white;
      cursor: pointer;
      text-decoration: none;
      font-weight: bold;
    }
    #note-popup, #note-input-popup, #journal-popup {
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      border: 1px solid #ccc;
      padding: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }
    #note-popup button, #note-input-popup button, #journal-popup button {
      margin: 5px;
      padding: 10px 20px;
      background-color: #007BFF;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 16px;
      border-radius: 5px;
    }
    #note-popup button:hover, #note-input-popup button:hover, #journal-popup button:hover {
      background-color: #0056b3;
    }
    #note-popup-overlay, #note-input-popup-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }
    .note-block {
      margin: 5px 0;
      padding: 10px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <header>
    <h1>My Plan</h1>
    <a id="login" class="login-link">Login/Signup</a>
  </header>
  <div class="container">
    <form id="dateForm">
      <input type="date" id="startDate" value="">
      <button type="submit">Commit!</button>
    </form>
    <div id="timeCounter">Time since commit: 00:00:00</div>
    <div id="calendar"></div>
    <a href="index.html">Home</a>
    <a href="resources.html">Resources</a>
  </div>
  <footer>
    &copy; 2024 The Vivere Project. All rights reserved.
  </footer>

  <div id="note-popup-overlay"></div>
  <div id="note-popup">
    <p>How was that day?</p>
    <button id="positive">Positive</button>
    <button id="triggered">Triggered</button>
    <button id="relapsed">Relapsed</button>
    <button id="add-note">Add a Note</button>
    <button id="view-day">View Day</button>
    <button id="remove-note" style="display: none;">Remove Note</button>
    <div id="notes-container"></div>
  </div>

  <div id="note-input-popup">
    <p>Add your custom note:</p>
    <textarea id="custom-note" rows="4" cols="50"></textarea>
    <button id="save-note">Save Note</button>
    <button id="cancel-note">Cancel</button>
  </div>

  <div id="journal-popup">
    <p>Journal Entries</p>
    <div id="day-journal"></div>
    <button>Close</button>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.2/fullcalendar.min.js"></script>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  <script src="myplan.js"></script>
</body>
</html>
