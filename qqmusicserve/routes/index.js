var express = require('express');
var usersRouter = express.Router();
let crypto = require('crypto');
let mySql = require('../mysql.js');

var axios = require('axios')
usersRouter.get('/getDiscList', function (req, res) {

  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  },

  ).then((response) => {

    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })

});
usersRouter.post('/login', async function (req, res, next) {


  let username = req.body.username;
  let password = req.body.password;
  let sqlStr = 'select * from users where username = ? and password = ?';
  let result = await mySql(sqlStr, [username, jiaMi(password)]);
  if (Array.from(result).length != 0) {
    res.send({ login: true, result })
  } else {
    res.send({ login: false })
  }
});
usersRouter.post('/', async function (req, res, next) {
  let e = req.body.e

  let sqlStr1 = 'UPDATE users SET imgheader=?,mobile=?,nickname=?,gender=?,birthday=? where username = ?';
  await mySql(sqlStr1, [e.imgheader, e.mobile, e.nickname, e.gender, e.birthday, e.username])
  res.send({
    state: 'ok'
  })
});
usersRouter.get('/info/:id', async function (req, res, next) {
  let username = req.params.id
  console.log(req.params);
  let sqlStr = 'select * from users where username = ?';
  let result = await mySql(sqlStr, [username]);
  res.send(result);
});
usersRouter.post('/register', async function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let sqlStr = 'select * from users where username = ?';
  let result = await mySql(sqlStr, [username]);
  if (Array.from(result).length != 0) {
    res.send({ register: false })
  } else {
    let sqlStr2 = 'INSERT INTO users (username,password) VALUES (?,?)'
    await mySql(sqlStr2, [username, jiaMi(password)]);
    res.send({ register: true })
  }
});
function jiaMi(str) {
  let password = str;
  password = str + 'wzc'
  let sf = crypto.createHash('md5');
  sf.update(password);
  let content = sf.digest('hex')
  return content
}
/* GET home page. */

usersRouter.get('/getDiscSongs', function (req, res) {

  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {

    var ret = response.data
    if (typeof ret === 'string') {
      // var reg = /^\w+\(({[^()]+})\)$/
      var reg = /{.*}/
      var matches = ret.match(reg)
      if (matches) {

        ret = JSON.parse(matches[0])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
usersRouter.get('/lyric', function (req, res) {

  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
});
usersRouter.get('/search', function (req, res) {
  var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /{.*}/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[0])

      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })

});

module.exports = usersRouter;
