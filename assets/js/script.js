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
document.querySelector("#start-button").addEventListener("click", beginQuiz);

// BEGIN Quiz Code
function beginQuiz() {
  hideCards();
  questionCard.removeAttribute("hidden");
  currentQuestion = 0;
  showTheQuestion();
  time = questions.length * 10;
  intervalID = setInterval(countdown, 1000);
  showTime();
}

// Answer is wrong, you loose time
function answer(eventObject) {
  var optionButton = eventObject.target;
  resultDiv.style.display = "block";
  if (optionCorrect(optionButton)) {
    resultText.textContent = "Correct!";
    setTimeout(hideResultText, 1000);
  } else {
    resultText.textContent = "Incorrect!";
    setTimeout(hideResultText, 1000);
    if (time >= 10) {
      time = time - 10;
      showTime();
    } else {
      time = 0;
      showTime();
      endQuiz();
    }
  } currentQuestion++;
  if (currentQuestion < questions.length) {
    showTheQuestion();
  } else {
    endQuiz();
  }
}

// Display the question and answer options for the current question
function showTheQuestion() {
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
function countdown() {
  time--;
  showTime();
  if (time < 1) {
    endQuiz();
  }
}
// Display time on page
var timeDisplay = document.querySelector("#time");
function showTime() {
  timeDisplay.textContent = time;
}
// END Timer Code


// BEGIN Results Code
var resultDiv = document.querySelector("#result-div");
var resultText = document.querySelector("#result-text");

// Hide result
function hideResultText() {
  resultDiv.style.display = "none";
}

// Answer button is clicked
document.querySelector("#quiz-options").addEventListener("click", answer);


function optionCorrect(optionButton) {
  return optionButton.textContent === questions[currentQuestion].answer;
}
// END Results Code


// BEGIN Score Code
var score = document.querySelector("#score");

// display the scorecard and display the score as the remaining time
function endQuiz() {
  clearInterval(intervalID);
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = time;
}

var submitButton = document.querySelector("#submit-button");
var inputElement = document.querySelector("#initials");

// Stores your initials and score when submit button is clicked
submitButton.addEventListener("click", storeScore);

function storeScore(event) {
  event.preventDefault();
  if (!inputElement.value) {
    alert("Please enter your initials before pressing submit!");
    return;
  }
  let leaderboardItem = {
    initials: inputElement.value,
    score: time,
  };

  updateLeaderboard(leaderboardItem);

// Hides the question card & displays the leaderboardcard
  hideCards();
  leaderboardCard.removeAttribute("hidden");
  displayLeaderboard();
}

// Updates the leaderboard stored in local storage
function updateLeaderboard(leaderboardItem) {
  var leaderboardArray = getLeaderboard();
  leaderboardArray.push(leaderboardItem);
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

// Get "leaderboardArray" from local storage and parse 
// it into a javascript object
function getLeaderboard() {
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
function displayLeaderboard() {
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
  displayLeaderboard();
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
  clearInterval(intervalID);
  time = undefined;
  showTime();

  displayLeaderboard();
}
