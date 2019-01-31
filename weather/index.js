// dependencies
const fs = require('fs')
const util = require('util')

const xmlToJson = require('xml-to-json-stream')
const es = require('event-stream')
const JSONStream = require('JSONStream')
const format = require('format-json-stream')

const parser = xmlToJson()
const streamConvert = parser.createStream()
const streamRead = fs.createReadStream('./weather.xml', { encoding: 'utf8' })
const streamWrite = fs.createWriteStream('jsonFile.json')
// streamRead.on('data', data => {
//   console.log(data)
//   streamConvert.pipe(data)
// })
streamRead.pipe(streamConvert).pipe(format()).pipe(streamWrite)
