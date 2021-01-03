
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { shuffle } from '../common/js/random'
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export default new Vuex.Store({
  state: {
    isLogin: false,
    user: {},
    SingerDetail: {},
    topListDetail: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    currentIndex: -1,

    topList: {},
    mode: 0,
    playMode: {
      sequence: 0,
      loop: 1,
      random: 2
    },
    Disc: {},
    searchHistory: []
  },
  mutations: {
    setLogin(state, val) {

      state.user = val[0]
      state.isLogin = val[1]
    },
    deleteSHistory(state) {

      state.searchHistory = []
    },
    setSearchHistory(state, value) {

      if (!state.searchHistory.some((item) => {
        return item == value
      })) {
        state.searchHistory.push(value)
      }

    },
    getTopListDetail(state, value) {
      state.topListDetail = value
    },
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
    insertSong: function ({ commit, state }, song) {

      let playlist = JSON.parse(JSON.stringify(state.playList))
      let sequenceList = JSON.parse(JSON.stringify(state.sequenceList))
      let currentIndex = state.currentIndex
      // 记录当前歌曲
      let currentSong = playlist[currentIndex]
      // 查找当前列表中是否有待插入的歌曲并返回其索引
      let fpIndex = findIndex(playlist, song)
      // 因为是插入歌曲，所以索引+1
      currentIndex++
      // 插入这首歌到当前索引位置
      playlist.splice(currentIndex, 0, song)
      // 如果已经包含了这首歌
      if (fpIndex > -1) {
        // 如果当前插入的序号大于列表中的序号
        if (currentIndex > fpIndex) {
          playlist.splice(fpIndex, 1)
          currentIndex--
        } else {
          playlist.splice(fpIndex + 1, 1)
        }
      }

      let currentSIndex = findIndex(sequenceList, currentSong) + 1

      let fsIndex = findIndex(sequenceList, song)

      sequenceList.splice(currentSIndex, 0, song)

      if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
          sequenceList.splice(fsIndex, 1)
        } else {
          sequenceList.splice(fsIndex + 1, 1)
        }
      }
      commit('setPlaylist', playlist)

      commit('setSequenceList', sequenceList)
      commit('setCurrentIndex', currentIndex)
      commit('setFullScreen', true)
      commit('setPlaying', true)


    },
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
