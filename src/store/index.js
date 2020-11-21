
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { shuffle } from '../common/js/random'
export default new Vuex.Store({
  state: {
    SingerDetail: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    currentIndex: -1,
    disc: {},
    topList: {},
    mode: 0,
    playMode: {
      sequence: 0,
      loop: 1,
      random: 2
    },
    Disc: {}
  },
  mutations: {
    getDiscDetail(state, value) {
      state.Disc = value
    },
    getSingerDetail(state, value) {
      state.SingerDetail.pic = value.pic
    },
    setPlaying(state, value) {
      state.playing = value
    },
    setFullScreen(state, value) {
      state.fullScreen = value
    },
    setPlaylist(state, value) {
      state.playList = value
    },
    setSequenceList(state, value) {
      state.sequenceList = value
    },
    setMode(state, value) {

      state.mode = value
    }, setCurrentIndex(state, value) {
      state.currentIndex = parseInt(value)
    },
  },
  actions: {
    selectPlay({ commit, state }, { list, index }) {
      if (state.mode == 2) {
        let randomList = shuffle(list)
        commit('setPlaylist', randomList)

        index = randomList.findIndex((item) => {
          return item.id == list[index].id
        })

      } else {
        commit('setPlaylist', list)
      }
      commit('setSequenceList', list)
      commit('setCurrentIndex', index)
      commit('setFullScreen', true)
      commit('setPlaying', true)

    },
    selectRandom({ commit }, { list, index }) {
      commit('setSequenceList', list)
      let list1 = shuffle(list)
      commit('setPlaylist', list1)
      commit('setCurrentIndex', index)
      commit('setFullScreen', true)
      commit('setPlaying', true)

    }


  },
  modules: {
  }
})
