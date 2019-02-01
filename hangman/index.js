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
      word: [],
      maxWrong: 0,
      wrongGuessed: [],
      ans: []
    }
  }

  getNewQuestion () {
    const get = Math.floor(Math.random() * this.list.length)
    const q = this.list[get]
    this.list = [...this.list.splice(0, get), ...this.list.splice(get, this.list.length)]

    this.game.hint = q.h
    this.game.word = q.a.split('')
    this.game.ans = '_'.repeat(q.a.length).split('')
    this.game.wrongGuessed = []
    this.game.maxWrong = q.a.length + Math.floor(Math.random() * Math.floor(6))

    return this.game.ans
  }

  getHint () {
    return this.game.hint
  }

  answer (alphabet) {
    const found = this.game.word.find(a => a.toLowerCase() === alphabet.toLowerCase())
    const position = this.game.word.indexOf(found)
    console.log('--->', found)
    if (found) {
      console.log('ccccc')
      this.game.ans[position] = this.game.word[position]
      this.game.word[position] = '-'
      return true
    } else {
      console.log('ffffff')
      this.game.wrongGuessed.push(alphabet)
      return false
    }
  }
}

async function main () {
  const data = await loadFileGame()
  const wordlists = new Wordlists(data)
  let gameSession
  //   console.log(wordlists.getQuestionList(0))

  async function selectCategory () {
    return inquirer.prompt([
      {
        name: 'categories',
        type: 'list',
        message: 'select category',
        choices: wordlists.categories
      }
    ]).then(ans => {
      const cid = wordlists.categories.findIndex(s => s.name === ans.categories)
      inquirer.registerPrompt('answer', ans)
      gameSession = new GameSession(wordlists.getQuestionList(cid))
    })
  }
  async function getQuestion () {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'answer',
        message: `
        hint : ${gameSession.getHint()}
        your guess ${gameSession.getNewQuestion()}`
      }
    ]).then(ans => {
      console.log(ans)
      gameSession.answer(ans.answer)
    })
  }

  await selectCategory()
  await getQuestion()
  console.log(gameSession)

//   console.log(gameSession)
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
