<template>
  <span><slot></slot></span>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import Cell from '../../scripts/cell.js'

export default {
  name: 'Cell',
  components: {},
  props: {
    id: {
      type: String,
      default: 'cell'
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
    dimensions: {
      type: [String, Number],
      default: 64
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
      draw: 0,
      cells: [], // base element for grid
      items: [], // elements on grid
      hits: []
    }
  },
  computed: {
    imageSize() {
      return this.dimensions + this.padding
    },
    canvasHeight() {
      if (
        Math.floor((this.frameH / this.imageSize) * this.imageSize) <
        this.height * this.imageSize
      ) {
        return Math.floor((this.frameH / this.imageSize) * this.imageSize) - 1
      }
      return this.height * this.imageSize
    },
    canvasWidth() {
      if (
        Math.floor((this.frameW / this.imageSize) * this.imageSize) <
        this.width * this.imageSize
      ) {
        return Math.floor((this.frameW / this.imageSize) * this.imageSize)
      }
      return this.width * this.imageSize
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
  },
  updated() {
    this.calculateCells()
    this.renderCells()
  },
  provide: {},
  methods: {
    hitCheck(e) {
      const hitCtx = this.getHitContext()
      const pixel = hitCtx.getImageData(e.offsetX, e.offsetY, 1, 1).data
      const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`

      for (const hitbox in this.hits) {
        if (this.hits[hitbox] === color) {
          console.log(hitbox)
          // this.items[hitbox].active = !this.items[hitbox].active
          this.updateCell(hitbox)
        }
      }
      // console.log(color)
    },
    getRandomColor() {
      const r = Math.round(Math.random() * 255)
      const g = Math.round(Math.random() * 255)
      const b = Math.round(Math.random() * 255)
      return `rgb(${r},${g},${b})`
    },
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
          const cell = new Cell(
            this.dimensions,
            this.padding,
            cols * this.imageSize,
            rows * this.imageSize,
            cols * this.imageSize * 2,
            rows * this.imageSize * 2
          )
          newCells.push(cell)
          cellCounter = cellCounter + 1
        }
      }

      // compare what we just calculated to what we had (using JSON hackery)
      if (
        JSON.stringify(this.cells).localeCompare(JSON.stringify(newCells)) !== 0
      ) {
        this.cells = newCells
        this.saveCell(newCells)
        this.renderCells()
      }
    },
    renderCells() {
      /* this should only be called once or when the whole table needs
          to be re-rendered. something else needs to ne done for resize calcuarions
      */
      let ctx = this.getItemContext()

      for (const value in this.cells) {
        const cell = this.cells[value]

        // dont render if the cell doesnt exist in our current view
        if (typeof cell === 'undefined') {
          continue
        }

        ctx = this.getBackgroundContext()

        if (this.border) {
          // console.log('renderCells: border (%s)', value)
          ctx = this.getBackgroundContext()
          ctx.beginPath()
          ctx.lineWidth = '1'
          ctx.strokeStyle = 'blue'
          ctx.rect(cell.x1, cell.y1, this.imageSize, this.imageSize)
          ctx.stroke()

          // console.log('renderCells: text (%s)', value)
          // sanity check
          ctx = this.getTextContext()
          ctx.font = '15px Arial'
          ctx.fillStyle = 'red'
          ctx.fillText(`${value}`, cell.x1 + 30, cell.y1 + 40)
        }

        // console.log('renderCells: hitbox (%s)', value)
        // add hit color box
        ctx = this.getHitContext()

        ctx.beginPath()
        ctx.lineWidth = '1'
        const hitColor = this.getRandomColor()
        this.hits[value] = hitColor
        ctx.strokeStyle = hitColor
        ctx.fillStyle = hitColor
        ctx.fillRect(
          cell.x1 + this.padding / 2,
          cell.y1 + this.padding / 2,
          this.imageSize - this.padding,
          this.imageSize - this.padding
        )
        ctx.stroke()
      }
    },

    updateCells(cells) {
      for (const cell of cells) {
        this.updateCell(cell)
      }
    },
    updateCell(value) {
      // maybe we should pass specific things to update into this? is it faster? does it matter?
      if (value >= 0) {
        let ctx = this.getItemContext()

        const cell = this.cells[value]

        // dont render if the cell doesnt exist in our current view
        if (typeof cell === 'undefined') {
          return
        }

        // this will add it to the "visible list" but not render it unless its relevent
        if (value <= this.cells.length) {
          if (this.border) {
            // console.log('renderCells: border (%s)', value)
            ctx = this.getBackgroundContext()
            ctx.beginPath()
            ctx.lineWidth = '1'
            ctx.strokeStyle = 'blue'
            ctx.rect(cell.x1, cell.y1, this.imageSize, this.imageSize)
            ctx.stroke()

            // console.log('renderCells: text (%s)', value)
            // sanity check
            ctx = this.getTextContext()
            ctx.font = '15px Arial'
            ctx.fillStyle = 'red'
            ctx.fillText(`${value}`, cell.x1 + 30, cell.y1 + 40)
          }
        }
      }
    },
    ...mapMutations({
      context: 'canvas/setContext',
      saveCell: 'cells/registerCells'
    }),
    ...mapGetters({
      getBackgroundContext: 'canvas/getBackgroundContext',
      getHitContext: 'canvas/getHitContext',
      getTextContext: 'canvas/getTextContext',
      getItemContext: 'canvas/getItemContext',
      getOverlayContext: 'canvas/getOverlayContext'
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

.hitcheck {
  display: none;
}
</style>
