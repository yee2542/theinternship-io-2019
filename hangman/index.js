const fs = require('fs')
const inquirer = require('inquirer')

// setting
const PATH = './wordlists.json'

function loadFileGame () {
  return new Promise((resolve, reject) => {
    fs.readFile(PATH, { encoding: 'utf-8' }, (err, data) => {
      if (err) reject(Error('cannot load file game'))
      const result = JSON.parse(data)
      resolve(result)
    })
  })
}

class Wordlists {
  constructor (data) {
    this.wordlists = data
    this.categories = this.getCategoriesName(this.wordlists)
  }

  getCategoriesName () {
    let categories = []
    this.wordlists.categories.forEach(element => {
      categories.push(element)
    })
    return categories
  }

  getQuestionList (catID) {
    return this.wordlists.categories[catID].lists
  }
}

class GameSession {
  constructor (list) {
    this.list = list
    this.score = 0
    this.word = ''
    this.game = {
      hint: '',
      word: '',
      maxWrong: 0,
      guessed: []
    }
  }
}

async function main () {
  const data = await loadFileGame()
  const wordlists = new Wordlists(data)
  let gameSession
  //   console.log(wordlists.getQuestionList(0))

  inquirer.prompt([
    {
      name: 'categories',
      type: 'list',
      message: 'select category',
      choices: wordlists.categories
    }
  ])
    .then(ans => {
      const cid = wordlists.categories.findIndex(s => s.name === ans.categories)
      gameSession = new GameSession(wordlists.getQuestionList(cid))

      console.log(gameSession)
    })
}

main()

// inquirer.prompt([
//   {
//     name: 'name',
//     type: 'list',
//     message: 'select category',
//     choices: ['euei', 'euei']
//   }
// ])
//   .then(ans => {
//     console.log(ans)
//   })