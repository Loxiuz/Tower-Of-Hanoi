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
  }

  init() {
    //Add event listeners
    this.initTowers();
    this.displayBoard();
  }

  initTowers() {
    for (let i = 0; i < this.towerAmount; i++) {
      this.towers[i] = new Stack();
    }
    //Pushes the disks to the first tower
    for (let i = this.towerHeight; i > 0; i--) {
      this.towers[0].push(i);
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
    } else {
      console.log("Invalid move");
    }
    this.displayBoard();
  }

  displayBoard() {
    document.querySelector("#game").innerHTML = `
    <h3>
      Moving disk from tower: <span id="towerFrom">(click tower)</span> to tower:
      <span id="towerTo">(click tower)</span>
    </h3>
    <div id="towers" style="grid-template-columns: repeat(${this.towerAmount}, 1fr)"></div>
    `;
    for (let i = 0; i < this.towerAmount; i++) {
      document
        .querySelector("#towers")
        .insertAdjacentHTML(
          "beforeend",
          `<div id="tower${i + 1}" class="tower"></div>`
        );
      for (let j = this.towers[i].size() - 1; j >= 0; j--) {
        document
          .querySelector(`#tower${i + 1}`)
          .insertAdjacentHTML(
            "beforeend",
            `<div class="disk" style="width: ${
              this.towers[i].get(j) + 3
            }0px"></div>`
          );
      }
    }
  }
}
