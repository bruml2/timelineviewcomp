<template>
  <div class="timeline">
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
  margin: 10px 30px;
  text-align: center;
}
.desc {
  margin: 20px;
}
</style>
