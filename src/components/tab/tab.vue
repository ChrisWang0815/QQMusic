<template>
  <div class="tab">
    <van-tabs
      v-model="active"
      @click="onClick"
      color="#13c077"
      title-active-color="#13c077"
    >
      <van-tab title="推荐" />
      <van-tab title="歌手" />
      <van-tab title="排行" />
      <van-tab title="搜索" />
    </van-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "tab",
  components: {},
  props: {},
  data() {
    return { active: 0 };
  },
  watch: {},
  computed: {},
  methods: {
    onClick(name, title) {
      let index = this.$route.meta.index;
      if (index == this.active) {
        this.$forceUpdate();
        return;
      }
      switch (title) {
        case "推荐":
          this.$router.push("/recommend");
          break;
        case "歌手":
          this.$router.push("/singer");
          break;
        case "排行":
          this.$router.push("/rank");
          break;
        case "搜索":
          this.$router.push("/search");
          break;
        default:
          break;
      }
    },
  },
  created() {
    this.active = this.$route.meta.index;
  },
  mounted() {},
};
</script>

<style scoped lang="less" >
.tab {
  padding: 0.1px;
  height: 7vh;
  z-index: 6;
  position: relative;
  .van-tabs--line .van-tabs__wrap {
    height: 7vh;
  }
}
</style>