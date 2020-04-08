<template>
  <!-- Home.vue  v0.3  Apr 4 -->
  <div class="home">
    <div class="builddate">[built: {{ builddate }}]</div>
    <div class="view">Home view</div>

    <div class="desc">
      The TimelineView component is a general-purpose history timeline intended to satisfy a wide range of needs. The two timelines on this page illustrate the original use for the javascript code in support of a Harvard College class in <i>The Hebrew Bible</i>. They also deomonstrate the interactive display of additional information.
    </div>

    <TimelineView timelineID="timelineA" :timeline="CB39overview" :tvcWidth="tvcWidth" :showProlog="true" />

    <div style="height: 40px;"></div>

    <div class="timeAxisView">
      <div class="desc">This is a TimeAxisView component; it responds to changes:
        <button v-show="nextTickInterval" @click="changeTickInterval">Change tick interval to {{nextTickInterval}}</button>
      </div>
      <TimeAxisView viewID="viewA" :time-axis-prop-obj="timeAxisViewProps"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import TimelineView from '@/components/TimelineView.vue'
import TimeAxisView from '@/components/TimeAxisView.vue'
import { builddate } from '@/assets/builddate.js'

export default {
  name: 'Home',
  components: {
    TimelineView,
    TimeAxisView
  },
  data() {
    return {
      builddate: builddate,
      tvcWidth: 1302, /* allows for temporary 1px border */
      CB39overview: {
        "name": "Hebrew Bible Overview Timeline",
        "dbKey": null,
        "title": "Hebrew Bible Overview: &nbsp; ",
        "subtitle": "Eras and Precipitating Events",
        "footerHTML": "This is <b>bold</b> and <i>italic</i> footer text.",
        "startYear":      -1100,
        "stopYear":       100,
        "tickInterval":   100,
        "svgSideMargin":  25,
        // features": { "showDatesCB": true,
        //              "showAllCB": true,
        //              "hideLabelsCB": true,
        //              "hasInfoPanels": true },
        "erasArr": [
          /* start and stop are years; topY(0 to 1) placement of top within
              eraHeight; height is fraction of height(0 to 1); optional:
              voffset is additional distance down for label; */
          {label: "Judges", start: -1100, stop: -1020,
              bgcolor: "#A9BCF5"},
          {label: "United Kingdom", start: -1020, stop: -931,
              bgcolor: "#F5BCA9"},
          {label: "Northern Kingdom (Israel)", start: -931, stop: -722,
              topY: 0, height: 0.7, bgcolor: "#F5A9E1"},
          {label: "Southern Kingdom (Judah)", start: -931, stop: -586,
              topY: 0.7, height: 0.3, bgcolor: "#F5A9BC"},
          {label: "Exile", start: -586, stop: -538,
              bgcolor: "#F78181"},
          {label: "Persian Period", start: -538, stop: -332,
              bgcolor: "#A9BCF5"},
          {label: "Hellenistic Period", start: -332, stop: -168,
              bgcolor: "#A9E2F3"},
          {label: "Maccabean (Hasmonean) Rule", start: -168, stop: -63,
              bgcolor: "#F5A9E1"},
          {label: "Rome: Temple", start: -63, stop: 70,
              bgcolor: "#F5BCA9"}
        ],
        "infoPanelBeginEndText": {
          "-1100": "<p><b>1100 BCE</b> isn't a firm date: by scholarly convention, the Exodus occurred (if at all) about 1200 with Joshua's conquest of Caanan 40 years later.  So, 1100 seems to be a reasonable nominal date for the start of the period of <b>Judges</b>.</p>",
          "-1020": "<p>In <b>1020 BCE</b> (more or less) the monarchy began with the anointment by Samuel of <b>Saul</b> as King (followed by <b>David</b> and <b>Solomon</b>).</p>",
          "-931": "<p>In <b>931 BCE</b>, on the death of <b>Solomon</b>, his son and successor declined to lighten the heavy taxation imposed by his father and the ten northern tribes broke away to become the Kingdom of Israel.  The remaining two tribes (Judah and Benjamin) remained loyal to the Davidic house and formed the southern kingdom, the Kingdom of Judah.</p>",
          "-722": "<p>In <b>722 BCE</b>, Assyria conquered the Northern Kingdom and forced the people to resettle elsewhere.  Many fled to the Southern Kingdom but the others remain unaccounted for.</p>",
          "-586": "<p>In <b>586 BCE</b>, Babylonia under <b>King Nebuchadnezzar II</b> conquered the Southern Kingdom and destroyed the Temple. The elites had been sent into exile in Babylon ten years earlier (-597).</p>",
          "-538": "<p>In <b>539 BCE</b>, the Persians under <b>Cyrus</b> conquered Babylonia and in the following year Cyrus' famous edict gave permission to the Judeans to return to Jerusalem to rebuild their temple.</p>",
          "-332": "<p>In <b>334/332 BCE</b>, <b>Alexander the Great</b> conquered Judaea while passing through on his way to Persia and points east.  When he died ten years later (-323), Judaea became part of the Egyptian empire of the Ptolemies.  In <b>200 BCE</b> it came under the control of the Seleucid Empire.</p>",
          "-168": "<p>In <b>168 BCE</b>, the <b>Maccabean Revolt</b> began. It eventually established the first independent government in over 400 years.</p>",
          "-63": "<p>In <b>63 BCE</b>, the Roman Army under Pompey conquered Judea and in 37 BCE installed <b>Herod the Great</b> as client king; he was a great builder and dramatically enlarged and refurbished the Second Temple (d. 4 BCE).</p>",
          "70": "<p>In <b>70 CE</b>, the Romans ended the First Jewish War (66-70) by sacking Jerusalem and destroying the Temple.</p>"
        }
      },
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
    changeProperty() {
      // changing a value in the timeline prop causes rerender;
      this.CB39overview.title = 'Value changed'
    },
    addProperty() {
      // a new property in the timeline does NOT cause a rerender;
      // This DOES NOT WORK!!!
      //    this.timelineA.newProperty = "newPropertyValue"
      // MUST ASSIGN to the prop;
      this.timelineA = Object.assign({}, this.CB39overview, {newProperty: "newPropertyValue"})
    },
    addEra() {
      // does adding a new era cause a redrawing of the timeline?
      this.CB39overview.erasArr.push({label: "Added era", start: 1922, stop: 1928, bgcolor: "#F5A9F2"})
    },
    changeTickInterval() {
      console.log("changeTickInterval event fired")
      this.timeAxisViewProps.tickInterval -= this.changeTickDecrement
      this.nextTickInterval -= this.changeTickDecrement
    },
    changeStartYear() {
      this.timeAxisPropObj = Object.assign({}, this.timeAxisPropObj, {startYear: 1940, tickInterval: 5})
    }
  }
}
</script>

<style>
.home {
  position: relative;
  margin: 5px 0 80px 0;
  padding: 20px;
  text-align: center;
  border: 1px solid black;
}
 .home .builddate {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  font-size: 0.8rem;
}
 .home .view {
  position: absolute;
  top: 0.1rem;
  left: 0.4rem;
  font-size: 1.2rem;
  font-weight: bold;
}
.desc {
  margin: 40px auto;
  width: 70%;
  text-align: left;
}
</style>
