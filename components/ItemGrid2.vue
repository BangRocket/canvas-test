<template>
  <div
    :style="style"
    :class="{ showborder: border, viewport: !split }"
    :ref="'container'"
  >
    <!-- <span>
      <p v-for="(value, index) in hitDetect">{{ index }} : {{ value }}</p>
    </span> -->
    <VCanvas
      :id="0"
      :key="0"
      :ref="'hit'"
      :name="'hit'"
      :height="canvasHeight"
      :width="canvasWidth"
    ></VCanvas>
    <VCanvas
      :id="1"
      :key="1"
      :ref="'bg'"
      :name="'bg'"
      :height="canvasHeight"
      :width="canvasWidth"
      :class="{ showborder: border }"
    ></VCanvas>
    <VCanvas
      :id="2"
      :key="2"
      :ref="'item'"
      :name="'item'"
      :height="canvasHeight"
      :width="canvasWidth"
      :class="{ showborder: border }"
    ></VCanvas>
    <VCanvas
      :id="3"
      :key="3"
      :ref="'overlay'"
      :name="'overlay'"
      :height="canvasHeight"
      :width="canvasWidth"
      :class="{ showborder: border }"
    ></VCanvas>
    <VCanvas
      :id="4"
      :key="4"
      :ref="'text'"
      :name="'text'"
      :height="canvasHeight"
      :width="canvasWidth"
      v-on:click.native="hitCheck"
      v-on:mousemove.native="showHitLocationValues"
    ></VCanvas>
    <slot></slot>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import VCanvas from '../components/canvas/VCanvas.vue'

export default {
  name: 'ItemTable',
  components: {
    VCanvas
  },
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
      draw: 0,
      cells: [], // base element for grid
      items: [], // elements on grid
      hits: [],
      hitDetect: {
        clientX: 0,
        clientY: 0,
        offsetX: 0,
        offsetY: 0
      }
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

    const item = [
      { item: new Item(), cell: 13 },
      { item: new Item(), cell: 15 },
      { item: new Item(), cell: 20 },
      { item: new Item(), cell: 24 }
    ]
    this.addItems(item)

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
    showHitLocationValues(e) {
      this.hitDetect.clientX = e.clientX
      this.hitDetect.clientY = e.clientY
      this.hitDetect.offsetX = e.offsetX
      this.hitDetect.offsetY = e.offsetY
    },
    hitCheck(e) {
      console.log('holy dang')
      const hitCtx = this.getHitContext()
      const pixel = hitCtx.getImageData(e.offsetX, e.offsetY, 1, 1).data
      const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`

      for (const hitbox in this.hits) {
        if (this.hits[hitbox] === color) {
          console.log(hitbox)
          this.items[hitbox].active = !this.items[hitbox].active
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
        this.renderCells()
      }
    },
    renderCells() {
      /* this should only be called once or when the whole table needs
          to be re-rendered. something else needs to ne done for resize calcuarions
      */
      let ctx = this.getItemContext()

      for (const value in this.items) {
        const cell = this.cells[value]
        const item = cell.item

        // dont render if the cell doesnt exist in our current view
        if (typeof cell === 'undefined' || item.drawn) {
          continue
        }

        item.drawn = true
        // ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        // image

        ctx = this.getItemContext()

        if (this.border) {
          console.log('renderCells: border (%s)', value)
          ctx.beginPath()
          ctx.lineWidth = '1'
          ctx.strokeStyle = 'blue'
          ctx.rect(cell.x1, cell.y1, this.imageSize, this.imageSize)
          ctx.stroke()
        }

        if (item.visible) {
          console.log('renderCells: text (%s)', value)
          // sanity check
          ctx = this.getTextContext()
          ctx.font = '15px Arial'
          ctx.fillStyle = 'red'
          ctx.fillText(`${value}`, cell.x1 + 30, cell.y1 + 40)

          console.log('renderCells: image (%s)', value)
          ctx = this.getItemContext()
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

          console.log('renderCells: hitbox (%s)', value)
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

        console.log('renderCells: overlay (%s)', value)
        if (!item.active && !cell.overlay.darken) {
          // add a fake dim overlay
          ctx = this.getOverlayContext()
          ctx.beginPath()
          ctx.lineWidth = '1'
          ctx.strokeStyle = 'black' // background color?
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
          ctx.fillRect(cell.x1, cell.y1, this.imageSize, this.imageSize)
          cell.overlay.darken = true

          // // adding something after drawing the above layer
          // ctx = this.$refs.item.getContext('2d')
          // ctx.beginPath()
          // ctx.lineWidth = '1'
          // ctx.strokeStyle = 'purple'
          // ctx.fillStyle = 'purple'
          // ctx.fillRect(cell.x1 + 20, cell.y1 + 20, 20, 20)
          // ctx.stroke()

          // remove the fake overlay
          // if (!item.active) {
          //   // add a fake dim overlay
          //   ctx = this.$refs.overlay.getContext('2d')
          //   ctx.clearRect(cell.x1, cell.y1, this.imageSize, this.imageSize)
          // }
        }
      }
    },

    updateCells(cells) {
      for (const cell of cells) {
        this.updateCell(cell)
      }
    },
    updateCell(value) {
      // maybe we should pass specific things to update into this? is it faster? does it matter?
      if (value > 0) {
        let ctx = this.getItemContext()

        const cell = this.cells[value]

        // dont render if the cell doesnt exist in our current view
        if (typeof cell === 'undefined') {
          return
        }

        const item = cell.item

        // this will add it to the "visible list" but not render it unless its relevent
        if (value <= this.cells.length) {
          if (this.border) {
            console.log('updateCell: border (%s)', value)
            ctx.beginPath()
            ctx.lineWidth = '1'
            ctx.strokeStyle = 'blue'
            ctx.rect(cell.x1, cell.y1, this.imageSize, this.imageSize)
            ctx.stroke()
          }

          if (item.visible) {
            console.log('updateCell: text (%s)', value)
            // sanity check
            ctx = this.getTextContext()
            ctx.font = '15px Arial'
            ctx.fillStyle = 'red'
            ctx.fillText(`${value}`, cell.x1 + 30, cell.y1 + 40)

            console.log('updateCell: image (%s)', value)
            ctx = this.getItemContext()
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

          console.log('updateCell: overlay (%s)', value)
          if (!item.active && !cell.overlay.darken) {
            // add a fake dim overlay
            ctx = this.getOverlayContext()
            ctx.beginPath()
            ctx.lineWidth = '1'
            ctx.strokeStyle = 'black' // background color?
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            ctx.fillRect(cell.x1, cell.y1, this.imageSize, this.imageSize)
            cell.overlay.darken = true
          } else {
            ctx = this.getOverlayContext()
            ctx.clearRect(cell.x1, cell.y1, this.imageSize, this.imageSize)
            cell.overlay.darken = false
          }
        }
      }
    },
    addItems(items) {
      for (const item of items) {
        this.addItem(item.item, item.cell)
      }
    },
    addItem(item, cell) {
      console.log(item)
      this.items[cell] = item // we just need a "render list"
      this.cells[cell].item = item
      // maybe we wont need this
      this.cells[cell].item.parent = cell
    },
    ...mapMutations({
      context: 'canvas/setContext'
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

class Cell {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2

    this.draw = 0
    this.item = new Item()

    this.overlay = {
      darken: false
    }
  }
}

class Item {
  constructor(cell, padding, imageURL) {
    // we need to remove these
    this.parent = cell
    this.padding = padding || 0

    // visible is if image is shown, active is dim, count will be for bottle 'n shit
    this.visible = true
    this.count = 0
    this.active = false
    this.drawn = false
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
