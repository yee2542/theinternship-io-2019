// dependencies
const fs = require('fs')

const xmlToJson = require('xml-to-json-stream')
const format = require('format-json-stream')

const inputPath = process.argv[2]
const outputPath = process.argv[3]

const parser = xmlToJson()
const streamConvert = parser.createStream()
const streamRead = fs.createReadStream(inputPath, { encoding: 'utf8' })
const streamWrite = fs.createWriteStream(outputPath)

streamRead.pipe(streamConvert).pipe(format()).pipe(streamWrite)
