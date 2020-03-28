<template>
  <div class="timeline">
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
    }
  },
  methods: {
  }
}
</script>

<style>
.timeline {
  text-align: center;
}
.desc {
  margin: 20px;
}
</style>
