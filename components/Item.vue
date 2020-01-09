<script>
// import Item from '../scripts/item.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Item',
  props: {
    loc: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: 'blank'
    },
    value: {
      type: [Boolean, Number],
      default: false
    },
    layer: {
      type: String,
      default: 'item'
    }
  },
  computed: {},
  methods: {
    backgroundImage() {
      if (this.name === 'blank') {
        return 'none'
      } else if (typeof this.value === 'boolean') {
        return require(`~/assets/items/${this.name}.png`)
      }
      return require(`~/assets/items/${this.name + this.value}.png`)
    },
    canvasImage() {
      const contextGetter = this.getContext()
      const ctx = contextGetter(this.layer)

      console.log(ctx)

      if (!ctx) {
        return
      }

      console.log(this)

      const cells = this.getCells()
      const activeCell = cells[this.loc]

      const img = new Image()
      img.startX = activeCell.x1
      img.startY = activeCell.y1
      img.src = this.backgroundImage()
      img.onload = function() {
        ctx.drawImage(
          img,
          this.startX,
          this.startY,
          this.naturalHeight,
          this.naturalWidth
        )
      }
    },
    ...mapGetters({
      getContext: 'canvas/getContext',
      getCells: 'cells/getCells'
    })
  },

  render() {
    return this.canvasImage()
  }
}
</script>

<style scoped></style>
