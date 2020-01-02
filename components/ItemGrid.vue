<template>
  <div
    :style="style"
    :class="{ showborder: border }"
    :ref="'container'"
    class="viewport"
  >
    <canvas
      :id="0"
      :key="0"
      :ref="'bg'"
      :name="'bg'"
      :height="canvasHeight"
      :width="canvasWidth"
      :class="{ showborder: border }"
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
      layername: 'canvas' + this.counter,
      counter: 0
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
    // for (const canvas in this.$refs) {
    //   const ctx = this.$refs[canvas].getContext('2d')
    //   ctx.font = '30px Arial'
    //   ctx.fillStyle = 'yellow'
    //   ctx.fillText(`${canvas}`, 10, 50 * this.counter + 50)
    //   this.context({ layer: canvas, context: ctx })
    //   this.counter++
    // }
    this.renderGrid()
  },
  updated() {
    this.renderGrid()
  },
  provide() {},
  methods: {
    renderGrid() {
      const ctx = this.$refs.bg.getContext('2d')

      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

      console.log(this.$refs.bg.width, this.frameW)
      console.log(this.$refs.bg.width / this.frameW)

      for (let cols = 0; cols < this.width; cols++) {
        if ((cols * this.imageSize) / this.frameW > 0.8) {
          continue
        }
        for (let rows = 0; rows < this.height; rows++) {
          if ((rows * this.imageSize) / this.frameH > 0.8) {
            continue
          }
          // cell
          ctx.beginPath()
          ctx.lineWidth = '1'
          ctx.strokeStyle = 'blue'
          ctx.rect(
            cols * this.imageSize,
            rows * this.imageSize,
            this.imageSize,
            this.imageSize
          )
          ctx.stroke()

          // image
          ctx.beginPath()
          ctx.lineWidth = '1'
          ctx.strokeStyle = 'yellow'
          ctx.rect(
            cols * this.imageSize + this.padding / 2,
            rows * this.imageSize + this.padding / 2,
            this.imageSize - this.padding,
            this.imageSize - this.padding
          )
          ctx.stroke()
        }
      }
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

.showborder canvas {
  border: 1px solid lime;
}

.showborder {
  border: 1px solid red;
}
</style>
