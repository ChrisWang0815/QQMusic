<template>
  <div class="singer" ref="singList" @scroll="scroll">
    <!-- 歌手列表 -->
    <div
      class="list"
      v-for="(item, index) in singerData"
      :key="index"
      ref="listGroup"
    >
      <div class="cate">{{ item.title }}</div>
      <ul>
        <li
          v-for="(item1, index1) in item.items"
          :key="index1"
          @click="singerDetail(item1)"
        >
          <img v-lazy="item1.pic" alt="" />
          <span>{{ item1.name }}</span>
        </li>
      </ul>
    </div>
    <!-- 右侧索引 -->
    <div class="shortCut">
      <ul>
        <li
          :class="{ touch: isActive == index }"
          v-for="(item, index) in shortCutList"
          @touchstart="onShortTouchStart"
          @touchmove="onShortTouchMove"
          @touchend="onShortTouchEnd"
          :key="index"
          :data-index="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- 右侧索引提示 -->

    <div class="tips" v-show="isShowTips" ref="tips">
      {{ shortCutList[isActive] }}
    </div>
    <!-- 分类 -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <!-- 加载 -->
    <div style="margin-top: 50px" v-show="singerData.length == 0">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import loading from "../../base/loading/loading";
import { Lazyload } from "vant";
import Vue from "vue";
Vue.use(Lazyload);
// , getSingerDetail
import { getSingerList } from "../../api/singer";

var shortHeight = 16;
var hotListLength = 10;
var titleHeight = 20;
export default {
  name: "singer",
  components: { loading },
  props: {},
  data() {
    return {
      singerData: [],
      isActive: 0,
      touch: {},
      isShowTips: false,
      listHeight: [],
      scrollY: 0,
      diff: 0,
    };
  },
  watch: {
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0

      if (newY < 0) {
        this.isActive = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (newY >= height1 && newY < height2) {
          this.isActive = i;
          this.diff = height2 - newY;

          return;
        }
      }
      // 在底部
      this.isActive = listHeight.length - 1;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < titleHeight ? newVal - titleHeight : 0;

      this.$refs.fixed.style.transform = "translateY(" + fixedTop + "px)";
      this.$refs.fixed.style.opacity = 1 - Math.abs(fixedTop / titleHeight);
    },
  },
  computed: {
    fixedTitle() {
      if (this.scrollY < 0) {
        return "";
      }
      return this.singerData[this.isActive]
        ? this.singerData[this.isActive].title
        : "";
    },
    shortCutList() {
      return this.singerData.map((item) => {
        return item.title.substr(0, 1);
      });
    },
  },
  methods: {
    singerDetail(e) {
      this.$store.commit("getSingerDetail", e);
      this.$router.push("/singerDetail/" + e.id);
    },
    scroll(pos) {
      this.scrollY = pos.target.scrollTop;
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    onShortTouchEnd() {
      this.isShowTips = false;
    },
    onShortTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY;
      this.$refs.tips.style.top = e.touches[0].pageY + "px";
      let delta = ((this.touch.y2 - this.touch.y1) / shortHeight) | 0;
      let anchorIndex = parseInt(this.touch.index) + delta;

      this.isActive = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortTouchStart(e) {
      let { index } = e.target.dataset;
      this.isShowTips = true;
      this.isActive = index;
      this.touch.y1 = e.touches[0].pageY;
      this.touch.index = index;
      this.$refs.tips.style.top = e.touches[0].pageY + "px";
      this._scrollTo(index);
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        this.isShowTips = false;
        return;
      }
      if (index < 0) {
        this.isShowTips = false;
        index = 0;
      } else if (index > this.$refs.listGroup.length - 1) {
        this.isShowTips = false;
        index = this.$refs.listGroup.length - 1;
      }
      let el = this.$refs.listGroup[index];
      this.$refs.singList.scrollTo(
        0,
        el.offsetTop - this.$refs.singList.offsetTop
      );
    },
    singer(item) {
      return {
        id: item.Fsinger_mid,
        name: item.Fsinger_name,
        pic:
          "http://y.gtimg.cn/music/photo_new/T001R150x150M000" +
          item.Fsinger_mid +
          ".jpg?max_age=2592000",
      };
    },
    async _getSingerList() {
      let singerList = await getSingerList();
      if (singerList.code == 0) {
        let data = singerList.data.list;

        let map = {
          hot: {
            title: "热门",
            items: [],
          },
        };
        data.forEach((item, index) => {
          if (index < hotListLength) {
            map.hot.items.push(this.singer(item));
          }

          const key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: key,
              items: [],
            };
          }
          map[key].items.push(this.singer(item));
        });
        let hot = [];
        let ret = [];
        let nine = [];
        for (const key in map) {
          let val = map[key];
          if (val.title.match(/^[A-Za-z]$/)) {
            ret.push(val);
          } else if (val.title == "热门") {
            hot.push(val);
          } else {
            nine.push(val);
          }
        }

        ret.sort((a, b) => {
          {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0);
          }
        });
        ret = ret.concat(nine);

        return hot.concat(ret);
      }
    },
  },
  async created() {
    this.singerData = await this._getSingerList();
  },
  mounted() {
    setTimeout(() => {
      this._calculateHeight();
    }, 500);
  },
};
</script>
<style lang="less" scoped>
.singer {
  overflow-y: scroll;
  height: 86vh;
  .tips {
    color: white;

    border-radius: 5px;
    width: 30px;
    height: 30px;
    background-color: rgb(27, 216, 90);
    position: absolute;
    right: 25px;
    top: 50px;
    line-height: 30px;
    transform: translateY(-50%);
  }
  .tips::after {
    content: "";
    position: absolute;
    right: -18px;
    top: 4px;
    width: 0px;
    height: 0px;
    border-top: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid rgb(27, 216, 90);
  }
  .shortCut {
    position: fixed;
    right: 0px;
    top: 150px;
    width: 20px;

    li {
      height: 14px;
      margin-bottom: 2px;
      font-size: 12px;
      color: rgb(138, 134, 134);
    }
    .touch {
      font-size: 14px;
      color: rgb(21, 202, 30);
    }
  }
  .list {
    background-color: rgb(228, 227, 227);
    .cate {
      padding-left: 5px;
      font-weight: bold;
      text-align: left;
      line-height: 25px;
      height: 25px;
    }
    li {
      height: 50px;
      background-color: #fff;
      display: flex;
      align-items: center;
      font-size: 14px;
      border-bottom: 0.1px solid rgb(236, 235, 235);
    }
    li :last-child {
      height: 50px;
      background-color: #fff;
      display: flex;
      align-items: center;
      font-size: 14px;
      border-bottom: 1px solid tra;
    }
    img {
      border-radius: 50%;
      margin: 0 20px;
      height: 40px;
      width: 40px;
    }
  }
}
.list-fixed {
  position: absolute;
  top: 90px;
  left: 0;
  width: 100%;
  background-color: rgb(255, 255, 255);
  border-bottom: 1px solid rgb(21, 202, 30);
  color: rgb(21, 202, 30);

  .fixed-title {
    padding-left: 5px;
    font-weight: bold;
    text-align: left;
    line-height: 25px;
    height: 30px;
  }
}
</style>