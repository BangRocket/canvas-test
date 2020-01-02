<template>
  <div>
    <v-row>
      <v-col cols="2">
        <v-col cols="12">
          <v-subheader class="pl-0">Height</v-subheader>
          <v-slider v-model="canvasHeight" thumb-label max="1000"></v-slider
          ><v-text-field v-model="canvasHeight" single-line solo></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-subheader class="pl-0">Width</v-subheader>
          <v-slider v-model="canvasWidth" thumb-label max="1000"></v-slider
          ><v-text-field v-model="canvasWidth" single-line solo></v-text-field>
        </v-col>

        <v-btn @click="refresh" x-large color="primary">Refresh Grid</v-btn>
      </v-col>
      <v-col cols="10">
        <ItemTable
          :ref="'table'"
          :width="canvasWidth"
          :height="canvasHeight"
          :border="border"
        >
        </ItemTable>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ItemTable from '../components/ItemTable.vue'

export default {
  name: 'CanvasPage',
  components: { ItemTable },
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
      default: 300
    },
    width: {
      type: Number,
      default: 600
    }
  },
  data() {
    return {
      canvasHeight: this.height,
      canvasWidth: this.width
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
