import Vue from 'vue'
import VueRouter from 'vue-router'

import Singer from '../components/singer/singer.vue'
import Rank from '../components/rank/rank.vue'
import Search from '../components/search/search.vue'
import Recommend from '../components/recommend/recommend.vue'
import singerDetail from '../components/singer/singerDetail.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: '/recommend'

  },
  {
    path: '/recommend',
    name: 'recommend ',
    component: Recommend,
    meta: { index: 0 }
  },
  {
    path: '/singer',
    name: 'Singer ',
    component: Singer,
    meta: { index: 1 },
    children: [


    ]
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
    meta: { index: 3 }
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank,
    meta: { index: 2 }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
