<template>
  <div
    :style="style"
    :class="{ showborder: border, viewport: !split }"
    :ref="'container'"
  >
    <canvas
      :id="0"
      :key="0"
      :ref="'item'"
      :name="'item'"
      :height="canvasHeight"
      :width="canvasWidth"
      :class="{ showborder: border }"
    ></canvas>
    <canvas
      :id="1"
      :key="1"
      :ref="'overlay'"
      :name="'overlay'"
      :height="canvasHeight"
      :width="canvasWidth"
      :class="{ showborder: border }"
    ></canvas>
    <canvas
      :id="2"
      :key="2"
      :ref="'text'"
      :name="'text'"
      :height="canvasHeight"
      :width="canvasWidth"
    ></canvas>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'ItemTable',
  components: {},
  props: {
    id: {
      type: String,
      default: 'itemTable'
    },
    border: {
      type: Boolean,
      default: true
    },
    split: {
      type: Boolean,
      default: false
    },
    height: {
      type: [String, Number],
      default: 5
    },
    width: {
      type: [String, Number],
      default: 5
    },
    padding: {
      type: [String, Number],
      default: 10
    },
    frameH: {
      type: [String, Number],
      default: 500
    },
    frameW: {
      type: [String, Number],
      default: 500
    }
  },
  data() {
    return {
      cellCount: this.width * this.height,
      layername: 'canvas' + this.counter,
      counter: 0,
      cells: [], // base element for grid
      items: [] // elements on grid
    }
  },
  computed: {
    canvasHeight() {
      return this.height * this.imageSize
    },
    canvasWidth() {
      return this.width * this.imageSize
    },
    imageSize() {
      return 64
    },
    style() {
      return {
        // initial size of canvas/container
        height: this.frameH + 'px',
        width: this.frameW + 'px'
      }
    }
  },
  watch: {
    frameH(val) {
      this.style.frameH = Number(val) + 'px'
    },
    frameW(val) {
      this.style.frameW = Number(val) + 'px'
    }
  },
  created() {},
  mounted() {
    this.calculateCells()
    this.addItem({ visible: true, count: 0, active: true }, 15) // visible is if image is shown, active is dim, count will be for bottle 'n shit
    this.addItem({ visible: false, count: 0, active: false }, 20)
    this.renderCells()

    // 2, 11, 16, 19, 31
    // this.updateCells([1, 15, 18, 10, 30])
  },
  updated() {
    this.calculateCells()
    this.renderCells()
  },
  provide() {},
  methods: {
    /*
      calculateCells -- figures out how many cells we can fit, where they should start and stop based on canvas
      renderCells -- renders the cells including the item it contains
      updateCell(cell, event) - re-renders a specific cell for a reason (user click, mode change, window resize, etc)
      updateCells(cell, event) - re-renders group of specific cells for a reason (user click, mode change, window resize, etc)

      addItem(item, cell) -- adds an item to a specific cell
      addItems(array[kvp]) -- adds a collection of item to specific cells

      removeItem(item, cell) -- removes an item to a specific cell
      removeItems(array[kvp]) -- removes a collection of items from specific cells

      updateItem(item, cell) -- update an item of a specific cell (changes item information/image)
      updateItems(array[kvp]) -- update a collection of items in specific cells (changes item information/image)

    */
    calculateCells() {
      const newCells = []
      let cellCounter = 0

      for (let cols = 0; cols < this.width; cols++) {
        if ((cols * this.imageSize) / this.frameW > 0.8) {
          continue
        }
        for (let rows = 0; rows < this.height; rows++) {
          if ((rows * this.imageSize) / this.frameH > 0.8) {
            continue
          }
          // instead of drawing, lets just save the location of this cell
          newCells.push({
            x1: cols * this.imageSize,
            y1: rows * this.imageSize,
            x2: cols * this.imageSize * 2,
            y2: rows * this.imageSize * 2
          })
          cellCounter = cellCounter + 1
        }
      }

      // compare what we just calculated to what we had (using JSON hackery)
      if (
        JSON.stringify(this.cells).localeCompare(JSON.stringify(newCells)) !== 0
      ) {
        this.cells = newCells
        this.renderCells()
      }
    },
    renderCells() {
      // only render item (by id)
      let ctx = this.$refs.item.getContext('2d')

      for (const value in this.items) {
        const item = this.items[value]
        const cell = this.cells[value]
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        // image

        ctx = this.$refs.item.getContext('2d')

        // if (item.active) {
        ctx.beginPath()
        ctx.lineWidth = '1'
        ctx.strokeStyle = 'blue'
        ctx.rect(cell.x1, cell.y1, this.imageSize, this.imageSize)
        ctx.stroke()
        // }

        if (item.visible) {
          ctx = this.$refs.item.getContext('2d')

          ctx.beginPath()
          ctx.lineWidth = '1'
          ctx.strokeStyle = 'yellow'
          ctx.fillStyle = 'yellow'
          ctx.fillRect(
            cell.x1 + this.padding / 2,
            cell.y1 + this.padding / 2,
            this.imageSize - this.padding,
            this.imageSize - this.padding
          )
          ctx.stroke()
        }
        // sanity check
        ctx = this.$refs.text.getContext('2d')
        ctx.font = '15px Arial'
        ctx.fillStyle = 'red'
        ctx.fillText(`${value}`, cell.x1 + 30, cell.y1 + 40)

        if (!item.active) {
          // add a fake dim overlay
          ctx = this.$refs.overlay.getContext('2d')
          ctx.beginPath()
          ctx.lineWidth = '1'
          ctx.strokeStyle = 'black' // background color?
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
          ctx.fillRect(cell.x1, cell.y1, this.imageSize, this.imageSize)

          // adding something after drawing the above layer
          ctx = this.$refs.item.getContext('2d')
          ctx.beginPath()
          ctx.lineWidth = '1'
          ctx.strokeStyle = 'purple'
          ctx.fillStyle = 'purple'
          ctx.fillRect(cell.x1 + 20, cell.y1 + 20, 20, 20)
          ctx.stroke()
        }
        // remove the fake overlay
        // if (!item.active) {
        //   // add a fake dim overlay
        //   ctx = this.$refs.overlay.getContext('2d')
        //   ctx.clearRect(cell.x1, cell.y1, this.imageSize, this.imageSize)
        // }
      }

      // this loop is for the item rendering itself
    },

    updateCells(cells) {
      for (const cell of cells) {
        this.updateCell(cell)
      }
    },
    updateCell(cell) {
      if (cell > 0) {
        const ctx = this.$refs.item.getContext('2d')

        const currentCell = this.cells[cell]
        this.items[cell] = true

        // this will add it to the "visible list" but not render it unless its relevent
        if (cell <= this.cells.length) {
          let rendercounter = cell
          ctx.clearRect(
            currentCell.x1,
            currentCell.y1,
            this.imageSize,
            this.imageSize
          )
          console.log(currentCell.x1, currentCell.y1)
          // cell
          ctx.beginPath()
          ctx.lineWidth = '1'
          ctx.strokeStyle = 'blue'
          ctx.rect(
            currentCell.x1,
            currentCell.y1,
            this.imageSize,
            this.imageSize
          )
          ctx.stroke()

          // image
          ctx.font = '15px Arial'
          ctx.fillStyle = 'red'
          ctx.fillText(
            `${rendercounter + 1}`,
            currentCell.x1 + 30,
            currentCell.y1 + 40
          )
          rendercounter = rendercounter + 1
          ctx.beginPath()
          ctx.lineWidth = '1'
          ctx.strokeStyle = 'yellow'
          ctx.rect(
            currentCell.x1 + this.padding / 2,
            currentCell.y1 + this.padding / 2,
            this.imageSize - this.padding,
            this.imageSize - this.padding
          )
          ctx.stroke()
        }
      }
      console.log(this.cells)
    },
    addItem(item, cell) {
      this.items[cell] = item
    },

    renderItems() {
      const ctx = this.$refs.item.getContext('2d')
      const rendercounter = 1
      for (const cell of this.cells) {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        // image
        ctx.font = '15px Arial'
        ctx.fillStyle = 'red'
        ctx.fillText(`${rendercounter}`, cell.x1 + 30, cell.y1 + 40)

        ctx.beginPath()
        ctx.lineWidth = '1'
        ctx.strokeStyle = 'yellow'
        ctx.rect(
          cell.x1 + this.padding / 2,
          cell.y1 + this.padding / 2,
          this.imageSize - this.padding,
          this.imageSize - this.padding
        )
        ctx.stroke()
      }
    }, // draws image to cell
    ...mapMutations({
      context: 'canvas/setContext'
    })
  }
}
</script>

<style scoped>
.viewport {
  /**
      * Position relative so that canvas elements
      * inside of it will be relative to the parent
      */
  position: relative;
}

.viewport canvas {
  /**
      * Position absolute provides canvases to be able
      * to be layered on top of each other
      * Be sure to remember a z-index!
      */
  position: absolute;
}

.debug .viewport canvas {
  position: relative !important;
}

canvas {
  background-color: transparent;
}

.showborder canvas {
  border: 1px solid lime;
}

.showborder {
  border: 1px solid red;
}
</style>
