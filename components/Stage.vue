<template>
  <div
    :style="style"
    :class="{ showborder: border, viewport: !split }"
    :ref="'container'"
  >
    <VCanvas
      :id="0"
      :key="0"
      :ref="'hit'"
      :name="'hit'"
      :height="canvasHeight"
      :width="canvasWidth"
      class="hitcheck"
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
      v-on:click.native=""
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
    return {}
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
  mounted() {},
  updated() {},
  provide: {},
  methods: {
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
