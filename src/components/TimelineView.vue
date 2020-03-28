<!-- for shadowed scrollbars see: https://markus.oberlehner.net/blog/scrolling-shadows-with-vue/
-->
<template>
  <!-- version 1.1 Mar 27 2020; transfer to TimelineViewComp -->
  <!-- ToDo: 1) should work with timeline prop of {}; 2) put default values in code?? -->
  <div class="timelineViewContainer"
       :id="timelineID"
       :style="{ width: tvcWidth + 'px' }"
  >
    <div class="tlObjProps" v-if="showTLProps">
      <div>The properties and values of the <span>timeline prop</span> added to the default <span>tl object</span>:</div>
      <ul>
        <li v-for="(value, prop, idx) in tl" :key="prop">
          {{ idx+1 }}. &nbsp; <b>{{ prop }}:</b> {{ value }}
        </li>
      </ul>
    </div>

    <div class="tvHeader">
      <span class="tltitle">{{ tl.title }}</span> &nbsp; &nbsp;
      <span class="tlsubtitle">{{ tl.subtitle }}</span>
    </div>
    <div class="tvTimeline">
      <!--
      svg width set to width of tvTimeline; height is computed value;
      svg: the height of the svg determines the height of the tvTimeline
      -->
      <svg class="svg" width="1250px" height="400px" xmlns="http://www.w3.org/2000/svg">
        <g class="erasGrp"></g>
        <g class="eraStartDateGrp eraDateGrp"></g>
        <g class="eraStopDateGrp eraDateGrp"></g>
        <!-- goes last to be drawn topmost -->
        <g class="timeAxisGrp"></g>
      </svg>
      <div class="eraLabelsGrp"></div>
      <div class="infoModal" style="opacity: 1e-6;"></div>
      <!-- class="eraLabel" divs will be added here -->
    </div>
    <div class="tvFooter" v-html="tl.footerHTML">
    </div>
  </div>
</template>

<script>
  import * as d3 from 'd3'
  import { TimeAxisMixin } from '../mixins/TimeAxisMixin.js'

  export default {
    name: "TimelineView",
    mixins: [TimeAxisMixin],
    props: {
      timeline: {
        type: Object,
        required: true
      },
      timelineID: {
        type: String,
        required: false,
        default: "soleTimeline"
      },
      // used in computed property 'styleObject';
      tvcWidth: {
        type: Number,
        required: false,
        default: 1300
      },
      showTLProps: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data() {
      return {
        // tl is the default timeline object; it provides default values which
        // may then be omitted from the timeline passed as a prop; all possible
        // properties should be in this default because adding a property does
        // not cause a re-render; it's not well examined yet.
        tl: {
          /* this component renders the title/subtitle but not a timeline (in the
            tvTimeline div) unless the timeline prop validates with:
              startYear stopYear tickInterval */
          /* 
          "tlID": "defaultTimelineID in tl object",
          "dbKey": null,
          "title":        "AP United States History",
          "subtitle":     "(twentieth century)",
          "footerHTML":   "This is <b>bold</b> footer text.",
          "startYear":      1900,
          "stopYear":       2000,
          */
          "tickInterval":   10,
          "bgColor":        "bisque",
          //   border: 3px solid #C11B17;
          "borderWidth":    3,
          "borderColor":    "#C11B17",
          // next 2 widths are default;
          "tvTimelineClientWidth": 1268,
          "svgWidth":       1228,
          "svgSideMargin":  20,
          "eraTopMargin":   30,
          // eraHeight is default;
          "eraHeight":      320, 
          "timeAxisHeight": 50,
          "timeAxisVerticalOffset": 20,
          "timeAxisStroke": "black",
          "timeAxisStrokeWidth": 2,
          "timeAxisFontFamily": "sans-serif",
          "timeAxisFontSize": "13",
          "colorWheel": ["FFF7FB", "ECE7F2", "D0D1E6", "A6BDDB",
                         "74A9CF", "3690C0", "0570B0", "045A8D", "023858"],
          "erasArr": [
            /* start and stop are years; topY(0 to 1) placement of top within
              eraHeight; height is fraction of height(0 to 1); optional:
              voffset is additional distance down for label; */
            /* {label: "Era Area", start: 1900, stop: 2000, bgcolor: "#FFFFE0"}, */
            /*
            {label: "Great War", start: 1914, stop: 1918, bgcolor: "#A9BCF5"},
            {label: "WWII", start: 1939, stop: 1945, bgcolor: "#A9E2F3"},
            {label: "Korean War", start: 1950, stop: 1953, bgcolor: "#D0D1E6"},
            {label: "Vietnam War", start: 1963, stop: 1975,
              topY: 0.5, height: 0.5, bgcolor: "#FFF8DC"},
            {label: "Gulf War", start: 1990, stop: 1991, bgcolor: "#ECE7F2"},
            */
          ],
          "eraLabelsFontSize": 16,
          "eraDateFontSize": 16,
          "rangesArr": [],
          "peopleArr": [],
          "eventsArr": [],
          "showEraDatesOnHover": true,
          "hasInfoPanel": false
        }, // end of tl
        rootEl: null,
        showLabelSizes: false,  // for debug of HTML labels
        usPresidentsArr: null,
      }
    },
    mounted: function() {
      this.rootEl = document.getElementById(this.timelineID)
      console.log(`============ ${this.timelineID} (in mounted hook): timeline prop: `, this.timeline)

      if (this.tl.showUSPresidents == true){
        console.log("  Fetching US Presidents file")
        fetch("USPresidentsArr.json", {mode: 'no-cors'})
        .then(response => {
          if (!response.ok) { throw new Error("HTTP error " + response.status); }
          return response.json();
        })
        .then(json => {
          this.usPresidentsArr = json;
        })
        .catch(function (error) {
          // this.dataError = true;
          throw new Error("fetch error: " + error);
        })
      }

      // Add missing title, subtitle; check for start/stop/tickInt;
      if (this.tlPropIsValid(this.timeline)) {
        // merge timeline prop into this.tl as target;
        Object.assign(this.tl, this.timeline)
        this.drawTimeline()
      } else {
        // trigger watch handler;
        this.timeline.failedToRenderOnMount = true
      }
    },
    computed: {
      svgHeight: function () {
        return this.tl.eraTopMargin + 
               this.tl.eraHeight +
               this.tl.timeAxisHeight
      } 
    },
    watch: {
      // NB that ADDING a property to the prop will NOT cause a re-render!!
      //  could use immediate: true to execute on load;
      timeline: {
        deep: true,
        handler: function(newVal) {
          console.log("  ===> In watch handler for timeline prop")
          if (this.tlPropIsValid(newVal)) {
            Object.assign(this.tl, newVal)
            this.drawTimeline()
          }
        }
      }
    },
    methods: {
      /* https://d3-annotation.susielu.com/ */
      /* d3 categorical colors: Tableau10.js
         colors("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab"); */
      /* d3 categorial colors:
      getPastelColors() {
        // https://github.com/d3/d3-scale-chromatic/blob/master/src/categorical/Pastel1.js
        let specifier = "fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2"
        let numColors = specifier.length / 6     // nine
        let colors = new Array(numColors)
        let i = 0
        while (i < numColors) colors[i] = "#" + specifier.slice(i * 6, ++i * 6)
        return colors
      }
      */
      tlPropIsValid(prop) {
        console.log("In tlPropIsValid: ", prop)
        if (!prop.title || prop.title == "") { prop.title = "No title supplied" }
        if (!prop.subtitle) { prop.subtitle = "" }
        if (!prop.footerHTML) { prop.footerHTML = "" }
        if (!prop.startYear || !prop.stopYear || !prop.tickInterval ||
            !(prop.stopYear > prop.startYear) || prop.startYear % 5 != 0) {
          console.log("bad: ", prop.startYear, prop.stopYear, prop.tickInterval)
          return false 
        }
        return true
      },
      drawTimeline() {
        console.log(`=========== drawing ${this.timelineID} ============`, this.tl)
        if (!this.tlPropIsValid(this.tl)) { throw new Error("tl prop invalid") }
        this.removeEmptyHeaderFooter(this.tl)
        this.removeExistingEras(this.tl)
        this.initializeComponent(this.tl)
        this.drawTimeAxis(this.tl) /* need tl.timeScaleFn() */
        if (Object.keys(this.tl).includes("erasArr") && this.tl.erasArr.length > 0) {
          this.normalizeEras(this.tl)
          this.drawEras(this.tl)
          this.drawEraLabelsAsHTML(this.tl)
          this.drawEraDates(this.tl)
        }
        if (this.tl.usPresidentsArr) {
          this.drawUSPresidents(this.tl)
        }
      },
      drawUSPresidents(tl) {
        console.log("In drawUSPresidents()", tl)
      },
      removeEmptyHeaderFooter(tl) {
        if (tl.title.trim().length +  tl.subtitle.trim().length === 0) {
          this.rootEl.getElementsByClassName("tvHeader")[0].remove()
        }
        if (tl.footerHTML.trim().length === 0) {
          this.rootEl.getElementsByClassName("tvFooter")[0].remove()
        }
      },
      removeExistingEras() {
        // remove existing content (incl 2 eraDateGrps);
        // required where TL is fetched from URL (else doubled);
        const erasGrps = d3.select(this.rootEl).select('.erasGrp').selectAll('rect')
        console.log("erasGrps: ")
        console.dir(erasGrps)
        if (erasGrps) {erasGrps.remove()}
        d3.select(this.rootEl).selectAll('.eraDateGrp').selectAll('text').remove()
        d3.select(this.rootEl).select('.eraLabelsGrp').selectAll('div').remove()
        d3.select(this.rootEl).select('.infoModal').html(null)
      },
      initializeComponent(tl) {
        // time scaling function which maps a year to an x coordinate;
        tl.timeScaleFn = d3.scaleLinear()
            .domain([tl.startYear, tl.stopYear])
            .rangeRound([tl.svgSideMargin,
                         tl.svgWidth - tl.svgSideMargin])
            .nice();
        // add borders to three elements;
        const borderPropValue = `${tl.borderWidth}px solid ${tl.borderColor}`
        d3.select(this.rootEl).selectAll(".tvHeader, .tvTimeline, .tvFooter")
          .style("border", borderPropValue)
        // set svgWidth to tvTimeline clientWidth;
        const tvTimelineClientWidth = this.rootEl.getElementsByClassName("tvTimeline")[0].clientWidth
        // other calculations depend on this tl.svgWidth value;
        tl.svgWidth = tvTimelineClientWidth /* - (2 * tl.svgSideMargin) */
        tl.svgEl = this.rootEl.getElementsByClassName("svg")[0]
        /*
          console.log("tvTimeline clientWidth is: " + tvTimelineClientWidth)
          console.log("orig svg width  is: " + tl.svgEl.clientWidth)
          console.log("orig svg height is: " + tl.svgEl.clientHeight)
        */
        tl.svgEl.setAttribute("width", tl.svgWidth)
        // set svgHeight (computed) which determines tvTimeline height;
        tl.svgEl.setAttribute("height", this.svgHeight)
        /*
          console.log("new svg width   is: " + tl.svgEl.clientWidth)
          console.log("new svg height  is: " + tl.svgEl.clientHeight)
        */
        // check whether infoPanel text;
        if (Object.keys(this.tl).includes("infoPanelBeginEndText") &&
            Object.keys(this.tl.infoPanelBeginEndText).length > 0) {
          tl.hasInfoPanel = true;
        }
      },
//       drawTimeAxis(tl) {
//         // tlPropIsValid() ;
//         // generate tick values;
//         /*
//         const numTicks = Math.floor((tl.stopYear - tl.startYear)/tl.tickInterval) + 1
//         console.log("Before 1")
//         const tickValues = Array(numTicks).fill(tl.startYear).map((start, index) => start + (index * tl.tickInterval))
//         console.log("After 1")
//         // less than full interval to stopYear;
//         console.log("Before 2")
//         if (!Number.isInteger((tl.stopYear - tl.startYear)/tl.tickInterval)) { tickValues.push(tl.stopYear) }
//         console.log("After 2")
//         */
//        // from the mixin:
//         const tickValues = this.getTickValues(tl)
//         // a function which returns the SVG for the axis;
//         const timeAxisFn = d3.axisBottom(tl.timeScaleFn)
//                 .tickValues(tickValues)
//                 .tickFormat(d3.format(".4"));
//                 // .tickPadding(tl.timeAxisTickPadding)
//                 // .tickSize(tl.timeAxisTickSize);
//         d3.select(this.rootEl).select(".timeAxisGrp")
//             // default position is at top of SVG; move to bottom;
//             .attr("transform",
//                   "translate(0, " + (tl.eraTopMargin + tl.eraHeight +
//                                      tl.timeAxisVerticalOffset) + ")")
//             .call(timeAxisFn);
// 
//         d3.select(this.rootEl).selectAll(".timeAxisGrp line, .timeAxisGrp path")
//             .attr("stroke", tl.timeAxisStroke)
//             .attr("stroke-width", tl.timeAxisStrokeWidth)
//             .attr("fill", "none")
//             .attr("shape-rendering", "crispEdges");
// 
//         d3.select(this.rootEl).selectAll(".timeAxisGrp text")
//             .attr("font-family", tl.timeAxisFontFamily)
//             .attr("font-size", tl.timeAxisFontSize)
//             .attr("text-rendering", "optimizeLegibility");
//       },
      normalizeEras(tl) {
        // add topY, height, and voffset defaults;
        tl.erasArr = tl.erasArr.map(
          obj => Object.assign({}, {topY:0,height:1,voffset:0}, obj)
        )
        tl.erasArr.forEach( obj => { if (Object.keys(obj).length !== 7) throw new Error("bad key count in era") })
      },
      drawEras(tl) {
        const compRoot = this.rootEl
        /* typical era object: {label: "Great War", start: 1914, stop: 1918,
              topY: 0, height: 1.0, bgcolor: "#A9BCF5", voffset: 0} */
        d3.select(this.rootEl).select(".erasGrp").selectAll("rect")
            .data(tl.erasArr)
            .enter()
          .append("rect")
            // the id is the condensed label, e.g., "UnitedKingdom" (alphanum only);
            .attr("class", function(d){ return d.label.replace(/\W/g, "") })
            .attr("x", function(d){ return tl.timeScaleFn(d.start) })
            .attr("y", function(d){ return tl.eraTopMargin + (d.topY * tl.eraHeight) })
            .attr("rx", 4)  // slightly rounded corners;
            .attr("ry", 4)
            .attr("width", function(d){ return tl.timeScaleFn(d.stop) -
                                              tl.timeScaleFn(d.start) })
            .attr("height", function(d){ return d.height * tl.eraHeight })
            .style("fill", function(d){ return d.bgcolor })
            .style("stroke-width", 1)
            .style("stroke", "black")
            .on("mouseover", function(){
              if (tl.showEraDatesOnHover) {
                const classSelectorStr = ".eraDateGrp ." + d3.select(this).attr("class");
                d3.select(compRoot).selectAll(classSelectorStr).classed("hidden", false);
              }
              if (tl.hasInfoPanel) {
                const eraObj = this.__data__;
                const leftX = tl.timeScaleFn(eraObj.start) - 10;
                const topY  = tl.eraTopMargin + (eraObj.topY * tl.eraHeight) + 46;
                let panelText = tl.infoPanelBeginEndText[eraObj.start];
                panelText    += tl.infoPanelBeginEndText[eraObj.stop];
                d3.select(compRoot).select(".infoModal")
                  .style("max-width", "400px")
                  .style("left", leftX + "px")
                  .style("top", topY + "px")
                  .html(panelText)
                  .transition()
                  .duration(400)
                  .style("opacity", 0.95);
              }
            })
            .on("mouseout", function(){
              if (tl.showEraDatesOnHover) {
                const classSelectorStr = ".eraDateGrp ." + d3.select(this).attr("class");
                d3.select(compRoot).selectAll(classSelectorStr).classed("hidden", true);
              }
              if (tl.hasInfoPanel) {
                d3.select(compRoot).select(".infoModal")
                  .transition()
                  .duration(400)
                  .style("opacity", 1e-6);
              }
            });
      },
      drawEraLabelsAsHTML(tl) {
        // eraLabels as **HTML divs** to take advantage of text wrapping;
        // if widest word is wider than the era itself, then it overflows;
        // in such a case, we want to make the <div> wide enough and place
        // it evenly straddling the era.
        // create temporary hidden span to meassure width;
        const tempWidthSpan = d3.select(this.rootEl)
            .append("span")
            .style("position", "absolute")
            .style("visibility", "hidden");
        // nested function ============================== 
        const getLeftAndStoreWidth = function(d, self) {
          // does widest word overflow? Sort by length descending;
          let words = d.label.split(/ /);
          let longestWord = words.sort((a,b) => b.length - a.length)[0];
          // console.log("Longest: " + longestWord);
          // put the longest word into the span;
          tempWidthSpan.text(longestWord);
          // console.log("tempWidthSpan clientWidth: ", tempWidthSpan.property("clientWidth"))
          let longestWordWidth = tempWidthSpan.property("clientWidth")
          // console.log("Width of \"" + longestWord + "\": " + longestWordWidth);
          let widthOfEra = tl.timeScaleFn(d.stop) - tl.timeScaleFn(d.start);
          // console.log("Width of " + d.label + " era: " + widthOfEra);
          if (widthOfEra > longestWordWidth) {
            /* If the longest word will fit in era, set width to that of era
               and position div at start year; */
            if (self.showLabelSizes) console.log("Fits: " + longestWord + " is " + longestWordWidth + " in " + widthOfEra)
            d.width = widthOfEra
            return tl.timeScaleFn(d.start) + "px" /* + tl.svgSideMargin + "px"; */
          } else {
            /* Else, div has width of longest word and is positioned to the
               left of start year; */
            d.width = longestWordWidth + 2;
            // left is to the left of start by half of excess width + 2;
            let left = Math.ceil(tl.timeScaleFn(d.start) - 
                            ((longestWordWidth - widthOfEra + 2) / 2));
            if (self.showLabelSizes) console.log("Doesn't fit: " + longestWord + " starts " + (tl.timeScaleFn(d.start) - left) + " to the left of startYear")
            return left + "px";
          }
        }; // end of function def;
        //======================================
        d3.select(this.rootEl).select('.eraLabelsGrp')
            .selectAll("div")
            .data(tl.erasArr)
            .enter()
          .append("div")
            .attr("class", "eraLabel")
            .attr("id", d => d.label.replace(/\W/g, "") + "Label")
            .style("left", d => getLeftAndStoreWidth(d, this))
            .style("top", d => tl.eraTopMargin + 10 + (d.topY * tl.eraHeight) + d.voffset + "px")
            .style("width", d => d.width + "px")
            .text(d => d.label)
            .style("font-size", this.eraLabelsFontSize) + "px"
        tempWidthSpan.remove();
      },
      drawEraDates(tl) {
        // nested function ================================
        const drawGroupOfDates = function(startOrStop, self) {
          const start = startOrStop == "start" ? true : false;
          const whichGrp = start ? ".eraStartDateGrp" : ".eraStopDateGrp"
          d3.select(self.rootEl).select(whichGrp)
              .selectAll("text")
              .data(tl.erasArr)
              .enter()
            .append("text")
              .text(function(d){ return start ? d.start : d.stop })
              .attr("class", function(d){ return d.label.replace(/\W/g, "") + " hidden"})
              .attr("x", function(d){ return tl.timeScaleFn(start ? d.start : d.stop)})
              .attr("y", tl.eraTopMargin - (0.5 * tl.eraDateFontSize))
              .attr("text-anchor", "middle")
              .attr("font-family", "sans-serif")
              .attr("font-size", tl.eraDateFontSize + "px")
              .attr("fill", "black")
              .attr("text-rendering", "optimizeLegibility");
              // .attr("font-weight", "bold")
        }
        // end nested function ================================
        drawGroupOfDates("start", this)
        drawGroupOfDates("stop", this)
      },
    }    
  }
</script>

<style>
.tlObjProps {
  padding: 8px 15px;
  background: wheat;
  border: 8px solid palegreen;
}
.tlObjProps div {
  font-weight: bold;
}
.tlObjProps div span {
  color: red;
}
.tlObjProps ul {
  text-align: left;
  columns: 3 auto;
  list-style-type: none;
}
.hidden {
  display: none;
}
/* this is the root of the final component: it's
   1300 wide by default or set by parent with a prop;
   it's horiz-centered within a too-wide parent and
   scrolls if parent is too narrow;
*/
.timelineViewContainer {
  font-family: Palatino, Times, "Times New Roman", Georgia, serif;
  box-sizing: border-box;
  margin: 0 auto;
  overflow-x: auto;
  border: 3px solid blue;  /* temp */
}
.tvHeader, .tvTimeline, .tvFooter {
  position: relative; /* parent container for positioning */
  box-sizing: border-box;
  width: 98%;
  margin: 20px auto;
  /* border: 3px solid #C11B17; */
}
.tvHeader, .tvFooter {
  padding: 15px 30px;
  text-align: left;
}
.tvHeader {
  font-weight: bold;
}
.tltitle {
  font-size: 24px;
  color: #0404B4;
}
.tlsubtitle {
  font-size: 20px;
}
.tvTimeline {
  background-color: bisque;
  overflow-x: auto;
}
svg {
  margin: 0 auto;
}
.eraLabel {
  position: absolute;
  z-index: 1;
  text-align: center;
  font-size: 16px; /* default */
  color: black;
  pointer-events: none;
}
.infoModal {
  position: absolute;
  z-index: 2;
  /* note padding on p elements */
  border: solid 1px #aaa;
  border-radius: 8px;
  background: aliceblue;
  font: 15px sans-serif;
  text-align: center;
  pointer-events: none;
}
.infoModal p {
  margin: 0;
  padding: 6px 6px;
}
.timeAxisGrp path,
.timeAxisGrp line {
  fill: none;
  stroke: black;
  shape-rendering: crispEdges; /* SVG attribute */
}
.timeAxisGrp text {
  font-family: sans-serif;
  font-size: 13px;
  text-rendering: optimizeLegibility; /* SVG attribute */
}
.infoDisplay, .infoDisplay2, .discPanel {
  width: 1160px;
  margin-top: 20px;
  padding: 20px;
  border: 2px solid red;
  column-count: 3;
  -moz-column-count: 3;
  -webkit-column-count: 3;
  
}
.infoDisplay p, .infoDisplay2 p, .discPanel p {
  text-indent: 1em;
  margin-before: 0;
  -moz-margin-before: 0;
  -webkit-margin-before: 0;
  margin-after: 0.3em;
  -moz-margin-after: 0.3em;
  -webkit-margin-after: 0.3em;
}</style>