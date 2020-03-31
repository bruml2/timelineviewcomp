/* TLVUtilsMixin.js  v. 0.1  Mar 28 2020 */

export const TLVUtilsMixin = {
  data() {
    return {
      basicProps: [
        "startYear",
        "stopYear",
        "tickInterval",
        "svgWidth",
        "svgSideMargin",
        "eraTopMargin",
        "eraHeight"
      ]
    }
  },
  methods: {
    basicPropsValid (tl) {
      this.basicProps.reduce(function(acc,val){
        if (tl.hasOwnProperty(val)) {return false} else {return acc}
        },
        true
      )
    }
  }
}
