import Vue from 'vue'
import VueRouter from 'vue-router'

// import all router "view" components;
import Home     from '../views/Home.vue'
import Timeline from '../views/Timeline.vue'
import TimeAxis from '../views/TimeAxis.vue'
import ObjProps from '../views/ObjProps.vue'
import Concepts from '../views/Concepts.vue'
import Documentation from '../views/Documentation.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: Timeline
  },
  {
    path: '/timeAxis',
    name: 'TimeAxis',
    component: TimeAxis
  },
  {
    path: '/objProps',
    name: 'ObjProps',
    component: ObjProps
  },
  {
    path: '/concepts',
    name: 'Timeline Concepts',
    component: Concepts
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/docs',
    name: 'Documentation',
    component: Documentation
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
