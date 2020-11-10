export default class Song {
    constructor({ id, mid, singer, name, album, duration, image, url, durationSecond }) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
        this.durationSecond = durationSecond
    }
}
export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        durationSecond: musicData.interval,
        duration: getDuration(musicData.interval),
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    })
}
function getDuration(my_time) {
    var hours = my_time / 60 / 60;
    var hoursRound = Math.floor(hours);
    var minutes = my_time / 60 - 60 * hoursRound;
    var minutesRound = Math.floor(minutes);
    let seconds = my_time - 60 * 60 * hoursRound - 60 * minutesRound;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    if (hoursRound == 0) {
        return minutesRound + ":" + seconds;
    } else {
        return hoursRound + ":" + minutesRound + ":" + seconds;
    }
}
function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}

