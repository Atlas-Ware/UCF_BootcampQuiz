// Global variables
var intervalID;
var time;
var currentQuestion;

// My HTML cards turned into varaibles
var startCard = document.querySelector("#start-card");
var questionCard = document.querySelector("#question-card");
var scoreCard = document.querySelector("#score-card");
var leaderboardCard = document.querySelector("#leaderboard-card");

// Hides HTML cards until they need to be unhidden
function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  leaderboardCard.setAttribute("hidden", true);
}

// Quiz questions
var questions = [
  {
    questionText: "Inside which HTML element do we put the JavaScript?",
    options: [
      "1. <js>", 
      "2. <scripting>", 
      "3. <script>", 
      "4. <javascript>",
  ],
    answer: "3. <script>",
  },
  {
    questionText: "How do you write 'Hello World' in an alert box?",
    options: [
      "1. alert ['Hello World]",
      "2. prompt (Hello World)",
      "3. message 'Hello World' ",
      "4. alert('Hello World');",
    ],
    answer: "4. alert('Hello World');",
  },
  {
    questionText:
      "How do you create a function in JavaScript?",
    options: [
      "1. function=myFunction()", 
      "2. function:myFunction()", 
      "3. function myFunction()", 
      "4. function myFunction[]",
    ],
    answer: "3. function myFunction()",
  },
  {
    questionText:
      "How do you write an IF statement in JavaScript?",
    options: [
      "1. if () {}",
      "2. IF () {}",
      "3. if [] {}",
      "4. If [] {}",
    ],
    answer: "1. if () {}",
  },
  {
    questionText:
      "How can you add a comment in a JavaScript?",
    options: [
      "1. <!--This is a comment-->", 
      "2. // This is a comment", 
      "3. /* This is a comment */", 
      "4. // This is a comment //",
    ],
    answer: "2. // This is a comment", 
  },
];

// Starts the quiz by clicking button "start quiz"
document.querySelector("#start-button").addEventListener("click", startQuiz);

// BEGIN Quiz Code
function startQuiz() {
// Hide any visible cards, show the question card
  hideCards();
  questionCard.removeAttribute("hidden");

// Assign 0 to currentQuestion when start button is clicked, then display the current question on the page
  currentQuestion = 0;
  displayQuestion();

// Set total time depending on number of questions
  time = questions.length * 10;

// Executes function "countdown" every 1000ms to update time and display on page
  intervalID = setInterval(countdown, 1000);

// Invoke displayTime here to ensure time appears on the page as soon as the start button is clicked, not after 1 second
  displayTime();
}

// If answer is incorrect, penalize time
function checkAnswer(eventObject) {
  var optionButton = eventObject.target;
  resultDiv.style.display = "block";
  if (optionIsCorrect(optionButton)) {
    resultText.textContent = "Correct!";
    setTimeout(hideResultText, 1000);
  } else {
    resultText.textContent = "Incorrect!";
    setTimeout(hideResultText, 1000);
    if (time >= 10) {
      time = time - 10;
      displayTime();
    } else {
// If time is less than 10, display time as 0 and end quiz
// Time is set to zero in this case to avoid displaying a negative number in cases where a wrong answer is submitted with < 10 seconds left on the timer
      time = 0;
      displayTime();
      endQuiz();
    }
  }

// Increment current question by 1
  currentQuestion++;
  //if we have not run out of questions then display next question, else end quiz
  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}
// Display the question and answer options for the current question
function displayQuestion() {
  var question = questions[currentQuestion];
  var options = question.options;

  var h2QuestionElement = document.querySelector("#question-text");
  h2QuestionElement.textContent = question.questionText;

  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    var optionButton = document.querySelector("#option" + i);
    optionButton.textContent = option;
  }
}
//END Quiz Code


// BEGIN Timer Code
// Reduce time by 1 and display new value, if time runs out then end quiz
function countdown() {
  time--;
  displayTime();
  if (time < 1) {
    endQuiz();
  }
}

// Display time on page
var timeDisplay = document.querySelector("#time");
function displayTime() {
  timeDisplay.textContent = time;
}
// END Timer Code

// BEGIN Results Code
var resultDiv = document.querySelector("#result-div");
var resultText = document.querySelector("#result-text");

// Hide result div
function hideResultText() {
  resultDiv.style.display = "none";
}

// Behaviour when an answer button is clicked: click event bubbles up to div with id "quiz-options"
// EventObject.target identifies the specific button element that was clicked on
document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

// Compare the text content of the option button with the answer to the current question
function optionIsCorrect(optionButton) {
  return optionButton.textContent === questions[currentQuestion].answer;
}
// END Results Code

// BEGIN Score Code
// Display scorecard and hide other divs
var score = document.querySelector("#score");

// At end of quiz, clear the timer, hide any visible cards and 
// display the scorecard and display the score as the remaining time
function endQuiz() {
  clearInterval(intervalID);
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = time;
}

var submitButton = document.querySelector("#submit-button");
var inputElement = document.querySelector("#initials");

//store user initials and score when submit button is clicked
submitButton.addEventListener("click", storeScore);

function storeScore(event) {
  //prevent default behaviour of form submission
  event.preventDefault();

  //check for input
  if (!inputElement.value) {
    alert("Please enter your initials before pressing submit!");
    return;
  }

  //store score and initials in an object
  let leaderboardItem = {
    initials: inputElement.value,
    score: time,
  };

  updateStoredLeaderboard(leaderboardItem);

  //hide the question card, display the leaderboardcard
  hideCards();
  leaderboardCard.removeAttribute("hidden");

  renderLeaderboard();
}

// Updates the leaderboard stored in local storage
function updateStoredLeaderboard(leaderboardItem) {
  var leaderboardArray = getLeaderboard();
  //append new leaderboard item to leaderboard array
  leaderboardArray.push(leaderboardItem);
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

// ??Get "leaderboardArray" from local storage (if it exists) and parse 
// it into a javascript object using JSON.parse??
function getLeaderboard() {
  //FROM HERE
  var storedLeaderboard = localStorage.getItem("leaderboardArray");
  if (storedLeaderboard !== null) {
    let leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
  } else {
    leaderboardArray = [];
  }
  return leaderboardArray;
}

// Display leaderboard on leaderboard card
function renderLeaderboard() {
  var sortedLeaderboardArray = sortLeaderboard();
  var highscoreList = document.querySelector("#highscore-list");
  highscoreList.innerHTML = "";
  for (let i = 0; i < sortedLeaderboardArray.length; i++) {
    let leaderboardEntry = sortedLeaderboardArray[i];
    let newListItem = document.createElement("li");
    newListItem.textContent =
      leaderboardEntry.initials + " - " + leaderboardEntry.score;
    highscoreList.append(newListItem);
  }
}

// Sort leaderboard array from highest to lowest
function sortLeaderboard() {
  var leaderboardArray = getLeaderboard();
  if (!leaderboardArray) {
    return;
  }

  leaderboardArray.sort(function (a, b) {
    return b.score - a.score;
  });
  return leaderboardArray;
}

// Hide leaderboard card show start card
function returnToStart() {
  hideCards();
  startCard.removeAttribute("hidden");
}
// END Score Code


// Extra Quiz Code Content
// Clears the Highscores variable
var clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);

// Clear local storage and display empty leaderboard
function clearHighscores() {
  localStorage.clear();
  renderLeaderboard();
}

// RETURNs to Beginning
// Back button & return to first card variable & event listener
var backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);



// Use ID from HTML header to view highscores
var leaderboardLink = document.querySelector("#leaderboard-link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
  hideCards();
  leaderboardCard.removeAttribute("hidden");

  // Stop countdown
  clearInterval(intervalID);

  // Assign undefined to time and display that way the time is hidden on the page
  time = undefined;
  displayTime();

  // Displays leaderboard on leaderboard card
  renderLeaderboard();
}
