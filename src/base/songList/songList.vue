<template>
  <div class="songList">
    <van-cell-group>
      <van-cell
        v-for="(song, index) in songs"
        :key="index"
        :title="song.name"
        :label="song.singer + '.' + song.album"
        @click="selectSong(index)"
        :value="song.duration"
      />
    </van-cell-group>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
import { mapActions } from "vuex";
Vue.use(Toast);
export default {
  name: "songList",
  components: {},
  props: ["songs"],
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    showSong() {
      Toast("没有接口");
    },
    selectSong(index) {
      this.selectPlay({
        list: this.songs,
        index,
      });
    },
    ...mapActions(["selectPlay"]),
  },
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.songList {
  overflow-y: scroll;

  text-align: left;
}
</style>