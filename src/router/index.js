import Vue from 'vue'
import VueRouter from 'vue-router'

import Singer from '../components/singer/singer.vue'
import Rank from '../components/rank/rank.vue'
import Search from '../components/search/search.vue'
import Recommend from '../components/recommend/recommend.vue'
import singerDetail from '../components/singer/singerDetail.vue'
import disc from '../components/disc/disc.vue'
import topList from '../components/rank/topList.vue'
import me from '../components/me/me.vue'
import info from '../components/me/info.vue'
import login from '../components/me/login.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: '/recommend'

  },
  {
    path: "/login",
    component: login
  },
  {
    path: '/recommend',
    name: 'recommend ',
    component: Recommend,
    meta: { index: 0 },
    children: [{
      path: ':id',
      name: 'disc',
      component: disc,
    }]
  },
  {
    path: '/singer',
    name: 'Singer ',
    component: Singer,
    meta: { index: 1 },

  },
  {
    path: '/singerDetail/:id',
    name: 'SingerDetail ',
    component: singerDetail,
  },

  {
    path: '/search',
    name: 'Search',
    component: Search,

  },
  {
    path: '/me',
    name: 'me',
    component: me,
    meta: { index: 3 },
    children: [{
      path: ':id',
      name: 'userinfo',
      component: info,
    }]
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank,
    meta: { index: 2 },
    children: [{
      path: ':id',
      name: 'topList',
      component: topList,
    }]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
