document.getElementById("btn16").addEventListener("click", function () {
  createGameBoard(16, "category1");
});

document.getElementById("btn20").addEventListener("click", function () {
  createGameBoard(20, "category2");
});

document.getElementById("btn36").addEventListener("click", function () {
  createGameBoard(36, "category3");
});

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let timer;
let moves = 0;
let score = 1000;

let time = document.getElementById("time");

function startTimer() {
  let seconds = 0;
  //clearInterval(timer);
  stopTimer(timer);
  timer = setInterval(() => {
    seconds++;
    time.innerHTML = " Time: " + seconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function flipCard() {
  //this.classList.toggle("flip"); // if the class is there remove it ,if not add it the same with : this.classList.add("flip");

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
  moves++;
  updateScore();
  checkForMatch();
}

function updateScore() {
  score -= 10;
  document.getElementById("score").textContent = `Score: ${score}`;
}

function calculateFinalScore() {
  // Calculate the time taken to complete the game
  const elapsedTime = seconds;

  // Calculate the score based on the time (you can adjust the formula as needed)
  const timeScore = Math.floor(10000 / (elapsedTime + 1)); // Example formula

  // Add the time-based score to the overall score
  score += timeScore;

  // Update the UI to display the final score
  const finalScoreElement = document.getElementById("final-score");
  finalScoreElement.textContent = `Final Score: ${score}`;
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  console.log("is match:", isMatch);

  // isMatch ? disableCards() : unflipCards();
  if (isMatch) {
    disableCards();

    // Check if all cards are matched to stop the timer
    if (
      document.querySelectorAll(".memory-card.flip").length ===
      document.querySelectorAll(".memory-card").length
    ) {
      stopTimer();
      calculateFinalScore();
      console.log("Game completed!");
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
    backFace.alt = "Fruits";

    card.appendChild(frontFace);
    card.appendChild(backFace);

    document.querySelector(".memory-game").appendChild(card);
  }

  // Add event listeners to the new cards
  document.querySelectorAll(".memory-card").forEach((card) => {
    card.addEventListener("click", flipCard);
  });

  // Shuffle the cards
  shuffle();
  // Start the timer when the game starts
  startTimer();
}
