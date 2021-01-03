<template>
  <div class="rank">
    <div class="topList" ref="topList">
      <div
        class="top"
        v-for="(item, index) in topList"
        :key="index"
        @click="setItem(item)"
      >
        <div class="songs">
          <div class="title">{{ item.topTitle }}</div>
          <ul>
            <li class="song" v-for="(e, i) in item.songList" :key="i">
              <span>{{ e.songname }} - </span>
              <span style="color: gray">{{ e.singername }}</span>
            </li>
          </ul>
        </div>
        <div class="img">
          <img :src="item.picUrl" alt="" />
          <div class="listenCount">
            <van-icon
              style="vertical-align: middle"
              name="service-o"
              color="white"
            />
            <span>{{ item.listenCount }}</span>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { getTopList } from "../../api/rank";
import { playlistMixin } from "../../common/js/mixin";
export default {
  name: "rank",
  mixins: [playlistMixin],
  components: {},
  props: {},
  data() {
    return {
      topList: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    setItem(e) {
      this.$router.push({
        path: `rank/${e.id}`,
      });
    },
    handlePlaylist(playList) {
      let bottom = playList.length > 0 ? "45px" : "";
      this.$refs.topList.style.marginBottom = bottom;
    },
    tranNumber(num) {
      let numStr = num.toString();

      if (numStr.length > 4) {
        return parseInt(num / 10000) + "万";
      } else if (numStr.length > 8) {
        return parseInt(num / 100000000) + "亿";
      } else {
        return numStr;
      }
    },
  },
  async created() {
    let result = await getTopList();
    if (result.code == 0) {
      result.data.topList.forEach((e) => {
        e.listenCount = this.tranNumber(e.listenCount);
      });
      this.topList = result.data.topList;
      console.log(this.topList);
    }
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.rank {
  background: rgb(230, 228, 228);
  overflow-y: scroll;
  height: 86vh;
  .rank::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .top {
    background: white;
    display: flex;
    justify-content: space-between;
    width: 95vw;
    height: 26.667vw;
    overflow: hidden;
    border-radius: 2.667vw;
    margin: 8px auto;

    .title {
      font-size: 14px;
      font-weight: 700;
      margin: 8px 0;
    }
    .songs {
      padding-left: 8px;
      text-align-last: left;
      width: 68vw;
      overflow: hidden;
      li {
        margin-bottom: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span {
        font-size: 12px;
      }
    }
    .img {
      position: relative;
      height: 100%;
      width: 26.667vw;
      img {
        height: 100%;
        width: 100%;
      }
      .listenCount {
        position: absolute;
        bottom: 0;
        text-align: left;
        width: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding-left: 50px;
        span {
          display: inline-block;
          color: white;
          font-size: 12px;
        }
      }
    }
  }
}
</style>