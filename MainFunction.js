const secretWord = "APPLE";
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
    submitRow();
  } else if (key === "←") {
    removeLetter();
  } else {
    writeLetter(key);
  }
});

function writeLetter(letter) {
  // ❌ больше 5 букв в строке нельзя
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
  // ❌ если введено меньше 5 букв — нельзя
  if (currentCol < 5) return;

  let guess = "";

  for (let i = 0; i < 5; i++) {
    guess += cells[currentRow * 5 + i].textContent;
  }

  // проверка букв
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

  // победа
  if (guess === secretWord) {
    alert("🎉 Ты угадал слово!");
    gameOver = true;
    return;
  }

  // переход на следующую строку
  currentRow++;
  currentCol = 0;

  // конец игры
  if (currentRow === 6) {
    alert("😢 Игра окончена! Слово было: " + secretWord);
    gameOver = true;
  }
}
