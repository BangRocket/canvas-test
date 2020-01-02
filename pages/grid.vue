<template>
  <div>
    <v-row>
      <v-col cols="2">
        <v-col cols="12">
          <v-subheader class="pl-0">Container Height</v-subheader>
          <v-slider v-model="containerHeight" thumb-label max="1000"></v-slider
          ><v-text-field
            v-model="containerHeight"
            single-line
            solo
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-subheader class="pl-0">Container Width</v-subheader>
          <v-slider v-model="containerWidth" thumb-label max="1000"></v-slider
          ><v-text-field
            v-model="containerWidth"
            single-line
            solo
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-subheader class="pl-0">Canvas Height</v-subheader>
          <v-slider v-model="canvasHeight" thumb-label max="10"></v-slider
          ><v-text-field v-model="canvasHeight" single-line solo></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-subheader class="pl-0">Canvas Width</v-subheader>
          <v-slider v-model="canvasWidth" thumb-label max="10"></v-slider
          ><v-text-field v-model="canvasWidth" single-line solo></v-text-field>
        </v-col>
      </v-col>
      <v-col cols="10">
        <ItemGrid
          :ref="'table'"
          :width="canvasWidth"
          :height="canvasHeight"
          :frameW="containerWidth"
          :frameH="containerHeight"
          :border="border"
        >
        </ItemGrid>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ItemGrid from '../components/ItemGrid.vue'

export default {
  name: 'CanvasPage',
  components: { ItemGrid },
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
      default: 5
    },
    width: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      canvasHeight: this.height,
      canvasWidth: this.width,
      containerHeight: 500,
      containerWidth: 500
    }
  },
  computed: {},
  created() {},
  mounted() {
    console.log(this)
  },
  methods: {
    refresh() {
      this.$refs.table.renderGrid()
    }
  }
}
</script>

<style scoped></style>
