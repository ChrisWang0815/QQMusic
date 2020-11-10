<template>
  <div class="player" v-show="playList.length > 0">
    <!-- 全屏 -->
    <transition name="slide-fade">
      <div class="fullScreen" v-show="fullScreen">
        <!-- 背景 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <!-- 导航 -->

        <van-nav-bar class="nav" left-arrow @click-left="back" />

        <div class="tab">
          <div
            class="tabs"
            @click="changeTabs(0)"
            :class="[active == 0 ? 'isActive' : '']"
          >
            歌曲
          </div>
          <div
            class="tabs"
            :class="[active == 1 ? 'isActive' : '']"
            @click="changeTabs(1)"
          >
            歌词
          </div>
        </div>
        <!-- 歌曲部分 -->
        <transition name="slide-fade1">
          <div v-show="active == 0">
            <div class="middle-l" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd" :class="cdCls">
                  <img class="image" :src="currentSong.image" />
                </div>
              </div>
              <div class="top">
                <h4 class="title" v-html="currentSong.name"></h4>
                <h5
                  class="subtitle"
                  v-html="currentSong.singer + '·' + currentSong.album"
                ></h5>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">歌词</div>
              </div>
              <!--歌曲操作 -->
              <van-grid :column-num="3">
                <van-grid-item
                  icon="arrow-up"
                  @click="selectSong(-1)"
                  text="上一首"
                />
                <van-grid-item
                  @click="togglePlaying"
                  :icon="play"
                  text="播放"
                />
                <van-grid-item
                  icon="arrow"
                  @click="selectSong(1)"
                  text="下一首"
                />
              </van-grid>
              <!-- 音量 -->

              <van-slider
                v-show="showVolumn"
                vertical
                active-color="rgb(21, 202, 30)"
                class="volumn"
                v-model="value"
                @input="oninput"
              >
                <template #button>
                  <div class="custom-button">{{ value }}</div>
                </template></van-slider
              >

              <!-- 播放进度  -->
              <van-slider
                active-color="skyblue"
                style="margin-top: 20px"
                v-model="time"
                @change="onChange"
              />
              <div style="">
                <p style="color: white">{{ now }}/{{ currentSong.duration }}</p>
              </div>
            </div>
          </div></transition
        ><transition name="slide-fade2">
          <!-- 歌词部分 -->
          <div class="lyric" v-show="active == 1">歌词</div></transition
        >
        <audio
          @timeupdate="onTimeupdate"
          src="../../陶喆 - 爱，很简单 (Live).mp3"
          ref="audio"
        ></audio>
      </div>
    </transition>
    <!-- 底部 -->
    <div
      class="bottom"
      @click.prevent="setFullScreen(true)"
      v-show="!fullScreen"
    >
      <div class="circle">
        <van-circle
          layer-color="#e5e5e5"
          v-model="time"
          size="38px"
          color="#13c077"
        />
        <van-image
          round
          fit="fill"
          class="albumImg"
          width="30px"
          height="30px"
          :src="currentSong.image"
        />
      </div>
      <div class="info">
        <div
          style="font-weight: 800; font-size: 13px"
          v-html="currentSong.name"
        ></div>
        <div v-html="currentSong.singer + '·' + currentSong.album"></div>
      </div>
      <div class="play1">
        <van-icon
          class="icon"
          @click.stop="togglePlaying"
          size="30"
          color="#13c077"
          :name="play"
        />
        <van-icon
          class="icon"
          @click.stop="selectSong(1)"
          size="30"
          color="#13c077"
          name="arrow"
        />
      </div>
    </div>
  </div>
</template>

<script>
//:title="playList[currentIndex].name"
import { mapState, mapMutations } from "vuex";
var timer;
export default {
  components: {},
  props: {},
  data() {
    return {
      currentSong() {
        return this.playList[this.currentIndex] || {};
      },
      showVolumn: false,
      active: 0,
      value: 50,
      time: 0,
      now: "0:00",
      currentTime: 0,
    };
  },
  watch: {
    currentIndex(value) {
      this.currentSong = this.playList[value];
    },
    currentTime(value) {
      this.getDuration(value);
      this.time = (value / this.currentSong.durationSecond) * 100;
    },

    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        return;
      }
      if (newSong.id === oldSong.id) {
        return;
      }
      this.$refs.audio.currentTime = 0;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.audio.play();
        this.setPlaying(true);
        // this.getLyric();
      }, 1000);
    },

    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
        audio.volume = 0.5;
      });
    },
    value() {
      this.showVolumn = true;

      clearTimeout(timer);
      timer = setTimeout(() => {
        this.showVolumn = false;
      }, 3000);
    },
  },
  computed: {
    play() {
      return this.playing == true ? "pause - circle - o" : "play - circle - o";
    },
    cdCls() {
      return this.playing ? "play" : "play pause";
    },

    ...mapState(["fullScreen", "playList", "currentIndex", "playing"]),
  },
  methods: {
    selectSong(index) {
      let length = this.playList.length;
      if (this.currentIndex == 0 && index == -1) {
        this.setCurrentIndex(length - 1);
        return;
      } else if (this.currentIndex == length - 1 && index == 1) {
        this.setCurrentIndex(0);
      }
      this.setCurrentIndex(this.currentIndex + index);
    },

    onTimeupdate(e) {
      this.currentTime = parseInt(e.target.currentTime);
    },
    getDuration(my_time) {
      var hours = my_time / 60 / 60;
      var hoursRound = Math.floor(hours);
      var minutes = my_time / 60 - 60 * hoursRound;
      var minutesRound = Math.floor(minutes);
      let seconds = my_time - 60 * 60 * hoursRound - 60 * minutesRound;
      seconds = parseInt(seconds);
      seconds = seconds < 10 ? "0" + seconds : seconds;
      if (hoursRound == 0) {
        this.now = minutesRound + ":" + seconds;
      } else {
        this.now = hoursRound + ":" + minutesRound + ":" + seconds;
      }
    },
    onChange(value) {
      const audio = this.$refs.audio;
      audio.currentTime = (audio.duration * value) / 100;
      this.getDuration(audio.currentTime);
    },
    oninput(value) {
      const audio = this.$refs.audio;
      audio.volume = value / 100;
    },
    togglePlaying() {
      this.setPlaying(!this.playing);
    },
    changeTabs(v) {
      this.active = v;
    },
    ...mapMutations(["setFullScreen", "setPlaying", "setCurrentIndex"]),
    back() {
      this.setFullScreen(false);
    },
  },
  created() {},
  mounted() {
    document.onkeydown = (e) => {
      let value = this.value;
      let key = e.keyCode;

      if (key == 38) {
        value = value + 10;
      }
      if (key == 40) {
        value = value - 10;
      }
      const audio = this.$refs.audio;
      if (value > 100) {
        this.value = 100;
      } else if (value < 0) {
        this.value = 0;
      } else {
        this.value = value;
      }

      audio.volume = this.value / 100;
    };
  },
};
</script>
<style lang="less" scoped>
.bottom {
  .circle {
    position: relative;
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    .albumImg {
      position: absolute;
      top: 4px;
      left: 25px;
    }
  }
  .info {
    font-size: 12px;
    flex: 3;
  }
  .play1 {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 80px;
  }
  position: fixed;
  z-index: 999;
  bottom: 0;
  left: 0;
  width: 100vw;
  background: rgb(239, 240, 239);
  border: 1px solid rgb(216, 215, 215);
  height: 45px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.player {
  .volumn {
    position: fixed;
    right: 20px;
    top: 45vh;

    height: 82px;
  }
  /deep/.van-slider__button {
    width: 7px;
    height: 7px;
  }
  /deep/.van-hairline::after {
    border: transparent;
  }
  .fullScreen {
    /deep/.van-icon::before {
      color: rgb(243, 242, 241);
    }
  }
  /deep/.van-grid-item__text {
    color: white;
  }
  /deep/.van-grid-item__content {
    background: transparent;
  }
  .tab {
    position: fixed;
    left: 50%;
    top: 13px;
    transform: translateX(-50%);
    height: 20px;
    line-height: 20px;
    width: 50vw;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    .tabs {
      padding: 0 5px;
      color: rgb(139, 136, 136);
    }
    .isActive {
      color: white;
    }
  }
  h4 {
    margin: 10px 0;
    color: white;
  }
  h5 {
    margin: 0 0 20px 0;
    color: rgb(218, 216, 216);
  }
  .fullScreen {
    position: fixed;

    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: black;
    z-index: 999;
  }
  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);
  }
  /deep/.van-nav-bar__title,
  /deep/.van-nav-bar__text {
    color: white;
  }
  /deep/ .van-icon-arrow-left::before {
    color: white;
  }
  /deep/.van-nav-bar {
    background: transparent;
  }
  .van-hairline--bottom::after {
    border-bottom-width: 0px;
  }

  /deep/.van-icon-arrow-left::before,
  /deep/.van-icon-arrow-up::before {
    transform: rotate(-90deg);
  }
  .middle {
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 170px;
    white-space: nowrap;
    font-size: 0;
  }
  .middle-l {
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 80%;
  }
  .cd-wrapper {
    position: absolute;
    left: 10%;
    top: 0;
    width: 80%;
    height: 100%;
  }
  .cd {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 10px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  .play {
    animation: rotate 20s linear infinite;
  }
  .pause {
    animation-play-state: paused;
  }
  .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .custom-button {
    width: 26px;
    color: #fff;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
    background-color: #0b9e12;
    border-radius: 100px;
  }
}
.lyric {
  position: absolute;
  top: 46px;
  left: 0;
  text-align: center;
  width: 100vw;
  color: white;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(100vh);
  opacity: 0.5;
}
.slide-fade1-enter-active,
.slide-fade1-leave-active {
  transition: all 0.3s ease;
}
.slide-fade1-enter, .slide-fade1-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(-100vw);
  opacity: 0.5;
}
.slide-fade2-enter-active,
.slide-fade2-leave-active {
  transition: all 0.3s ease;
}

.slide-fade2-enter, .slide-fade2-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(100vw);
  opacity: 0.5;
}
</style>