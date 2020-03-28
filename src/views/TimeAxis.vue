<template>
  <div class="timeAxis">
    <h2>The TimeAxisView Component</h2>
    <div class="timeAxisView">
      <div class="desc">This is a default TimeAxisView component; prop is {}: </div>
      <!-- must bind to signal that value is JS not a string -->
      <TimeAxisView viewID="timeAxisA" :time-axis-prop-obj="{}"/>
    </div>

    <div class="timeAxisView">
      <div class="desc">This is a TimeAxisView component; it responds to changes:
        <button v-show="nextTickInterval" @click="changeTickInterval">Change tick interval to {{nextTickInterval}}</button>
      </div>
      <TimeAxisView viewID="timeAxisB" :time-axis-prop-obj="timeAxisViewProps"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import TimeAxisView from '@/components/TimeAxisView.vue'

export default {
  name: 'Home',
  components: {
    TimeAxisView
  },
  data() {
    return {
      timeAxisViewProps: {
        startYear: 1900,
        stopYear: 1975,
        tickInterval: 25,
        svgWidth: 900,
        // default is 50;
        timeAxisHeight: 100,
        // default is 25; increase by add'l timeAxisHeight;
        timeAxisVerticalOffset: 75
      },
      changeTickDecrement: 5,
      nextTickInterval: 20
    }
  },
  methods: {
    changeTickInterval() {
      this.timeAxisViewProps.tickInterval -= this.changeTickDecrement
      this.nextTickInterval -= this.changeTickDecrement
    }
  }
}
</script>

<style scoped>
.timeAxis {
  margin: 5px 30px;
}
.home {
  text-align: center;
}
.desc {
  margin: 20px;
}
</style>
