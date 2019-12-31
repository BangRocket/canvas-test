<template>
  <v-layout>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field v-model="canvasHeight" single-line solo></v-text-field>
        <v-text-field v-model="canvasWidth" single-line solo></v-text-field>
        <v-btn @click="refresh" large color="primary">Refresh Grid</v-btn>
      </v-col>
    </v-row>
    <v-flex>
      <ItemTable
        :ref="'table'"
        :width="canvasWidth"
        :height="canvasHeight"
        :border="border"
      >
      </ItemTable>
    </v-flex>
  </v-layout>
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
