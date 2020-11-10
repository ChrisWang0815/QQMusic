<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif" />
    <p class="desc">正在载入中。。。</p>
  </div>
</template>

<script>
export default {
  name: "loading",
  components: {},
  props: {},
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
.loading {
  width: 100%;
  text-align: center;
  .desc {
    font-size: 5px;
  }
}
</style>