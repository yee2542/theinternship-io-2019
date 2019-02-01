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
    this.game = {
      hint: '',
      word: [],
      maxWrong: 0,
      wrongGuessed: [],
      ans: [],
      state: '',
      round: 0,
      result: ''
    }
  }

  getNewQuestion () {
    const get = Math.floor(Math.random() * this.list.length)
    const q = this.list[get]
    this.list = [...this.list.splice(0, get), ...this.list.splice(get, this.list.length)]

    this.game.result = 'next'
    this.game.round = 0
    this.game.state = true
    this.game.hint = q.h
    this.game.word = q.a.split('')
    this.game.ans = '_'.repeat(q.a.length).split('')
    this.game.wrongGuessed = []
    this.game.maxWrong = q.a.length + Math.floor(Math.random() * Math.floor(6))

    return this.game.ans
  }

  getQuestion () {
    return this.game.ans
  }

  getWrongGuessed () {
    return this.game.wrongGuessed
  }

  getHint () {
    return this.game.hint
  }

  checkAnswer () {
    let count = 0
    this.game.ans.forEach(a => {
      console.log(a)
      if (a !== '_') count++
    })
    if (count === this.game.word.length) return true
    else return false
  }

  setSessionState () {
    if (this.game.round > this.game.maxWrong) this.game.state = false
    // else if (this.game.ans.length === this.game.ans.length) this.game.state = 'win'
    else this.game.state = true

    const ans = this.checkAnswer()
    console.log('ans', ans)
    if (this.game.result === 'next' &&
    this.game.state === false &&
    this.game.ans === this.game.word &&
    ans
    ) this.game.result = 'lose'
    else this.game.result = 'win'
    // else this.game.state = true
  }

  getSessionSate () {
    return this.game.state
  }

  answer (alphabet) {
    const found = this.game.word.find(a => a.toLowerCase() === alphabet.toLowerCase())
    const position = this.game.word.indexOf(found)
    this.game.round++
    console.log('--->', found)
    if (found) {
    //   console.log('ccccc')
      this.game.ans[position] = this.game.word[position]
      this.game.word[position] = '-'
    } else {
    //   console.log('ffffff')
      const wrongDuplicated = this.game.wrongGuessed.find(a => a.toLowerCase() === alphabet.toLowerCase())
      if (wrongDuplicated) {
        console.log('you haved wrong guessed character')
        this.game.state++
        this.game.round--
      } else this.game.wrongGuessed.push(alphabet)
      //   if (this.game.wrongGuessed.length === this.game.maxWrong) this.game.state = false
    }
    this.setSessionState()
    return this.game.maxWrong - this.game.wrongGuessed.length
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
      console.log(gameSession)
    })
  }
  async function getNewQuestion () {
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
      return gameSession.answer(ans.answer)
    })
  }
  async function getQuestion () {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'answer',
        message: `
        hint : ${gameSession.getHint()}
        your guess ${gameSession.getQuestion()} wrong guessed : ${gameSession.getWrongGuessed()}
        `
      }
    ]).then(ans => {
      console.log('ane--->', ans)
      return gameSession.answer(ans.answer)
    })
  }

  await selectCategory()
  await getNewQuestion()
  let gameState = gameSession.getSessionSate()
  while (gameSession.game.result === 'next') {
    gameState = await getQuestion()
    console.log(gameState)
    console.log(gameSession)
  }
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
