export default class Stack {
  constructor() {
    this.tail = null;
    this.length = 0;
  }

  push(data) {
    const node = { prev: null, data: data };
    if (!this.tail) {
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail = node;
    }
    this.length++;
    return this;
  }

  pop() {
    const node = this.tail;
    this.tail = this.tail.prev;
    this.length--;
    return node.data;
  }

  peek() {
    if (this.tail !== null) {
      return this.tail.data;
    } else {
      return null;
    }
  }

  size() {
    return this.length;
  }

  get(index) {
    if (this.length === 0) {
      console.log("List empty!");
      return;
    }

    if (index < 0 || index >= this.length) {
      console.log("Invalid index");
      return;
    }

    let i = 0;
    let node = this.tail;
    while (i !== index) {
      node = node.prev;
      i++;
    }
    return node.data;
  }
}
