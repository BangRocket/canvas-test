class Item {
  constructor(cell, padding, imageURL) {
    this.name = ''

    this.countMax = 0
    this.countMin = 0
    this.count = 0

    this.active = false

    // visible is if image is shown
    this.visible = true

    this.overlay = {
      darken: false,
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0
    }
  }
}

export default Item
