<template>
  <div class="search" ref="search">
    <!-- 搜索框 -->
    <div class="nav" ref="nav">
      <div class="goBack" @click="$router.go(-1)">
        <van-icon name="arrow-left" style="line-height: 27px" />
      </div>
      <div style="position: relative">
        <input
          type="text"
          placeholder="搜索音乐，歌手"
          v-model="query"
          @keyup.enter="Search(query)"
        />
        <van-icon
          name="close"
          color="gray"
          class="clear"
          v-show="query"
          @click="clear"
        />
      </div>
    </div>
    <div style="margin-top: 50px" v-show="!query">
      <div class="history">
        <div style="position: relative">
          <div class="hotKeys_title">搜索记录</div>
          <van-icon
            class="delete"
            name="delete"
            v-show="searchHistory"
            @click="deleteH"
          />
        </div>
        <span
          @click="selectHistory(item)"
          class="historyItem"
          v-for="(item, index) in searchHistory"
          :key="index"
        >
          {{ item }}
        </span>
      </div>
      <div class="hotKeys">
        <van-sticky :offset-top="navHeight">
          <div class="hotKeys_title">热词</div></van-sticky
        >

        <van-grid :border="false" :column-num="2" :center="false">
          <van-grid-item
            @click="query = item.k"
            style="text-align: left"
            v-for="(item, index) in hotKeys"
            :key="index"
          >
            <div>
              <span class="rank" :class="setRank(index)">{{ index + 1 }}</span
              >{{ item.k }}
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <div style="margin-top: 50px" v-show="query">
      <searchResult1
        @goTop="goTop"
        @cleanQuery="query = ''"
        :query="query"
      ></searchResult1>
    </div>
  </div>
</template>

<script>
import { getHotKey } from "../../api/search";
import searchResult1 from "./searchResult";
import { mapState, mapMutations } from "vuex";
import Vue from "vue";
import { Dialog } from "vant";
Vue.use(Dialog);
export default {
  name: "search",
  components: { searchResult1 },
  props: {},
  data() {
    return {
      query: "",
      hotKeys: [],

      navHeight: 0,
    };
  },
  watch: {},
  computed: { ...mapState(["searchHistory"]) },
  methods: {
    ...mapMutations(["deleteSHistory"]),
    selectHistory(item) {
      this.query = item;
    },

    deleteH() {
      Dialog.confirm({
        confirmButtonColor: "#13c077",
        message: "确定删除吗？",
      })
        .then(() => {
          this.deleteSHistory();
        })
        .catch(() => {
          return;
        });
    },
    goTop() {
      this.$refs.search.scrollTop = 0;
    },
    setRank(index) {
      if (index == 0) {
        return "red";
      }
      if (index == 1) {
        return "orange";
      }
      if (index == 2) {
        return "yellow";
      }
    },
    clear() {
      this.query = "";
    },
    async Search(e) {
      if (e) {
        this.history.push(e);
      } else {
        return;
      }
    },
  },
  async created() {
    let result = await getHotKey();
    if (result.code == 0) {
      this.hotKeys = result.data.hotkey;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == from.path) {
      return;
    }
    next();
  },
  mounted() {
    this.navHeight = this.$refs.nav.clientHeight;
  },
};
</script>
<style lang="less" scoped>
@bac: rgb(238, 232, 232);
.hotKeys_title {
  background: @bac;
  font-weight: 700;
}
.delete {
  position: absolute;
  right: 10px;
  top: 0;
}
.history {
  overflow: hidden;

  margin-bottom: 20px;
  span {
    float: left;
    padding: 5px;
    margin: 5px 10px;
    background: white;
    border-radius: 5px;
    color: rgb(117, 115, 115);
    font-size: 15px;
    border: 1px solid rgb(230, 228, 228);
  }
}
.red {
  color: red;
}
.orange {
  color: rgb(236, 154, 0);
}
.yellow {
  color: rgb(216, 216, 3);
}
.rank {
  margin-left: 5px;
  margin-right: 10px;
}
.hotKeys span {
  display: inline-block;
  width: 17px;
}
/deep/.van-grid-item__content {
  padding: 10px 3px;
  background-color: @bac;
}
.nav {
  position: fixed;
  z-index: 9999;
  background: @bac;
  height: 7vh;
  width: 100vw;
  display: flex;
  text-align: center;
  align-items: center;
  border-bottom: 1px solid rgb(255, 255, 255);
}
.goBack {
  width: 26.667vw;
  height: 7.21577647vw;
}
input {
  margin: 0 2.667vw;
  border-radius: 8px;
  border: transparent solid 1px;
  background: #ffffff;
  height: 5vw;
  color: rgb(51, 49, 49);
  text-align: center;
  line-height: 5vw;
  font-size: 2.667vw;
}
.search {
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  background-color: @bac;
  z-index: 999;
  width: 100vw;
  text-align: left;
  overflow-y: scroll;
}
.search::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.clear {
  position: absolute;
  right: 12px;
  top: 4px;
}
</style>