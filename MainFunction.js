function submitRow() {
  if (currentCol < 5) return;

  let guess = "";

  for (let i = 0; i < 5; i++) {
    guess += cells[currentRow * 5 + i].textContent;
  }

  for (let i = 0; i < 5; i++) {
    const cell = cells[currentRow * 5 + i];
    const letter = guess[i];

    setTimeout(() => {
      cell.classList.add("flip");

      setTimeout(() => {
        if (letter === secretWord[i]) {
          cell.classList.add("correct");
        } else if (secretWord.includes(letter)) {
          cell.classList.add("present");
        } else {
          cell.classList.add("absent");
        }
      }, 300);

    }, i * 600);
  }

  // перевірка перемоги
  if (guess === secretWord) {
    setTimeout(() => {
      alert("🎉 Ти вгадав слово!");
      gameOver = true;
    }, 3000);
    return;
  }

  currentRow++;
  currentCol = 0;

  if (currentRow === 6) {
    setTimeout(() => {
      alert("😢 Гру закінчено! Слово було: " + secretWord);
      gameOver = true;
    }, 3000);
  }
}
