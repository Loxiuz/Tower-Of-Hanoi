import Stack from "./stack.js";

window.addEventListener("load", () => {
  const controller = new Controller(8, 200);
  controller.init();
  window.controller = controller;
});

class Controller {
  //The solver only works with three towers
  constructor(towerHeight = 4, moveDelay = 300, towerAmount = 3) {
    this.towerAmount = towerAmount;
    this.towerHeight = towerHeight;
    this.moveDelay = moveDelay;
    this.towers = [];
    this.moves = 0;
    this.clickedTower = 0; //latest tower clicked
    //Bind class to relevant functions
    this.boundResetBtnClicked = this.resetBtnClicked.bind(this);
    this.handleSolveClicked = this.handleSolveClicked.bind(this);
    this.boundTowerClicked = this.towerClicked.bind(this);
  }

  init() {
    this.initTowers();
    this.display();
  }

  initTowers() {
    for (let i = 0; i < this.towerAmount; i++) {
      this.towers[i] = new Stack();
    }
    //Initializes the disks on the first tower
    for (let i = this.towerHeight; i > 0; i--) {
      this.towers[0].push(i);
    }
  }

  addEventListeners() {
    for (let i = 1; i <= this.towerAmount; i++) {
      const tower = document.querySelector(`#tower${i}`);
      tower.removeEventListener("click", this.boundTowerClicked);
      tower.addEventListener("click", this.boundTowerClicked);
    }
    const resetBtn = document.querySelector("#resetBtn");
    const solveBtn = document.querySelector("#solveBtn");
    resetBtn.removeEventListener("click", this.boundResetBtnClicked);
    solveBtn.removeEventListener("click", this.handleSolveClicked);
    resetBtn.addEventListener("click", this.boundResetBtnClicked);
    solveBtn.addEventListener("click", this.handleSolveClicked);
  }

  resetBtnClicked(e) {
    console.log("Reset button clicked");
    e.preventDefault();
    this.init();
    this.moves = 0;
    this.clickedTower = 0;
    document.querySelector("#movingFeedback").innerHTML = "";
    this.display();
  }

  handleSolveClicked(e) {
    console.log("Solve button clicked");
    e.preventDefault();
    this.solver();
  }

  //When you click a tower
  towerClicked(e) {
    e.preventDefault();
    const tower = Number(e.currentTarget.value);
    console.log(`Tower ${tower} clicked!`);
    if (this.clickedTower === 0) {
      document.querySelector("#movingFeedback").innerHTML = `
      Moving disk from tower <span id="towerFrom">(click tower)</span> to tower
      <span id="towerTo">(click tower)</span>
      `;
      document.querySelector("#towerFrom").textContent = "(click tower)";
      document.querySelector("#towerTo").textContent = "(click tower)";
      this.clickedTower = tower;
      document.querySelector("#towerFrom").textContent = this.clickedTower;
    } else {
      const prevClickedTower = this.clickedTower;
      this.clickedTower = tower;
      document.querySelector("#towerTo").textContent = tower;
      this.moveTopDisk(prevClickedTower, this.clickedTower);
      this.clickedTower = 0;
    }
  }

  handleGameOver() {
    console.log("Game Won!");
    for (let i = 1; i <= this.towerAmount; i++) {
      const tower = document.querySelector(`#tower${i}`);
      tower.removeEventListener("click", this.boundTowerClicked);
    }
    document.querySelector("#movingFeedback").textContent = "Game Won!";
  }

  //Only works correctly with three towers
  isGameOver() {
    return (
      this.towers[1].size() === this.towerHeight ||
      this.towers[2].size() === this.towerHeight
    );
  }

  //Solves the game from any position.
  //Only works with three towers and for the moment only even amount of disks.

  async solver() {
    if (this.isGameOver()) {
      this.handleGameOver();
    } else {
      if (!this.moveTopDisk(1, 2)) {
        this.moveTopDisk(2, 1);
      }
      await this.delay(this.moveDelay);
      if (!this.moveTopDisk(1, 3)) {
        this.moveTopDisk(3, 1);
      }
      await this.delay(this.moveDelay);
      if (!this.moveTopDisk(2, 3)) {
        this.moveTopDisk(3, 2);
      }
      await this.delay(this.moveDelay);
      await this.solver();
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //"From" and "to" is the tower id
  moveTopDisk(from, to) {
    const towerFrom = this.towers[from - 1];
    const towerTo = this.towers[[to - 1]];
    // console.log(`From: ${from}, To: ${to}`);
    if (this.isValidMove(towerFrom, towerTo)) {
      towerTo.push(towerFrom.pop());
      this.moves++;
      this.display();
      if (this.isGameOver()) {
        this.handleGameOver();
      }
      return true;
    } else {
      console.log("Invalid move");
      document.querySelector("#movingFeedback").textContent = "Invalid Move";
      this.display();
      return false;
    }
  }

  isValidMove(towerFrom, towerTo) {
    return (
      towerFrom.peek() !== null &&
      (towerTo.peek() === null || towerTo.peek() > towerFrom.peek())
    );
  }

  display() {
    document.querySelector("#game").innerHTML = `
    <h3>Moves: <span id="moves">${this.moves}</span></h3>
    <div id="towers" style="grid-template-columns: repeat(${
      this.towerAmount
    }, 1fr); width: ${(this.towerHeight + 5) * this.towerAmount}0px"></div>
    `;
    for (let i = 0; i < this.towerAmount; i++) {
      document
        .querySelector("#towers")
        .insertAdjacentHTML(
          "beforeend",
          `<button id="tower${i + 1}" class="tower" style="height: ${
            this.towerHeight * 28
          }px; width: ${this.towerHeight + 7}0px" value="${i + 1}"></button>`
        );
      for (let j = this.towers[i].size() - 1; j >= 0; j--) {
        document
          .querySelector(`#tower${i + 1}`)
          .insertAdjacentHTML(
            "beforeend",
            `<div class="disk" style="width: ${
              this.towers[i].get(j) + 5
            }0px"></div>`
          );
      }
    }
    this.addEventListeners();
  }
}
