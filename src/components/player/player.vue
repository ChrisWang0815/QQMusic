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
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <!-- 歌曲部分 -->

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
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>

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
          </div>

          <!-- 歌词部分 -->

          <div class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                >
                  {{ line.txt }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 播放器 -->
        <audio
          @canplay="getDuration1"
          @play="ready"
          @timeupdate="onTimeupdate"
          :src="song"
          @ended="end"
          ref="audio"
        ></audio>
        <div class="control" v-show="active == 0">
          <!-- 播放进度  -->
          <div class="process">
            <div>
              <p style="color: white">{{ now }}</p>
            </div>
            <van-slider
              active-color="skyblue"
              style="margin: 0 10px"
              v-model="time"
              @change="onChange"
            />
            <div>
              <p style="color: white">{{ duration }}</p>
            </div>
          </div>
          <!--歌曲操作 -->
          <van-grid :column-num="5">
            <van-grid-item @click.stop="changeMode"
              ><i class="iconfont" :class="iconMode"></i>
              <span style="margin-top: 8px" class="van-grid-item__text"
                >模式</span
              >
            </van-grid-item>
            <van-grid-item
              icon="arrow-up"
              @click.stop="selectSong(-1)"
              text="上一首"
            />
            <van-grid-item
              @click.stop="togglePlaying"
              :icon="play"
              text="播放"
            />
            <van-grid-item
              icon="arrow"
              @click.stop="selectSong(1)"
              text="下一首"
            />
            <van-grid-item icon="like-o" text="喜欢" />
          </van-grid>
        </div>
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
          :class="cdCls"
          :src="currentSong.image"
        />
      </div>
      <div class="info">
        <div
          style="font-weight: 800; font-size: 13px"
          v-html="currentSong.name"
        ></div>
        <div
          class="bTitle"
          v-html="currentSong.singer + '●' + currentSong.album"
        ></div>
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
import { shuffle } from "../../common/js/random.js";
import Lyric from "lyric-parser";
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
      playingLyric: "",
      currentLineNum: 0,
      active: 0,
      songList: [
        "http://music.xf1433.com/up/view.php/91398d9fe924dd2effa0a5f8708a7a72.mp3",
        "http://music.xf1433.com/up/view.php/166bf988eb239f4aad0f843425af5c28.mp3",
        "http://music.xf1433.com/up/view.php/10e5f0c2971efd75fedc4ccf3468d679.mp3",
      ],
      song:
        "http://music.xf1433.com/up/view.php/91398d9fe924dd2effa0a5f8708a7a72.mp3",
      duration: "",
      value: 50,
      time: 0,
      now: "0:00",
      currentTime: 0,
      songReady: false,
      currentLyric: "",
    };
  },
  watch: {
    currentIndex(value) {
      this.currentSong = this.playList[value];
    },
    currentTime(value) {
      this.getDuration(value);
      this.time = (value / this.$refs.audio.duration) * 100;
    },

    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        return;
      }
      if (newSong.id === oldSong.id) {
        return;
      }
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      this.$refs.audio.currentTime = 0;
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        this.$refs.audio.play();
        this.setPlaying(true);
        // this.getLyric();
        this.gerLyric();
      }, 1000);
    },

    playing(newPlaying) {
      const audio = this.$refs.audio;

      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
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
    iconMode() {
      return this.mode == this.playMode.sequence
        ? "icon-repeat-copy"
        : this.mode == this.playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
    play() {
      return this.playing == true ? "pause - circle - o" : "play - circle - o";
    },
    cdCls() {
      return this.playing ? "play" : "play pause";
    },

    ...mapState([
      "fullScreen",
      "playList",
      "currentIndex",
      "playing",
      "mode",
      "playMode",
      "sequenceList",
    ]),
  },
  methods: {
    middleTouchStart(e) {
      this.touch.initiated = true;
      // 用来判断是否是一次移动
      this.touch.moved = false;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      if (!this.touch.moved) {
        this.touch.moved = true;
      }
      const left = this.active === 0 ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.style.transform = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.style.transitionDuration = 0;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style.transitionDuration = 0;
    },
    middleTouchEnd() {
      if (!this.touch.moved) {
        return;
      }
      let offsetWidth;
      let opacity;
      if (this.active === 0) {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.active = 1;
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.active = 0;
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const time = 300;
      this.$refs.lyricList.style.transform = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.style.transitionDuration = `${time}ms`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style.transitionDuration = `${time}ms`;
      this.touch.initiated = false;
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        this.$refs.lyricList.scrollTo({
          top: (lineNum - 5) * 32,
          left: 0,
          behavior: "smooth",
        });
      } else {
        this.$refs.lyricList.scrollTo(0, 0);
      }
      this.playingLyric = txt;
    },
    async gerLyric() {
      let lyric = await this.currentSong.getLyric();
      this.currentLyric = new Lyric(lyric, this.handleLyric);
      if (this.playing) {
        this.currentLyric.play();
      }
    },
    ready() {
      this.songReady = true;
      //this.savePlayHistory(this.currentSong);
    },
    end() {
      if (this.mode === this.playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      this.setPlaying(true);
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    next() {
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.song =
        this.song == this.songList[0]
          ? this.songList[1]
          : this.song == this.songList[1]
          ? this.songList[2]
          : this.songList[0];

      this.songReady = false;
    },
    changeMode() {
      let mode = this.mode;
      this.setMode((mode + 1) % 3);
      var list;
      if ((mode = this.playMode.random)) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlaylist(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id == this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    selectSong(index) {
      let length = this.playList.length;
      if (this.mode === this.playMode.loop) {
        console.log(1);
        this.loop();
        return;
      }
      if (this.currentIndex == 0 && index == -1) {
        this.setCurrentIndex(length - 1);
        return;
      } else if (this.currentIndex == length - 1 && index == 1) {
        this.setCurrentIndex(0);
      }
      this.setCurrentIndex(this.currentIndex + index);
      this.song =
        this.song == this.songList[0]
          ? this.songList[1]
          : this.song == this.songList[1]
          ? this.songList[2]
          : this.songList[0];
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
    getDuration1() {
      let my_time = this.$refs.audio.duration;
      var hours = my_time / 60 / 60;
      var hoursRound = Math.floor(hours);
      var minutes = my_time / 60 - 60 * hoursRound;
      var minutesRound = Math.floor(minutes);
      let seconds = my_time - 60 * 60 * hoursRound - 60 * minutesRound;
      seconds = parseInt(seconds);
      seconds = seconds < 10 ? "0" + seconds : seconds;
      if (hoursRound == 0) {
        this.duration = minutesRound + ":" + seconds;
      } else {
        this.duration = hoursRound + ":" + minutesRound + ":" + seconds;
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
      if (!this.songReady) {
        return;
      }
      this.setPlaying(!this.playing);
      this.currentLyric.togglePlay();
    },
    changeTabs(v) {
      if (this.active == v) {
        return;
      }
      if (v == 1) {
        let offsetWidth = -window.innerWidth;
        const time = 300;
        this.$refs.lyricList.style.transform = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.style.transitionDuration = `${time}ms`;
        this.$refs.middleL.style.opacity = 0;
        this.$refs.middleL.style.transitionDuration = `${time}ms`;

        this.active = v;
      } else {
        const time = 300;
        this.$refs.lyricList.style.transform = `translate3d(0,0,0)`;
        this.$refs.lyricList.style.transitionDuration = `${time}ms`;
        this.$refs.middleL.style.opacity = 1;
        this.$refs.middleL.style.transitionDuration = `${time}ms`;

        this.active = v;
      }
    },
    ...mapMutations([
      "setFullScreen",
      "setPlaying",
      "setCurrentIndex",
      "setMode",
      "setPlaylist",
    ]),
    back() {
      this.setFullScreen(false);
    },
  },
  created() {
    this.touch = {};
  },

  mounted() {
    this.getDuration1(this.$refs.audio.duration);
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
.control {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 10px;
}
.playing-lyric {
  color: rgb(223, 223, 223);
}
.middle-r {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
  height: 100%;
  .text {
    height: 18px;
    line-height: 18px;
    font-size: 14px;
    color: rgb(196, 195, 195);
  }
  .current {
    color: white;
    font-size: 18px;
  }
}
.process {
  display: flex;
  justify-content: center;
  align-items: center;
}
.bTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
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
    overflow: hidden;
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
  .iconfont {
    color: white;

    font-size: 28px;
  }
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