<template>
  <div id="app">
    <Header></Header>
    <Tab :index="this.$route.meta.index"></Tab>
    <keep-alive exclude="songDetail">
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<script>
import player from "./components/player/player";
import Tab from "./components/tab/tab";
import Header from "./components/header/header";

export default {
  name: "app",

  components: { Tab, Header, player },
  props: {},
  data() {
    return { transitionName: "" };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="less">
/* .slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translateX(100%);
}
.slide-left-enter {
  opacity: 0;
  transform: translateX(100%);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translateX(-100%);
} */

#app {
  @themeColor: #13c077;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  background-color: rgb(238, 240, 240);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  list-style: none;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
