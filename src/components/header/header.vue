<template>
  <div class="m-header">
    <!-- 图片 -->
    <div class="img">
      <a href="recommend"
        ><img
          src="//y.gtimg.cn/mediastyle/yqq/img/logo.png?nowebp=1"
          alt="QQ音乐"
          class="qqmusic_logo"
      /></a>
    </div>
    <!-- 搜索框 -->
    <div style="position: relative" @click="search">
      <input type="text" placeholder="搜索音乐，歌手" disabled />
    </div>
  </div>
</template>

<script>
export default {
  name: "header1",
  data() {
    return {};
  },
  methods: {
    search() {
      if (this.$route.path != "/search") {
        this.$router.push({
          path: "/search",
        });
      } else {
        return;
      }
    },
  },
};
</script>

<style scoped lang="less">
@themeColor: #13c077;

.img,
img {
  width: 26.667vw;
  height: 46/170 * 26.667vw;
}
.img {
  margin-left: 10px;
}
input {
  margin: 0 2.667vw;
  border-radius: 8px;
  border: transparent solid 1px;
  background: #17cf83;
  height: 5vw;
  color: rgb(51, 49, 49);
  text-align: center;
  line-height: 5vw;
  font-size: 2.667vw;
}
.m-header {
  display: flex;
  background: @themeColor;
  height: 7vh;
  display: flex;
  align-items: center;
}
</style>