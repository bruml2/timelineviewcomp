/* USPresidentsMixin.js  v. 0.1  Apr 13 2020 */
/* Apr 14: developed separately in mixinpresidents project */
/* Apr 16: removed data section; */
/* Apr 25: completed pres data (except portraits); added border case; */
/* Apr 28: finished and moved to studioapp2 */

import * as d3 from "d3";
/* eslint-disable no-unused-vars */
export const USPresidentsMixin = {
  methods: {
    textWillFit(svgEl, widthAvail, text, fontSize, letterSpacing, idx, yAttr) {
      // ToDo: explore condensed fonts; add missing portraits from Wikipedia;
      /*  for debuggin: draws the rect;
      let tempRect = d3.select(svgEl)
        .append("rect")
          .attr("x", 30)
          .attr("y", yAttr - fontSize)
          .attr("width", widthAvail)
          .attr("height", fontSize + 4)
          .style("fill", "transparent")
          .style("stroke-width", 1)
          .style("stroke", "black");
      */
      let tempWidthSpan = d3.select(svgEl)
        .append("text")
          .attr("id", "tempWidthSpan" + idx)
          .attr("x", 30)
          .attr("y", 30)  // yAttr to debug
          .attr("font-family", "sans-serif")
          .attr("font-size", fontSize + "px")
          .attr("letter-spacing", letterSpacing)
          .text([text]);
      const widthName = Math.ceil(svgEl.querySelector("#tempWidthSpan" + idx).getBBox().width)
      d3.select(svgEl).select("#tempWidthSpan" + idx).remove()
      // console.log(text, widthAvail, widthName, (widthAvail - widthName))
      return widthName < widthAvail
    },
    drawUSPresidents(tl, svgEl, timeScaleFn, presVOffset, nameFontSize) {
      // if timeAxisVOffset is 25 less than height, then presVOffset should be 50 less;
      // TODO: add tooltip on hover;
      nameFontSize = nameFontSize || 14
      let presArr = this.getRelevantPres(tl.startYear, tl.stopYear)
      // mark the end elements;
      presArr[0].end = "start"
      presArr[presArr.length - 1].end = "stop"
      let lengthAdjmts = []
      let yAttr = 50;
      // compute the text of the "label" which will fit;
      let idx = 0
      presArr.forEach((pres) => {
        idx++
        // if there's a shortName, use it;
        pres.lastName = pres.shortName || pres.name.split(' ').pop()
        // adjust dates for end rects;
        if (pres.from < tl.startYear) { pres.from = tl.startYear}
        if (pres.to > tl.stopYear) { pres.to = tl.stopYear}
        // will lastName fit in rect?
        pres.widthRect = timeScaleFn(pres.to) - timeScaleFn(pres.from)
        yAttr += 25
        let letterSpacing = 0
        if (this.textWillFit(svgEl, pres.widthRect, pres.lastName, nameFontSize, letterSpacing, idx, yAttr)) {
          pres.label = pres.lastName
          pres.labelFontSize = nameFontSize
          pres.letterSpacing = 0
          return
        }
        // try a light squeeze;
        idx++
        yAttr += 25
        if (this.textWillFit(svgEl, pres.widthRect, pres.lastName, nameFontSize - 1, letterSpacing - 1, idx, yAttr)) {
          pres.label = pres.lastName
          pres.labelFontSize = nameFontSize - 1
          pres.letterSpacing = letterSpacing - 1
          return
        }
        // didn't try this: textLength="300" lengthAdjust="spacing"
        // try a harder squeeze; letter-spacing -2 is too much;
        idx++
        yAttr += 25
        if (this.textWillFit(svgEl, pres.widthRect, pres.lastName, nameFontSize - 2, letterSpacing - 1, idx, yAttr)) {
          pres.label = pres.lastName
          pres.labelFontSize = nameFontSize - 2
          pres.letterSpacing = letterSpacing - 1
          return
        }
        // shortName is being used, if available;
        // use veryShortName (H..), if available;
        if (pres.veryShortName) {
          pres.label = pres.veryShortName
          pres.labelFontSize = nameFontSize
          pres.letterSpacing = 0
          return
        }
        pres.label = ""
        pres.labelFontSize = nameFontSize
        pres.letterSpacing = 0
        return
    })
      d3.select(svgEl)
        .append('g')
          .attr('id', 'presGrpRects')
        .selectAll('rect')
        .data(presArr).enter()
        .append('rect')
          .attr("class", d => d.party)
          .attr("x", d => timeScaleFn(d.from))
          .attr("y", presVOffset)
          .attr("rx", 3) // slightly rounded
          .attr("ry", 3)
          .attr("width", d => timeScaleFn(d.to) - timeScaleFn(d.from))
          .attr("height", nameFontSize + 4)
          .style("fill", d => d.party == "Republican" ? "#F6CED8" : "#CEE3F6")
          .style("stroke-width", 1)
          .style("stroke", "black");
      d3.select(svgEl)
        .append('g')
          .attr('id', 'presGrpLabels')
        .selectAll('text')
        .data(presArr).enter()
        .append('text')
          .attr("id", d => "label" + d.from)
          .text(d => d.label)
          // .attr("class", function(d){ return d.label.replace(/\W/g, "") + " hidden"})
          .attr("x", d => timeScaleFn(d.from) + ((timeScaleFn(d.to)-timeScaleFn(d.from))/2))
          // y is bottom of text!
          .attr("y", presVOffset + nameFontSize)
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", d => d.labelFontSize + "px")
          .attr("letter-spacing", d => d.letterSpacing)
          .attr("fill", "black")
          .attr("text-rendering", "optimizeLegibility");
    },
    getRelevantPres(startYear, stopYear) {
      return [
      {
        from: 1789, to: 1797,
        name: "George Washington",
        party: "Unaffiliated",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg"
      }, {
        from: 1797, to: 1801,
        name: "John Adams",
        party: "Federalist",
        portrait: ""
      }, {
        from: 1801, to: 1809,
        name: "Thomas Jefferson",
        party: "Democratic-Republican",
        portrait: ""
      }, {
        from: 1809, to: 1817,
        name: "James Madison",
        party: "Democratic-Republican",
        portrait: ""
      }, {
        from: 1817, to: 1825,
        name: "James Monroe",
        party: "Democratic-Republican",
        portrait: ""
      }, {
        from: 1825, to: 1829,
        name: "John Quincy Adams",
        party: "Democratic-Republican",
        portrait: ""
      }, {
        from: 1829, to: 1837,
        name: "Andrew Jackson",
        party: "Democratic",
        portrait: ""
      }, {
        from: 1837, to: 1841,
        name: "Marin Van Buren",
        party: "Democratic",
        portrait: ""
      }, {
        from: 1841, to: 1841,
        name: "Willian Henry Harrison",
        party: "Whig",
        portrait: ""
      }, {
        from: 1841, to: 1845,
        name: "John Tyler",
        party: "Whig",
        portrait: ""
      }, {
        from: 1845, to: 1849,
        name: "James K. Polk",
        party: "Democratic",
        portrait: ""
      }, {
        from: 1849, to: 1850,
        name: "Zachary Taylor",
        party: "Whig",
        portrait: ""
      }, {
        from: 1850, to: 1853,
        name: "Millard Fillmore",
        party: "Whig",
        portrait: ""
      }, {
        from: 1853, to: 1857,
        name: "Franklin Pierce",
        party: "Democratic",
        portrait: ""
      }, {
        from: 1857, to: 1861,
        name: "James Buchanan",
        party: "Democratic",
        portrait: ""
      }, {
        from: 1861, to: 1865,
        name: "Abraham Lincoln",
        party: "Republican",
        portrait: ""
      }, {
        from: 1865, to: 1869,
        name: "Andrew Johnson",
        party: "National Union",
        portrait: ""
      }, {
        from: 1869, to: 1877,
        name: "Ulyssses S. Grant",
        party: "Republican",
        portrait: ""
      }, {
        from: 1877, to: 1881,
        name: "Rutherford B. Hayes",
        party: "Republican",
        portrait: ""
      }, {
        from: 1881, to: 1881,
        name: "James A. Garfield",
        party: "Republican",
        portrait: ""
      }, {
        from: 1881, to: 1885,
        name: "Chester A. Arthur",
        party: "Republican",
        portrait: ""
      }, {
        from: 1885, to: 1889,
        name: "Grover Cleveland",
        party: "Democratic",
        portrait: ""
      }, {

        from: 1889, to: 1893,
        name: "Benjamin Harrison",
        party: "Republican",
        portrait: ""
      }, {
        from: 1893, to: 1897,
        name: "Grover Cleveland",
        party: "Democratic",
        portrait: ""
      }, {
        from: 1897, to: 1901,
        name: "William McKinley",
        party: "Republican",
        portrait: ""
      }, {
        from: 1901, to: 1909,
        name: "Theodore Roosevelt", shortName: "T. Roosevelt",
        party: "Republican",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:President_Roosevelt_-_Pach_Bros.jpg"
      }, {
        from: 1909, to: 1913,
        name: "Willian Howard Taft",
        party: "Republican",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:William_Howard_Taft,_head-and-shoulders_portrait,_facing_front.jpg"
      }, {
        from: 1913, to:   1921,
        name: "Woodrow Wilson",
        party: "Democratic",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:Woodrow_Wilson-H&E.jpg"
      }, {
        from: 1921,
        to:   1923,
        name: "Warren G. Harding", shortName: "WGH", veryShortName: "H..",
        party: "Republican",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:Warren_G_Harding-Harris_&_Ewing.jpg"
      }, {
        from: 1923,
        to:   1929,
        name: "Calvin Coolidge",
        party: "Republican",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:Calvin_Coolidge_cph.3g10777_(cropped).jpg"
      }, {
        from: 1929,
        to:   1933,
        name: "Herbert Hoover",
        party: "Republican",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:President_Hoover_portrait.jpg"
      }, {
        from: 1933,
        to:   1945,
        name: "Franklin Delano Roosevelt", shortName: "F.D. Roosevelt",
        party: "Democratic",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:FDR_1944_Color_Portrait.jpg"
      }, {
        from: 1945,
        to:   1953,
        name: "Harry S. Truman",
        party: "Democratic",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:TRUMAN_58-766-06_CROPPED.jpg"
      }, {
      from: 1953,
      to:   1961,
      name: "Dwight D. Eisenhower",
      party: "Republican",
      portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:Dwight_D._Eisenhower,_official_photo_portrait,_May_29,_1959.jpg"
      }, {
      from: 1961,
      to:   1963,
      name: "John F. Kennedy", shortName: "JFK", veryShortName: "K..",
      party: "Democratic",
      portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:John_F._Kennedy,_White_House_color_photo_portrait.jpg"
      }, {
      from: 1963,
      to:   1969,
      name: "Lyndon Baines Johnson",
      party: "Democratic",
      portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:37_Lyndon_Johnson_3x4.jpg"
      }, {
      from: 1969,
      to:   1974,
      name: "Richard M. Nixon",
      party: "Republican",
      portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:Richard_M._Nixon,_ca._1935_-_1982_-_NARA_-_530679.jpg"
      }, {
      from: 1974,
      to:   1977,
      name: "Gerald Ford",
      party: "Republican",
      portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:Gerald_Ford_presidential_portrait.jpg"
      }, {
        from: 1977,
        to:   1981,
        name: "Jimmy Carter",
        party: "Democratic",
        portrait: "https://upload.wikimedia.org/wikipedia/commons/5/5a/JimmyCarterPortrait2.jpg"
      }, {
        from: 1981,
        to:   1989,
        name: "Ronald Reagan",
        party: "Republican",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:Official_Portrait_of_President_Reagan_1981.jpg"
      }, {
        from: 1989,
        to:   1993,
        name: "George H. W. Bush",
        party: "Republican",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:George_H._W._Bush,_President_of_the_United_States,_1989_official_portrait_(cropped).jpg"
      }, {
        from: 1993,
        to:   2001,
        name: "Bill Clinton",
        party: "Democratic",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:Bill_Clinton.jpg"
      }, {
        from: 2001,
        to:   2009,
        name: "George W. Bush",
        party: "Republican",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:George-W-Bush.jpeg"
      }, {
        from: 2009,
        to:   2017,
        name: "Barack Obama",
        party: "Democratic",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:Official_portrait_of_Barack_Obama.jpg"
      }, {
        from: 2017, to:   2021,
        name: "Donald J. Trump",
        party: "Republican",
        portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:Donald_Trump_official_portrait.jpg"
      }
    ].filter(presObj => ((presObj.from >= startYear &&
                          presObj.to   <= stopYear) ||
                         (presObj.from < startYear && presObj.to > startYear) ||
                         (presObj.from < stopYear  && presObj.to > stopYear)))
    }
  }
}
