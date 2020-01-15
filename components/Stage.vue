<!---
  Stage -   Collection of VCanvas elements making up the distinct layers of the
            itemTable/mapTable object.

            Handles sizing of VCanvas elements and event fire tracking related to clicks/hits
  --->
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
      :class="{ hitcheck: !split }"
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
    ></VCanvas>
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    hitCheck(e) {
      const hitList = this.getHits()
      const hitCtx = this.getHitContext()
      const pixel = hitCtx.getImageData(e.offsetX, e.offsetY, 1, 1).data
      const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`

      for (const hitbox in hitList) {
        if (hitList[hitbox] === color) {
          // make all the children "cells" react to this event
          console.log(hitbox)
          // this.items[hitbox].active = !this.items[hitbox].active
          // this.updateCell(hitbox)
        }
      }
    },
    ...mapGetters({
      getHitContext: 'canvas/getHitContext',
      getHits: 'cells/getHits'
    })
  }
}
</script>

<style scoped>
.viewport {
  position: relative;
}

.viewport canvas {
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
