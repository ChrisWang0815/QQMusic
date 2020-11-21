<template>
  <div class="recommend">
    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#13c077">
      <van-swipe-item class="c" v-for="(item, index) in swipe" :key="index">
        <a :href="item.linkUrl"><img v-lazy="item.picUrl" /></a
      ></van-swipe-item>
    </van-swipe>

    <!-- 热门歌单推荐 -->
    <div class="rec">热门歌单推荐</div>

    <div class="discList">
      <div
        class="discItem"
        v-for="(item, index) in discList"
        @click="setItem(item)"
        :key="index"
      >
        <div class="discImg">
          <img v-lazy="item.imgurl" alt="" />
        </div>
        <div class="discInfo">
          <div class="discName">{{ item.dissname }}</div>
          <div class="dissname">{{ item.creator.name }}</div>
        </div>
      </div>
    </div>
    <!-- 加载 -->
    <div class="loading" v-show="discList.length == 0">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import loading from "../../base/loading/loading";

import { getRecommend, getDiscList } from "../../api/recommend";
import { Lazyload } from "vant";

import Vue from "vue";

Vue.use(Lazyload);
export default {
  name: "recommend",
  components: { loading },
  props: {},
  data() {
    return {
      swipe: [],
      discList: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    setItem(e) {
      this.$router.push({
        path: `recommend/${e.dissid}`,
      });
      this.$store.commit("getDiscDetail", e);
    },
  },
  async created() {
    let recommend = await getRecommend();
    let discList = await getDiscList();

    if (recommend.code == 0) {
      this.swipe = recommend.data.slider;
    }
    if (discList.code == 0) {
      this.discList = discList.data.list;
    }
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.recommend {
  overflow-y: scroll;
  height: 86vh;
  .loading {
    margin-top: 50px;
  }

  .rec {
    margin: 20px 0;
  }
  .discItem {
    border-radius: 10px;
    margin-bottom: 10px;
    background-color: white;
    display: flex;
    width: 100vw;
    height: 26.667vw;
    justify-content: center;
    align-items: center;
    .discImg {
      width: 26.667vw;
      height: 26.667vw;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        height: 21vw;
        width: 21vw;
      }
    }
    .discInfo {
      text-align: left;
      width: 73vw;
      height: 26vw;
      display: flex;
      flex-direction: column;
      .discName {
        font-family: "微软雅黑";
        font-weight: 700;
        height: 13vw;
        padding-top: 2vw;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
      .dissname {
        font-size: 3.2vw;
        color: rgb(99, 96, 96);
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  .my-swipe {
    width: 100vw;
    height: 40vw;
    img {
      width: 100vw;
      height: 40vw;
    }
  }
}
</style>