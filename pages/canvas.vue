<template>
  <v-layout>
    <v-flex>
      <div :style="style" :class="{ showborder: border }" class="viewport">
        <canvas
          :id="0"
          :key="0"
          :ref="'bg'"
          :name="'bg'"
          :height="height"
          :width="width"
        ></canvas>
        <canvas
          :id="1"
          :key="1"
          :ref="'poi'"
          :name="'poi'"
          :height="height"
          :width="width"
        ></canvas>
        <canvas
          :id="2"
          :key="2"
          :ref="'overlay'"
          :name="'overlay'"
          :height="height"
          :width="width"
        ></canvas>
        <canvas
          :id="3"
          :key="3"
          :ref="'text'"
          :name="'text'"
          :height="height"
          :width="width"
        ></canvas>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'LightWorldMap',
  components: {},
  props: {
    id: {
      type: [String],
      default: 'lightworldmap'
    },
    border: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 500
    },
    width: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      style: {
        // initial size of canvas/container
        height: this.height + 'px',
        width: this.width + 'px'
      },
      layername: 'canvas' + this.counter,
      counter: 0
    }
  },
  computed: {},
  created() {},
  mounted() {
    for (const canvas in this.$refs) {
      const ctx = this.$refs[canvas].getContext('2d')
      ctx.font = '30px Arial'
      ctx.fillStyle = 'yellow'
      ctx.fillText(`${canvas}`, 10, 50 * this.counter + 50)
      this.context({ layer: canvas, context: ctx })
      this.counter++
    }
  },
  provide() {
    return {
      layers: this.$refs
    }
  },
  methods: {
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
