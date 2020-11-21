<template>
  <transition name="fade">
    <div class="singDetail" ref="singDetail" @scroll="scroll">
      <van-sticky>
        <van-nav-bar
          :title="singerDetail.name"
          left-text="返回"
          left-arrow
          @click-left="$router.back()"
      /></van-sticky>
      <div class="singerImg">
        <img
          ref="bgImage"
          @click="show = true"
          class="singerImg"
          :src="$store.state.SingerDetail.pic"
          alt=""
        />
      </div>
      <!-- 歌曲列表 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <SongList style="margin-top: 300px" :songs="songs"></SongList>
      </van-list>
      <!-- 图片预览 -->
      <van-image-preview v-model="show" :images="images">
        <template v-slot:index>{{ singerDetail.name }}</template>
      </van-image-preview>
      <!-- 加载 -->
      <div style="margin-top: 50px" v-show="songs.length == 0">
        <loading></loading>
      </div>
    </div>
  </transition>
</template>

<script>
import loading from "../../base/loading/loading";
import { getSingerDetail } from "../../api/singer";
import { createSong } from "../../common/js/song";
import SongList from "../../base/songList/songList";

var id;
export default {
  name: "songDetail",
  components: { SongList, loading },
  props: {},
  data() {
    return {
      show: false,
      loading: false,
      finished: false,
      singerDetail: {},
      songs: [],
      begin: 1,
      scrollY: 0,
    };
  },
  watch: {
    scrollY(newVal) {
      let scale = 1;
      const percent = Math.abs(newVal / 300);
      if (newVal < 100 && newVal > 0) {
        scale = 1 + percent;
        this.$refs.bgImage.style["transform"] = `scale(${scale})`;
      }
    },
  },
  computed: {
    images() {
      if (this.$store.state.SingerDetail != {}) {
        return this.$store.state.SingerDetail.pic.split(",");
      } else {
        return "";
      }
    },
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.target.scrollTop;
    },
    onLoad() {
      setTimeout(async () => {
        let singerDetail = await getSingerDetail(id, 20 * this.begin, 20);
        let newSongs = this._normalizeSongs(singerDetail.data.list);
        if (newSongs != []) {
          this.loading = false;
        }
        this.begin++;
        this.songs = this.songs.concat(newSongs);
        if (!newSongs.length) {
          this.finished = true;
        }
      }, 1000);
    },
    async _getSingerDetail() {
      let singerDetail = await getSingerDetail(id, 0, 20);
      if (singerDetail.code == 0) {
        this.songs = this._normalizeSongs(singerDetail.data.list);

        this.singerDetail = {
          name: singerDetail.data.singer_name,
          mid: singerDetail.data.singer_mid,
        };
      }
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((item) => {
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
  },

  created() {
    this.i = 0;
    id = this.$route.params.id;
    this._getSingerDetail();
  },

  beforeMount() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(100vw);
}
.singDetail {
  overflow-y: scroll;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(255, 255, 255);
  z-index: 9;
  /deep/.van-nav-bar__title,
  /deep/.van-nav-bar__text {
    color: rgb(21, 202, 30);
  }
  /deep/ .van-icon-arrow-left::before {
    color: rgb(21, 202, 30);
  }
  .singerImg {
    transition: all 0.2s;
    width: 100vw;
    filter: blur(2px);
  }
  .singerImg {
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>