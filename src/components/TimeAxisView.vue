<template>
  <!-- TimeAxisView component: v0.3 Apr 4 -->
  <div class="timeAxisViewContainer" :id=viewID>
    <svg class="svg" :width="timeAxisObj.svgWidth + 'px'"
                     :height="timeAxisObj.timeAxisHeight + 'px'"
                     xmlns="http://www.w3.org/2000/svg">
      <g class="timeAxisGrp"></g>
    </svg>
  </div>
</template>

<script>
// d3 is imported in the mixin;
import { TimeAxisMixin } from '../mixins/TimeAxisMixin.js'

export default {
  name: "TimeAxisViewComponent",
  mixins: [TimeAxisMixin],
  props: {
    // typcially: startYear, stopYear, tickInterval, svgWidth only;
    timeAxisPropObj: {
      type: Object,
      required: true
    },
    viewID: {
      type: String,
      default: "soleView"
    }
  },
  data() {
    return {
      rootEl: undefined,
      // any changes must also be in TimeAxis.vue view;
      timeAxisObj: {
        startYear: 1900,
        stopYear: 2000,
        tickInterval: 10,
        svgWidth: 600,
        svgSideMargin: 30,
        eraTopMargin: 0,
        eraHeight: 0,
        timeAxisHeight: 50,
        timeAxisVerticalOffset: 25,
        timeAxisStroke: "black",
        timeAxisStrokeWidth: 2,
        timeAxisFontFamily: "sans-serif",
        timeAxisFontSize: 13
      }
    }
  },
  mounted: function() {
    this.rootEl = document.getElementById(this.viewID)
    Object.assign(this.timeAxisObj, this.timeAxisPropObj)
    // console.log("mounted: svgWidth: ", this.timeAxisObj)
    this.drawTimeAxis(this.timeAxisObj, this.rootEl, this.timeAxisObj.timeAxisVerticalOffset)
  },
  watch: {
    timeAxisPropObj: {
      // immediate: true,  fires too soon to get rootEl
      deep: true,
      handler: function(newVal) {
        console.log(`newVal: `, newVal)
        // newVal contains only the properties in timeAxisPropObj;
        Object.assign(this.timeAxisObj, newVal)
        // console.log("TimeAxisView watch handler fired; timeAxisObj: ", this.timeAxisObj)
        this.drawTimeAxis(this.timeAxisObj, this.rootEl, this.timeAxisObj.timeAxisVerticalOffset)
      }
    }
  },
  methods: {
    /* now in TimeAxisMixin */
  }
}
</script>

<style scoped>
/* why is the timeAxisViewContainer div taller than the svg? */
.timeAxisViewContainer {
  display: inline-block;
  background-color: bisque;
  border: 3px solid #C11B17;
  overflow-x: auto;
}
</style>
