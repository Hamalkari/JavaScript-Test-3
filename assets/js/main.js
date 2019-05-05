(function() {
  let gameBoxes = document.querySelectorAll(".game__box"),
    startButton = document.querySelector(".game__btn"),
    timeMin = document.querySelector(".timer__min"),
    timeSec = document.querySelector(".timer__sec");

  /**
   * firstBox,secondBox - для хранения кликнутых квадратов
   * hasFlippedBox - для проверки переврнут ли квадрат
   * lockField - для блокирования поля
   * timerId - таймерё
   * time - время игры
   */
  let firstBox, secondBox;
  let hasFlippedBox = false;
  let lockField = false;
  let countBoxOpen = 0;
  let timerID = null;
  let time = {};
  let fps = 60;

  startButton.addEventListener("click", startGame);

  // startGame() старт игры, устанавливаем рандомные цвета для квадратов и начинаем отсет таймера
  function startGame(e) {
    this.classList.add("hide");
    setRandomColor();
    startTimer();
    gameBoxes.forEach(gameBox => gameBox.addEventListener("click", boxHandler));
  }

  // boxHandler() обработчик кликов на квадраты
  function boxHandler() {
    if (lockField || this == firstBox) return;
    else {
      this.style.backgroundColor = this.dataset.color;
      if (hasFlippedBox) {
        secondBox = this;
        checkForMatch();
      } else {
        hasFlippedBox = true;
        firstBox = this;
      }
    }
  }

  // checkForMatch() проверяем совпадения двух квадратов
  function checkForMatch() {
    let match =
      firstBox.dataset.color === secondBox.dataset.color
        ? disableBoxes()
        : closeBoxes();
  }

  // closeBoxes() если не угаданы прячем их обратно
  function closeBoxes() {
    lockField = true;

    setTimeout(() => {
      firstBox.style.backgroundColor = "#fff";
      secondBox.style.backgroundColor = "#fff";

      resetBoxes();
    }, 1000);
  }

  // disableBoxes() если же угадали снимаем обработчики событий на эти квадраты
  function disableBoxes() {
    firstBox.removeEventListener("click", boxHandler);
    secondBox.removeEventListener("click", boxHandler);
    resetBoxes();
    countBoxOpen++;
    if (countBoxOpen == 8) {
      endGame();
    }
  }

  // resetBoxes() обновляем наши переменные после каждых двух квадратов
  function resetBoxes() {
    firstBox = secondBox = null;
    hasFlippedBox = lockField = false;
  }

  // endGame() окончание игры, выводим результата на экран и обновляем игру
  function endGame() {
    clearInterval(timerID);
    setTimeout(() => {
      let resStr = `${timeMin.innerHTML}:${timeSec.innerHTML}`;
      alert(`Вы выиграли. Результат - ${resStr}`);
      resetGame();
    },1000);
  }

  // resetGame() обновляем игру
  function resetGame(){
    clearBoxes();
    countBoxOpen = 0;
    startButton.classList.remove("hide");
    timeMin.innerHTML = "00";
    timeSec.innerHTML = "00.000";
  }

  // setRandomColor() устанавливаем связь рандомных цветов для квадратов в data-атрибут
  function setRandomColor() {
    let randomColors = Array.from({ length: 8 }).map(
      _ => `rgb(${getRandom(0, 255)},${getRandom(0, 255)},${getRandom(0, 255)})`
    );
    let boxes = Array.from(gameBoxes);
    randomColors.forEach((color, i) => {
      boxes[i].setAttribute("data-color", color);
      boxes[boxes.length - i - 1].setAttribute("data-color", color);
    });
    shuffle(boxes);
  }

  // shuffle(boxes) перемешиваем наши квадраты
  function shuffle(boxes){
    boxes.forEach(box => {
      let randOrder = getRandom(0, 12);
      box.style.order = randOrder;
    });
  }

  // startTimer() функция для старта таймера
  function startTimer() {
    time.sec = 0;
    time.min = 0;
    renderTime();
    timerID = setInterval(renderTime, 1000 / fps);
  }

  // renderTime() обновляем время и записываем в соотвествующие поля
  function renderTime() {
    time.sec += 1 / fps;
    if (time.sec >= 60) {
      time.min += 1;
      time.sec = 0;
    }
    let sec = time.sec.toFixed(3);
    let min = time.min;

    let secStr = sec < 10 ? `0${sec}` : sec;
    let minStr = min < 10 ? `0${min}` : min;

    timeSec.innerHTML = secStr;
    timeMin.innerHTML = minStr;
  }

  // clearBoxes() очиста кубов после окончании игры
  function clearBoxes() {
    gameBoxes.forEach(gameBox => {
      gameBox.style.backgroundColor = "#fff";
      gameBox.removeEventListener('click',boxHandler);
    });
  }

  // getRandom() вспомогательная функция для получения рандомного числа из промежутка
  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min - 1)) + min;
  }
})();
