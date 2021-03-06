const fs = require('fs')
const inquirer = require('inquirer')

// setting
const PATH = './wordlists.json'
const HINT = 4

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
    this.list = [...this.list.splice(0, get), ...this.list.splice(get, this.list.length - 1)]

    this.game.result = 'next'
    this.game.round = 0
    this.game.state = true
    this.game.hint = q['h']
    this.game.word = q['a'].split('')
    this.game.ans = '_'.repeat(q['a'].length).split('')
    this.game.wrongGuessed = []
    this.game.maxWrong = q.a.length + Math.floor(Math.random() * Math.floor(6))

    const hint = () => {
      const ranInt = Math.floor(Math.random() * this.game.word.length)
      this.game.ans[ranInt] = this.game.word[ranInt]
      this.game.word[ranInt] = '-'
    }
    let hintWord = this.game.word.length
    while (hintWord > 0) {
      hint()
      hintWord = Math.floor(hintWord / HINT)
    }

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

  getLeftGuess () {
    return this.game.maxWrong - this.game.round
  }

  checkAnswer () {
    let count = 0
    this.game.ans.forEach(a => {
      if (a !== '_') count++
    })
    if (count === this.game.word.length) return true
    else return false
  }

  setSessionState () {
    if (this.game.round >= this.game.maxWrong) this.game.state = false
    else this.game.state = true

    const ans = this.checkAnswer()
    if (this.game.result === 'next' &&
    this.game.state && ans) {
      this.game.result = 'win'
      const reveal = this.game.ans.join('')
      console.log(`Yahh is ${reveal}`)
      console.log(`score is ${this.score}`)
    } else if (!this.game.state) this.game.result = 'lose'
  }

  getSessionSate () {
    return this.game.state
  }

  getScore () {
    return this.score
  }

  answer (alphabet) {
    const found = this.game.word.find(a => a.toLowerCase() === alphabet.toLowerCase())
    const position = this.game.word.indexOf(found)
    this.game.round++
    if (found) {
      this.score++
      this.game.ans[position] = this.game.word[position]
      this.game.word[position] = '-'
      this.game.round--
    } else {
      const wrongDuplicated = this.game.wrongGuessed.find(a => a.toLowerCase() === alphabet.toLowerCase())
      if (wrongDuplicated) {
        this.game.round--
        console.log('you haved wrong guessed character')
      } else {
        if (this.score > 0) this.score--
        this.game.wrongGuessed.push(alphabet)
      }
    }
    this.setSessionState()
    return this.game.maxWrong - this.game.wrongGuessed.length
  }
}

async function main () {
  const data = await loadFileGame()
  const wordlists = new Wordlists(data)
  let gameSession

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
      return cid
    }).then(cid => {
      const data = wordlists.getQuestionList(cid)
      gameSession = new GameSession(data)
    })
  }
  const inputValidator = (input) => {
    return new Promise((resolve, reject) => {
      console.log(input)
      if (input.length == 1 && input !== ' ' && input.match(/^[0-9a-zA-Z]+$/)) resolve(input)
      else reject(new Error('error input'))
    })
  }
  async function getNewQuestion () {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'answer',
        message: `
        your guess ${gameSession.getNewQuestion()}
        hint : ${gameSession.getHint()}
        you have ${gameSession.getLeftGuess()} tries, score : ${gameSession.getScore()}
        `,
        filter: inputValidator
      }
    ]).then(ans => {
      return gameSession.answer(ans.answer)
    })
  }
  async function getQuestion () {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'answer',
        message: `
        your guess ${gameSession.getQuestion()} wrong guessed : ${gameSession.getWrongGuessed()}
        hint : ${gameSession.getHint()}
        you have ${gameSession.getLeftGuess()} tries, score : ${gameSession.getScore()}
        `,
        filter: inputValidator
      }
    ]).then(ans => {
      return gameSession.answer(ans.answer)
    })
  }

  async function nextGame () {
    let choices = ['next', 'select category', 'exit']
    if (!gameSession.list[0]) {
      choices.shift()
    }
    return inquirer.prompt([
      {
        name: 'next',
        type: 'list',
        message: 'select category',
        choices: choices
      }
    ]).then(ans => {
      let state = {
        exit: false,
        newCategory: false
      }
      switch (ans.next) {
        case 'next':
          break
        case 'exit':
          state.exit = true
          break
        case 'select category':
          state.newCategory = true
          break
      }
      return state
    })
  }

  let next = {
    exit: false,
    newCategory: true
  }
  while (!next.exit) {
    if (next.newCategory) {
      await selectCategory()
    }
    await getNewQuestion()
    while (gameSession.game.result === 'next') {
      await getQuestion()
    }
    if (gameSession.game.result === 'win') console.log('you win !')
    else console.log('try next')
    next = await nextGame()
  }
  console.log('bye ~')
}

main()
