let mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '458165529',
    database: '智超之表'
});
connection.connect((err) => {
    if (err) {
        console.log('连接数据库失败！');
    } else {
        console.log('连接数据库成功！');
    }
});

function sqlQuery(strSql, arr) {
    return new Promise((resolve, reject) => {
        connection.query(strSql, arr, (err, results) => {
            if (err) {
                reject(err);

            } else { resolve(results) }

        })
    })
}
/* let strSql = 'select * from student'
sqlQuery(strSql).then(data => console.log(data)) */

module.exports = sqlQuery;