<template>
  <div class="songList">
    <van-cell-group v-if="rank == false">
      <van-cell
        v-for="(song, index) in songs"
        :key="index"
        :title="song.name"
        :label="song.singer + '.' + song.album"
        @click="selectSong(index)"
        :value="song.duration"
      />
    </van-cell-group>
    <van-cell-group v-if="rank == true">
      <van-cell
        v-for="(song, index) in songs"
        :key="index"
        :title="getIndex(index, song)"
        :label="song.singer + '.' + song.album"
        @click="selectSong(index)"
        :value="song.duration"
      />
    </van-cell-group>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "songList",
  components: {},
  props: {
    songs: {
      type: Array,
      default: null,
    },
    rank: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    getIndex(i, song) {
      i = i + 1;
      return i + " " + song.name;
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