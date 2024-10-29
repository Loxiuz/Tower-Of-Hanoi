import Stack from "./stack.js";

window.addEventListener("load", () => {
  const controller = new Controller(3, 8);
  controller.init();
  window.controller = controller;
});

class Controller {
  constructor(towerAmount, towerHeight) {
    this.towerAmount = towerAmount;
    this.towerHeight = towerHeight;
    this.towers = [];
    this.moves = 0;
    this.clickedTower = 0;
  }

  init() {
    this.initTowers();
    this.displayBoard();
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

  eventListeners() {
    for (let i = 1; i <= this.towerAmount; i++) {
      document.querySelector(`#tower${i}`).addEventListener("click", (e) => {
        e.preventDefault();
        this.towerClicked(i);
      });
    }
  }

  towerClicked(tower) {
    console.log(`Tower ${tower} clicked!`);
    if (this.clickedTower === 0) {
      document.querySelector("#invalidMoveMsg").textContent = "---------------";
      document.querySelector("#towerFrom").textContent = "(click tower)";
      document.querySelector("#towerTo").textContent = "(click tower)";
      this.clickedTower = tower;
      document.querySelector("#towerFrom").textContent = tower;
    } else {
      const prevClickedTower = this.clickedTower;
      this.clickedTower = tower;
      document.querySelector("#towerTo").textContent = tower;
      this.moveTopDisk(prevClickedTower, this.clickedTower);
      this.clickedTower = 0;
    }
  }

  //"From" and "to" is the tower id
  moveTopDisk(from, to) {
    const towerFrom = this.towers[from - 1];
    const towerTo = this.towers[[to - 1]];
    if (
      towerFrom.peek() !== null &&
      (towerTo.peek() === null || towerTo.peek() > towerFrom.peek())
    ) {
      towerTo.push(towerFrom.pop());
      this.moves++;
      this.displayBoard();
      return 1;
    } else {
      console.log("Invalid move");
      document.querySelector("#invalidMoveMsg").textContent = "Invalid Move";
      this.displayBoard();
      return -1;
    }
  }

  displayBoard() {
    document.querySelector("#game").innerHTML = `
    <h3>Number of moves: <span id="moves">${this.moves}</span></h3>
    <div id="towers" style="grid-template-columns: repeat(${this.towerAmount}, 1fr)"></div>
    `;
    for (let i = 0; i < this.towerAmount; i++) {
      document
        .querySelector("#towers")
        .insertAdjacentHTML(
          "beforeend",
          `<div id="tower${i + 1}" class="tower" style="height: ${
            this.towerHeight * 26
          }px"></div>`
        );
      for (let j = this.towers[i].size() - 1; j >= 0; j--) {
        document
          .querySelector(`#tower${i + 1}`)
          .insertAdjacentHTML(
            "beforeend",
            `<div class="disk" style="width: ${
              this.towers[i].get(j) + 2
            }0px"></div>`
          );
      }
    }
    this.eventListeners();
  }
}
