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
  }

  getCategories () {
    let categories = []
    this.wordlists.categories.forEach(element => {
      categories.push(element.name)
    })
    return categories
  }
}

async function main () {
  const data = await loadFileGame()
  const wordlists = new Wordlists(data)
  console.log(wordlists.getCategories())
  console.log(wordlists)

  inquirer.prompt([
    {
      name: 'categories',
      type: 'list',
      message: 'select category',
      choices: ['test']
    }
  ])
    .then(ans => {
      console.log(ans)
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
