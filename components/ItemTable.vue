<template>
  <div :style="style" :class="{ showborder: border }" class="viewport">
    <canvas
      :id="0"
      :key="0"
      :ref="'bg'"
      :name="'bg'"
      :height="canvasHeight"
      :width="canvasWidth"
    ></canvas>
    <canvas
      :id="1"
      :key="1"
      :ref="'poi'"
      :name="'poi'"
      :height="canvasHeight"
      :width="canvasWidth"
    ></canvas>
    <canvas
      :id="2"
      :key="2"
      :ref="'overlay'"
      :name="'overlay'"
      :height="canvasHeight"
      :width="canvasWidth"
    ></canvas>
    <canvas
      :id="3"
      :key="3"
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
    height: {
      type: [String, Number],
      default: 610
    },
    width: {
      type: [String, Number],
      default: 610
    }
  },
  data() {
    return {
      style: {
        // initial size of canvas/container
        height: this.height + 10 + 'px',
        width: this.width + 10 + 'px'
      },
      layername: 'canvas' + this.counter,
      counter: 0
    }
  },
  computed: {
    canvasHeight() {
      return this.height
    },
    canvasWidth() {
      return this.width
    }
  },
  watch: {
    height(val) {
      this.style.height = Number(val) + 10 + 'px'
    },
    width(val) {
      this.style.width = Number(val) + 10 + 'px'
    }
  },
  created() {},
  mounted() {
    for (const canvas in this.$refs) {
      const ctx = this.$refs[canvas].getContext('2d')
      ctx.font = '30px Arial'
      ctx.fillStyle = 'yellow'
      // ctx.fillText(`${canvas}`, 10, 50 * this.counter + 50)
      this.context({ layer: canvas, context: ctx })
      this.counter++
    }
    this.renderGrid()
  },
  provide() {},
  methods: {
    renderGrid() {
      const rows = []
      const cols = []
      const cells = []

      const imageHeight = 64
      const imageWidth = 64

      const imagePadding = 10

      // these need to minimum at 64px?
      const itemsPerRow = Math.floor(
        this.canvasHeight / (imageHeight + imagePadding * 2)
      )
      const itemsPerCol = Math.floor(
        this.canvasWidth / (imageWidth + imagePadding * 2)
      )

      // console.log(itemsPerRow, itemsPerCol)

      // itemContainer is going to be IPR/C divided by width/height

      let itemContainerWidth = this.canvasHeight / itemsPerRow
      let itemContainerHeight = this.canvasWidth / itemsPerCol

      // console.log(itemContainerWidth, itemContainerHeight)

      let currentCol = 0
      let currentRow = 0

      for (let x = 0; x < itemsPerCol; x++) {
        cols.push(currentCol)
        currentCol += itemContainerWidth
      }

      for (let y = 0; y < itemsPerRow; y++) {
        rows.push(currentRow)
        currentRow += itemContainerHeight
      }

      const hDiff = currentRow - this.canvasHeight
      const wDiff = currentCol - this.canvasWidth

      console.log('height diff: ', hDiff)
      console.log('width diff: ', wDiff)

      if (Math.sign(currentCol - this.canvasWidth) === 1) {
        console.log('wdiff')

        const addWVal = Math.floor(wDiff / itemsPerCol)
        const addWVal2 = Math.floor(wDiff / (itemsPerCol - 1) - addWVal)

        console.log(addWVal, addWVal2)

        itemContainerHeight += addWVal + addWVal2
        cols.forEach((col, index) => {
          if (index === 0) return
          rows[index] = col + addWVal2
        })
      }

      if (Math.sign(currentRow - this.height) === 1) {
        console.log('hdiff')

        const addHVal = Math.floor(hDiff / itemsPerRow)
        const addHVal2 = Math.floor(hDiff / (itemsPerRow - 1) - addHVal)

        itemContainerWidth += addHVal + addHVal2
        rows.forEach((row, index) => {
          if (index === 0) {
            return
          }
          cols[index] = row + addHVal2
        })
      }
      const ctx = this.$refs.bg.getContext('2d')

      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      console.log('rows', rows)
      console.log('cols', cols)

      for (const col of cols) {
        for (const row of rows) {
          // console.log(
          //   'col: ',
          //   col,
          //   'row: ',
          //   row,
          //   'canvas: ',
          //   this.height,
          //   this.width
          // )
          ctx.beginPath()
          ctx.lineWidth = '4'
          ctx.strokeStyle = 'blue'
          ctx.rect(col, row, itemContainerWidth, itemContainerHeight)
          ctx.stroke()
          cells.push({
            x1: col,
            y1: row,
            x2: col + itemContainerWidth,
            y2: row + itemContainerHeight
          })

          const imageColLoc = col - imageHeight + (imageHeight + imagePadding)
          const imageRowLoc = row - imageWidth + (imageWidth + imagePadding)

          console.log(imageColLoc, imageRowLoc)

          ctx.beginPath()
          ctx.lineWidth = '4'
          ctx.strokeStyle = 'yellow'
          ctx.rect(
            col + imagePadding + 10,
            row + imagePadding,
            imageWidth,
            imageHeight
          )
          ctx.stroke()
        }
      }
      console.log(cells)
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

canvas {
  background-color: transparent;
}

.showborder {
  border: 5px solid red;
}
</style>
