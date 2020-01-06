<template>
  <div
    :style="style"
    :class="{ showborder: border, viewport: !split }"
    :ref="'container'"
  >
    <!-- <span>
      <p v-for="(value, index) in hitDetect">{{ index }} : {{ value }}</p>
    </span> -->
    <canvas
      :id="0"
      :key="0"
      :ref="'hit'"
      :name="'hit'"
      :height="canvasHeight"
      :width="canvasWidth"
    ></canvas>
    <canvas
      :id="1"
      :key="1"
      :ref="'item'"
      :name="'item'"
      :height="canvasHeight"
      :width="canvasWidth"
      :class="{ showborder: border }"
    ></canvas>
    <canvas
      :id="2"
      :key="2"
      :ref="'overlay'"
      :name="'overlay'"
      :height="canvasHeight"
      :width="canvasWidth"
      :class="{ showborder: border }"
    ></canvas>
    <canvas
      :id="3"
      :key="3"
      :ref="'text'"
      :name="'text'"
      :height="canvasHeight"
      :width="canvasWidth"
      v-on:click="hitCheck"
      v-on:mousemove="showHitLocationValues"
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
    this.addItem({ visible: true, count: 0, active: false, drawn: false }, 15) // visible is if image is shown, active is dim, count will be for bottle 'n shit
    this.addItem({ visible: true, count: 0, active: false, drawn: false }, 20)
    this.addItem({ visible: true, count: 0, active: false, drawn: false }, 24)
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
      const hitCtx = this.$refs.hit.getContext('2d')
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
          newCells.push({
            x1: cols * this.imageSize,
            y1: rows * this.imageSize,
            x2: cols * this.imageSize * 2,
            y2: rows * this.imageSize * 2,
            overlay: {
              darken: false
            }
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
      /* this should only be called once or when the whole table needs
          to be re-rendered. something else needs to ne done for resize calcuarions
      */

      // only render item (by id)
      let ctx = this.$refs.item.getContext('2d')

      for (const value in this.items) {
        const item = this.items[value]
        const cell = this.cells[value]

        // dont render if the cell doesnt exist in our current context
        if (typeof cell === 'undefined' || item.drawn) {
          continue
        }

        item.drawn = true
        // ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        // image

        ctx = this.$refs.item.getContext('2d')

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
          ctx = this.$refs.text.getContext('2d')
          ctx.font = '15px Arial'
          ctx.fillStyle = 'red'
          ctx.fillText(`${value}`, cell.x1 + 30, cell.y1 + 40)

          console.log('renderCells: image (%s)', value)
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

          console.log('renderCells: hitbox (%s)', value)
          // add hit color box
          ctx = this.$refs.hit.getContext('2d')

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
          ctx = this.$refs.overlay.getContext('2d')
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
        let ctx = this.$refs.item.getContext('2d')

        const item = this.items[value]
        const cell = this.cells[value]

        console.log('update', item, cell)

        // dont render if the cell doesnt exist in our current context
        if (typeof cell === 'undefined') {
          return
        }

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
            ctx = this.$refs.text.getContext('2d')
            ctx.font = '15px Arial'
            ctx.fillStyle = 'red'
            ctx.fillText(`${value}`, cell.x1 + 30, cell.y1 + 40)

            console.log('updateCell: image (%s)', value)
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

          console.log('updateCell: overlay (%s)', value)
          if (!item.active && !cell.overlay.darken) {
            // add a fake dim overlay
            ctx = this.$refs.overlay.getContext('2d')
            ctx.beginPath()
            ctx.lineWidth = '1'
            ctx.strokeStyle = 'black' // background color?
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            ctx.fillRect(cell.x1, cell.y1, this.imageSize, this.imageSize)
            cell.overlay.darken = true
          } else {
            ctx = this.$refs.overlay.getContext('2d')
            ctx.clearRect(cell.x1, cell.y1, this.imageSize, this.imageSize)
            cell.overlay.darken = false
          }
        }
      }
    },
    addItem(item, cell) {
      this.items[cell] = item
    },
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
