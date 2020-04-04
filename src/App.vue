<template>
  <div id="app">
    <div id="app-nav">
      <img
        alt="Ruml portrait"
        src="@/assets/self-villa2013.20k.jpg"
        width="60"
      />
      <div id="app-title-version">
        <span id="app-title">The TimelineView Component</span><br />
        <span id="app-subtitle">and friends &nbsp; </span
        ><span id="app-version">[{{ version }}]</span>
      </div>
      <div id="app-links">
        <!-- router/index.js: the views/*vue component to display for each route; -->
        <router-link to="/">Home</router-link> |
        <router-link to="/timeline">TimelineView Comp</router-link> |
        <router-link to="/timeAxis">TimeAxisView Comp</router-link> <br />
        <router-link to="/objProps">ObjPropsView Comp</router-link> |
        <router-link to="/concepts">Timeline Concepts</router-link> |
        <router-link to="/docs">Documentation</router-link>
      </div>
    </div>
    <transition name="fade" appear>
      <!-- name (fade) prefixes classes -->
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      version: process.env.VUE_APP_VERSION,
    }
  },
}
</script>

<style>
* {
  box-sizing: border-box;
}
#app {
  font-family: Palatino, "New Times Roman", Times, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* color: #2c3e50; */
}
#app-nav {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
}
#app-title-version {
  font-family: Palatino, "New Times Roman", Times, serif;
  text-align: center;
}
#app-title {
  font-size: 1.7rem;
  font-weight: bold;
}
#app-subtitle {
  font-weight: bold;
  font-size: 1.1rem;
}
#app-version {
  font-size: 0.8rem;
}
#app-nav {
  background-color: cornsilk;
  border-bottom: 1px solid gray;
}
#app-links {
  text-align: center;
  line-height: 1.6;
}
#app-links a {
  font-weight: bold;
  color: #2c3e50;
}
#app-links a:hover {
  color: blue;
}
#app-links a.router-link-exact-active {
  color: #42b983;
}
.fade-enter- ctive,
.fade-leave-active {
  transition: o0pacity 0.75s;
}
.fade enter,
.fade-leave-to {
  opacity: 0;
}
</style>
