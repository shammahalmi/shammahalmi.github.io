let maxHintCount;
let hintCount;

document.getElementById("start-game").addEventListener("click", function () {
  const selectedLevel = document.getElementById("level-dropdown").value;
  const selectedCategory = document.getElementById("category-dropdown").value;
  createGameBoard(parseInt(selectedLevel, 10), selectedCategory);

  maxHintCount = selectedLevel === "16" ? 1 : selectedLevel === "20" ? 2 : 3;
  hintCount = maxHintCount;
  updateHintCountDisplay();
});

document.getElementById("hint-button").addEventListener("click", function () {
  if (!gameStarted || lockBoard || hintCount === 0) return; // Hint only available during the game

  // Determine hint duration based on the selected level
  let hintDuration = 500; // Default duration (in milliseconds)
  const selectedLevel = document.getElementById("level-dropdown").value;
  if (selectedLevel === "20") {
    hintDuration = 1000; // Level 2: 1 second
  } else if (selectedLevel === "36") {
    hintDuration = 1500; // Level 3: 1.5 seconds
  }
  // Decrease the score for using a hint

  updateScore();

  hintCount--;
  updateHintCountDisplay();

  revealAllCardsForHint(hintDuration);
});

function updateHintCountDisplay() {
  document.getElementById(
    "hint-count"
  ).innerHTML = `Remaining Hints: ${hintCount}`;
}

function revealAllCardsForHint(duration) {
  // Disable board during hint
  lockBoard = true;

  // Add a class to reveal all cards
  document.querySelectorAll(".memory-card").forEach((card) => {
    card.classList.add("hint-reveal");
  });

  // Set a timeout to remove the hint class and enable the board after the specified duration
  setTimeout(() => {
    document.querySelectorAll(".memory-card").forEach((card) => {
      card.classList.remove("hint-reveal");
    });
    lockBoard = false;
  }, duration);
}

// Modify the event listeners for dropdown change
document
  .getElementById("level-dropdown")
  .addEventListener("change", function () {
    resetGame();
  });
document
  .getElementById("category-dropdown")
  .addEventListener("change", function () {
    resetGame();
  });

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let timer;
let score;
let gameStarted = false;
let seconds;

let time = document.getElementById("time");
let gameScore = document.getElementById("score");
const finalScoreElement = document.getElementById("final-score");

function startTimer() {
  seconds = 0;
  stopTimer();
  timer = setInterval(() => {
    seconds++;
    time.innerHTML = "Time: " + seconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = 0;
}

function resetGame() {
  time.innerHTML = "Time: 0";
  stopTimer();

  gameStarted = false;
  finalScoreElement.innerHTML = "Final Score: 0";
}

function flipCard() {
  if (!gameStarted) {
    gameStarted = true;
    // Start the timer when the game starts
    startTimer();
  }

  if (lockBoard) return;
  if (this === firstCard) return; // when we are in the second click and the same card clicked so return

  this.classList.add("flip");

  if (!hasFlippedCard) {
    // the first time that the player is clicked on the card
    hasFlippedCard = true;
    firstCard = this;

    return;
  }
  secondCard = this;
  updateScore();
  checkForMatch();
}

function updateScore() {
  score -= 10;
  gameScore.innerHTML = `Score: ${score}`;
}

function calculateFinalScore() {
  score = score - seconds * 10;
  finalScoreElement.textContent = `Final Score: ${score}`;
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    disableCards();

    // Check if all cards are matched to stop the timer
    if (
      document.querySelectorAll(".memory-card.flip").length ===
      document.querySelectorAll(".memory-card").length
    ) {
      stopTimer();
      gameStarted = false;
      calculateFinalScore();
      setTimeout(() => {
        alert("Game completed!");
      }, 500);
    }
  } else {
    unflipCards();
  }
}
// if the first and second card are mathcing remove the event listener from it
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

// if the first and the second card are not matching just remove the flip class from it to back to the normal state
// we added the time to see the second card when flipping without the time it is gonna flip very fast and we will not be able to see it
function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// for the positions of cards to be random ,when you add () and () to the function it is gonna call itself immediately
function shuffle() {
  const cards = document.querySelectorAll(".memory-card");
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
}

function createGameBoard(numberOfCards, category) {
  resetGame();

  let columns = 0;
  let rows = 0;

  // Determine number of cards, columns, and rows based on difficulty
  switch (numberOfCards) {
    case 16:
      columns = 4;
      rows = 4;
      score = 1000;
      break;
    case 20:
      columns = 5;
      rows = 4;
      score = 2000;
      break;
    case 36:
      columns = 6;
      rows = 6;
      score = 3000;
      break;
    default:
      break;
  }
  gameScore.innerHTML = `Score: ${score}`;

  // Clear existing cards
  document.querySelector(".memory-game").innerHTML = "";

  // Generate new cards based on the specified number
  for (let i = 0; i < numberOfCards; i++) {
    const card = document.createElement("div");
    card.classList.add("memory-card");
    card.dataset.framework = `Card${i % (numberOfCards / 2)}`;

    const frontFace = document.createElement("img");
    frontFace.classList.add("front-face");
    frontFace.src = `img/` + category + `/card${i % (numberOfCards / 2)}.png`;
    frontFace.alt = `Card ${i % (numberOfCards / 2)}`;

    const backFace = document.createElement("img");
    backFace.classList.add("back-face");
    backFace.src = "img/" + category + "/category_photo.png";

    card.appendChild(frontFace);
    card.appendChild(backFace);

    document.querySelector(".memory-game").appendChild(card);
  }

  // Add event listeners to the new cards
  document.querySelectorAll(".memory-card").forEach((card) => {
    card.addEventListener("click", flipCard);
    card.style.setProperty("--columns", columns);
    card.style.setProperty("--rows", rows);
  });

  // Shuffle the cards
  shuffle();
}
