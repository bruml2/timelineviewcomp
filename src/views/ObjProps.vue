<template>
  <div class="objPropsView">
    <h3>This page demonstrates the <b>ObjPropsView</b> component.</h3>
    <div class="codeblock">
      <pre>
        {{ codeBlock }}
      </pre>
    </div>
    <ObjPropsView :showObjProps="true" :obj="tl">
      <!-- all styling of slot must be passed in -->
      <div style="text-align: center">
        This text goes in the slot.
      </div>
    </ObjPropsView>
    <div class="btnContainer">
      <button v-if="showAddBtn" @click="addToTl">Click to add a new property to <i>tl</i></button>
      <button v-else @click="resetTl">No more properties to add! &nbsp; <span style="color: red;">RESET</span></button>
    </div>
  </div>
</template>

<script>
import ObjPropsView from "@/components/ObjPropsView.vue"

export default {
components: { ObjPropsView },
data() {
  return {
    tl: {
          "tlID":         "defaultTimelineID",
          "dbKey":        null,
          "title":        "AP United States History",
          "subtitle":     "(twentieth century)",
    },
    additions: {},
    remainder: {
          "footerHTML":   "This is <b>bold</b> footer text.",
          "startYear":      1900,
          "stopYear":       2000,
          "tickInterval":   10,
          "bgColor":        "bisque",
          "borderWidth":    3,
          "borderColor":    "#C11B17",
          "svgWidth":       1228,
          "svgSideMargin":  20,
          "eraTopMargin":   30,
          "eraHeight":      320, 
          "timeAxisHeight": 50,
    },
    showAddBtn: true,
    codeBlock: `
      <ObjPropsView :showObjProps="true" :obj="tl">
        <!-- all styling of slot must be passed in -->
        <div style="text-align: center">
          This text goes in the slot.
        </div>
      </ObjPropsView>
`
  }
},
created() {
  // clone else same memory reference;
  this.additions = Object.assign({}, this.remainder)
},
methods: {
  addToTl() {
    const firstKey = Object.keys(this.additions)[0]
    // firstKey is a string: requires subscript notation (dot won't work);
    // console.log(`Moving: ${firstKey} with value: ${this.additions[firstKey]}`)
    let newObj = {}
    newObj[firstKey] = this.additions[firstKey]
    // adding a new property to a prop object is not reactive!!
    //   must assign to object reference;
    this.tl = Object.assign({}, this.tl, newObj)
    delete this.additions[firstKey]
    if (Object.keys(this.additions).length == 0) { this.showAddBtn = false }
    // console.log(`length of additions: ${Object.keys(this.additions).length}`)
    // console.log(`length of tl: ${Object.keys(this.tl).length}`)
  },
  resetTl() {
    this.tl = {
      "tlID":     "defaultTimelineID",
      "dbKey":    null,
      "title":    "AP United States History",
      "subtitle": "(twentieth century)",
    }
    this.additions = Object.assign({}, this.remainder)
    this.showAddBtn = true
  }
}
}
</script>

<style scoped>
.codeblock {
  text-align: left;
  font-weight: bold;
}
.objPropsView {
  margin: 0 auto;
  width: 70%;
  text-align: center;
}
.btnContainer {
  display: inline-block;
  margin: 20px auto;
  padding: 10px;
  border: 2px solid red;
}
.btnContainer button {
  font-size: 1.2rem;
}
</style>