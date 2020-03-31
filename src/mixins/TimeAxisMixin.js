/* TimeAxisMixin.js  v. 0.3  Mar 28 2020 */
import * as d3 from "d3";

export const TimeAxisMixin = {
  methods: {
    getTimeScaleFn(tl) {
      // uses tl.startYear, tl.stopYear, tl.svgSideMargin, tl.svgWidth;
      return d3
        .scaleLinear()
        .domain([tl.startYear, tl.stopYear])
        .rangeRound([tl.svgSideMargin, tl.svgWidth - tl.svgSideMargin]);
    },
    getTickValues(tl) {
      // uses: tl.startYear, tl.stopYear, tl.tickInterval;
      // todo: delete too-close first/last normal ticks;
      // todo: if domain < 15, then interval = 2; <10, 1;
      let startYear = tl.startYear; // perhaps mutated;
      let firstTick = undefined;
      // check whether OK even if not on boundary (1900 & 15);
      const notOK = !(startYear % 10 == 0 && tl.tickInterval % 5 == 0);
      // if startYear not on a tickInterval-year boundary;
      if (startYear % tl.tickInterval != 0 && notOK) {
        firstTick = startYear;
        // if interval > 9, go to next 10-year tick
        if (tl.tickInterval > 9) {
          startYear += 10 - (startYear % tl.tickInterval);
        } else {
          startYear += tl.tickInterval - (startYear % tl.tickInterval);
        }
        // skip first inside tick if too close to startYear tick;
        if (startYear - firstTick < 3) {
          startYear += tl.tickInterval;
        }
      }
      const numTicks =
        Math.floor((tl.stopYear - startYear) / tl.tickInterval) + 1;
      const tickValues = Array(numTicks)
        .fill(startYear)
        .map((start, index) => start + index * tl.tickInterval);
      if (firstTick) tickValues.unshift(firstTick);
      // if stopYear is not on a boundary, add it;
      if (!Number.isInteger((tl.stopYear - startYear) / tl.tickInterval)) {
        tickValues.push(tl.stopYear);
      }
      return tickValues;
    },
    getTimeAxisSVGFn(tl) {
      // tl.timeScaleFn must already be assigned;
      return d3
        .axisBottom(tl.timeScaleFn)
        .tickValues(this.getTickValues(tl))
        .tickFormat(d3.format(".4"));
      // .tickPadding(tl.timeAxisTickPadding)
      // .tickSize(tl.timeAxisTickSize);
    },
    drawTimeAxis(tl, axisContainerDiv, verticalSVGOffset) {
      if (!tl.timeAxisPropsValid) {
        const reqProps = [ "startYear", "stopYear", "tickInterval"]
        reqProps.push("foo")
        tl.timeAxisPropsValid = true
      }
      // uses tl.startYear, tl.stopYear, tl.tickInterval;
      tl.timeScaleFn = this.getTimeScaleFn(tl);
      // must have tl.timeScaleFn;
      tl.timeAxisSVGFn = this.getTimeAxisSVGFn(tl);
      // uses tl.timeAxisSVGFn, tl.timeAxisStroke, tl.timeAxisStrokeWidth,
      //      tl.timeAxisFontFamily, tl.timeAxisFontSize;
      // axisContainerDiv is a div el containing an svg
      //   containing a g with class "timeAxisGrp" (this.rootEl);
      // verticalSVGOffset is the translate distance from the
      //   top of the svg container (tl.eraTopMargin + tl.eraHeight +
      //   tl.timeAxisVerticalOffset);
      d3.select(axisContainerDiv)
        .select(".timeAxisGrp")
        // default position is at top of SVG; move to bottom;
        .attr("transform", `translate(0, ${verticalSVGOffset})`)
        .call(tl.timeAxisSVGFn);

      d3.select(axisContainerDiv)
        .selectAll(".timeAxisGrp line, .timeAxisGrp path")
        .attr("stroke", tl.timeAxisStroke)
        .attr("stroke-width", tl.timeAxisStrokeWidth)
        .attr("fill", "none")
        .attr("shape-rendering", "crispEdges");

      d3.select(axisContainerDiv)
        .selectAll(".timeAxisGrp text")
        .attr("font-family", tl.timeAxisFontFamily)
        .attr("font-size", tl.timeAxisFontSize)
        .attr("text-rendering", "optimizeLegibility");
    }
  }
};
