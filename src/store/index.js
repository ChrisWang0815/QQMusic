import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
    mode: {
      sequence: 0,
      loop: 1,
      random: 2
    }
  },
  mutations: {
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
      state.sequenceList = value
    }, setCurrentIndex(state, value) {
      state.currentIndex = parseInt(value)
    },
  },
  actions: {
    selectPlay({ commit }, { list, index }) {
      commit('setSequenceList', list)
      commit('setPlaylist', list)
      commit('setCurrentIndex', index)
      commit('setFullScreen', true)
      commit('setPlaying', true)

    }

  },
  modules: {
  }
})
