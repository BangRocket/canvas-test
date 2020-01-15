import Item from '../scripts/item.js'

class Cell {
  constructor(dimensions, padding, x1, y1, x2, y2, hitColor) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2

    this.hitColor = hitColor

    this.draw = 0
    this.imageSize = dimensions
    this.padding = padding

    this.item = new Item()
  }
}

export default Cell
