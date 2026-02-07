const secretWord = "APPLE";
const cells = document.querySelectorAll(".cell");
const keyboard = document.getElementById("keyboard");

let currentRow = 0;
let currentCol = 0;
let gameOver = false;

/* =========================
   ЕКРАННА КЛАВІАТУРА
========================= */
keyboard.addEventListener("click", (e) => {
  if (gameOver) return;
  if (!e.target.matches("button")) return;

  const key = e.target.textContent;

  handleInput(key);
});

/* =========================
   ФІЗИЧНА КЛАВІАТУРА
========================= */
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  let key = e.key;

  if (key === "Backspace") key = "←";
  if (key === "Enter") key = "Enter";

  // тільки літери A–Z
  if (/^[a-zA-Z]$/.test(key)) {
    key = key.toUpperCase();
  }

  handleInput(key);
});

/* =========================
   ОБРОБКА ВВОДУ
========================= */
function handleInput(key) {
  if (key === "Enter") {
    submitRow();
  } else if (key === "←") {
    removeLetter();
  } else if (/^[A-Z]$/.test(key)) {
    writeLetter(key);
  }
}

function writeLetter(letter) {
  if (currentCol >= 5) return;

  const index = currentRow * 5 + currentCol;
  cells[index].textContent = letter;
  currentCol++;
}

function removeLetter() {
  if (currentCol === 0) return;

  currentCol--;
  const index = currentRow * 5 + currentCol;
  cells[index].textContent = "";
}

function submitRow() {
  if (currentCol < 5) return;

  let guess = "";

  for (let i = 0; i < 5; i++) {
    guess += cells[currentRow * 5 + i].textContent;
  }

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
    alert("🎉 Ти вгадав слово!");
    gameOver = true;
    return;
  }

  currentRow++;
  currentCol = 0;

  if (currentRow === 6) {
    alert("😢 Гру закінчено! Слово було: " + secretWord);
    gameOver = true;
  }
}
