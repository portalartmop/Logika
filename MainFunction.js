const secretWord = "APPLE"; // слово для вгадування
const cells = document.querySelectorAll(".cell");
const keyboard = document.getElementById("keyboard");

let currentRow = 0;
let currentCol = 0;
let gameOver = false;

keyboard.addEventListener("click", (e) => {
  if (gameOver) return;
  if (!e.target.matches("button")) return;

  const key = e.target.textContent;

  if (key === "Enter") {
    checkWord();
  } else if (key === "←") {
    deleteLetter();
  } else {
    addLetter(key);
  }
});

function addLetter(letter) {
  if (currentCol < 5) {
    const index = currentRow * 5 + currentCol;
    cells[index].textContent = letter;
    currentCol++;
  }
}

function deleteLetter() {
  if (currentCol > 0) {
    currentCol--;
    const index = currentRow * 5 + currentCol;
    cells[index].textContent = "";
  }
}

function checkWord() {
  if (currentCol < 5) return;

  let guess = "";
  for (let i = 0; i < 5; i++) {
    guess += cells[currentRow * 5 + i].textContent;
  }

  // перевірка
  for (let i = 0; i < 5; i++) {
    const cell = cells[currentRow * 5 + i];
    const letter = guess[i];

    if (letter === secretWord[i]) {
      cell.classList.add("correct");
    } else if (secretWord.includes(letter)) {
      cell.classList.add("present");
    } else {
      cell.classList.add("absent");
    }
  }

  if (guess === secretWord) {
    setTimeout(() => alert("🎉 Ти вгадав слово!"), 100);
    gameOver = true;
    return;
  }

  currentRow++;
  currentCol = 0;

  if (currentRow === 6) {
    setTimeout(() => alert("😢 Гру завершено! Слово було: " + secretWord), 100);
    gameOver = true;
  }
}
