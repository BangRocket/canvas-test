<!---
  VCanvas - Vue friendly version of a canvas element, saves context to store
            and provides for local injection
  --->
<template>
  <canvas
    :id="id"
    :key="id"
    :ref="name"
    :name="name"
    :height="canvasHeight"
    :width="canvasWidth"
    ><slot></slot
  ></canvas>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    id: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: 'hit'
    },
    height: {
      type: [String, Number],
      default: 500
    },
    width: {
      type: [String, Number],
      default: 500
    }
  },
  data() {
    return {
      context: null,
      draw: 0
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
  provide() {
    return {
      context: this.context
    }
  },
  mounted() {
    // locally set our context (for provider and reactivity)
    this.context = this.$refs[this.name].getContext('2d')

    // globally store our context in the store
    this.setContext({
      layer: this.name,
      context: this.$refs[this.name].getContext('2d')
    })
  },
  methods: {
    ...mapMutations({
      setContext: 'canvas/setContext'
    })
  }
}
</script>

<style scoped></style>
