// dependencies
const fs = require('fs')

const xmlToJson = require('xml-to-json-stream')
const format = require('format-json-stream')

const inputPath = process.argv[2]
let outputPath = process.argv[3]

if (!outputPath) outputPath = inputPath.slice(0, -3) + 'json'

const parser = xmlToJson()
const streamConvert = parser.createStream()
const streamRead = fs.createReadStream(inputPath, { encoding: 'utf8' })
const streamWrite = fs.createWriteStream(outputPath)

streamRead.pipe(streamConvert).pipe(format()).pipe(streamWrite)
