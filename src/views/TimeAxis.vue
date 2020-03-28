<template>
  <div class="timeAxis">
    <h2>Examples of the use of the TimeAxisView component</h2>
    <div class="timeAxisView">
      <div class="desc">This default TimeAxisView component has an empty timeAxisPropObj prop of {}: </div>
      <!-- must bind to signal that value is JS not a string -->
      <TimeAxisView viewID="timeAxisA" :time-axis-prop-obj="{}"/>
      <div class="desc">
        It therefore uses the default values for a TimeAxis:
        <div class="props">
          <ul>
            <li v-for="(value, prop, idx) in timeAxisDefaults" :key="idx">
              {{ idx+1 }}. &nbsp; <b>{{ prop }}:</b> {{ value }}
            </li>
          </ul>
        </div>

      </div>
    </div>

    <div class="timeAxisView">
      <div class="desc">This is a TimeAxisView component with a timeAxisPropObj prop of<br />
        <div class="props">
          <ul>
            <li v-for="(value, prop, idx) in timeAxisViewProps" :key="idx">
              {{ idx+1 }}. &nbsp; <b>{{ prop }}:</b> {{ value }}
            </li>
          </ul>
        </div>


      It responds to changes made in the parent:
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
      changeTickDecrement: 5,
      nextTickInterval: 20,
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
      timeAxisDefaults: {
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
  margin: 10px 30px;
  text-align: center;
  font-size: 1.2rem;
}
.timeAxisView {
  padding-top: 30px;
  padding-bottom: 60px;
  border-bottom: 2px solid gray;
}
.props {
  margin: 10px auto;
  padding: 15px 0 15px 25px;
  width: 42rem;
  text-align: left;
  columns: 2 auto;
  border: 2px solid wheat;
}
.props ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.desc button {
  margin-left: 25px;
  font-size: 1rem;
}
</style>
