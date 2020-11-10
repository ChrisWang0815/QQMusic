<template>
  <div class="m-header">
    <!-- 图片 -->
    <div class="img">
      <a href="/"
        ><img
          src="//y.gtimg.cn/mediastyle/yqq/img/logo.png?nowebp=1"
          alt="QQ音乐"
          class="qqmusic_logo"
      /></a>
    </div>
    <!-- 搜索框 -->
    <input type="text" placeholder="搜索音乐" @change="search" />
  </div>
</template>

<script>
export default {
  name: "header1",
  methods: {
    search(e) {
      // console.log(e.target.value);
      this.$router.push({
        path: "/search",
        query: {
          value: e.target.value,
        },
      });
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