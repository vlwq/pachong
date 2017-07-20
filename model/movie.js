const fs = require('fs')
//movie的model
class Movie{
  static all(){
      const movieFilePath = 'database/movie.json'
      const content = fs.readFileSync(movieFilePath, 'utf8')
      const ms = JSON.parse(content)
      return ms
  }
}
//导出
module.exports = Movie
