<template>
  <div class="timeline">
    <div class="builddate">[built: {{ builddate }}]</div>
    <div class="view">Timeline view</div>

    <div class="btns">
      <span>Demonstrating that changes within parent affect the TimelineView component below: &nbsp; &nbsp; </span>
      <button class="button" @click="changeProperty">Change Title Value</button>
      &nbsp; &nbsp;
      <button class="button" @click="addProperty">Add a new property</button>
      &nbsp; &nbsp;
      <button class="button" @click="addEra">Add a new era</button>
    </div>



    <h2>Examples of the use of the TimelineView component</h2>
    <div class="timelineView">
      <div class="desc">This is a default TimelineView component; timeline prop is {}: </div>
      <!-- must bind to signal that value is JS not a string -->
      <TimelineView timelineID="timelineA" :timeline="{}" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import TimelineView from '@/components/TimelineView.vue'

export default {
  name: 'Home',
  components: {
    TimelineView
  },
  data() {
    return {
      foo: {}
    }
  },
  async created() {
    this.foo = await this.getFoo()
  },
  methods: {
    getFoo() {
      console.log("getFoo called")
    }
  }
}
</script>

<style>
.timeline {
  position: relative;
  margin: 5px 0 80px 0;
  padding: 20px;
  text-align: center;
  border: 1px solid black;
}
 .timeline .builddate {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  font-size: 0.8rem;
}
 .timeline .view {
  position: absolute;
  top: 0.1rem;
  left: 0.4rem;
  font-size: 1.2rem;
  font-weight: bold;
}
.btns {
  margin: 30px;
}
</style>
