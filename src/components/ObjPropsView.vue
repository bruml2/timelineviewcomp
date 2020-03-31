<template>
  <!-- obj-props-view component: Mar 31 2020; v0.1 -->
  <div class="objPropsView" v-if="showObjProps">
    <slot></slot>
    <ul :style="{ 'column-count': numCols }">
      <li v-for="(value, prop, idx) in obj" :key="idx">
        {{ idx+1 }}. &nbsp; <b>{{ prop }}:</b> {{ value }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    showObjProps: {
      type: Boolean,
      default: false
    },
    obj: {
      type: Object,
      required: true
    }
  },
  computed: {
    numCols() {
      return Object.keys(this.obj).length > 14 ? "3" : (Object.keys(this.obj).length > 5 ? "2" : "1")
    }
  }
}
</script>

<style scoped>
.objPropsView {
  padding: 10px 0;
  background: cornsilk;
  border: 8px solid palegreen;
}
.objPropsView ul {
  text-align: left;
  column-width: auto;
  list-style-type: none;
}
</style>