// dependencies
const fs = require('fs')
const util = require('util')
const parseString = require('xml2js').parseString

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<current>
  <city id="2643741" name="City of London">
    <coord lon="-0.09" lat="51.51" />
    <country>GB</country>
    <sun rise="2015-06-30T03:46:57" set="2015-06-30T20:21:12" />
  </city>
  <temperature value="72.34" min="66.2" max="79.88" unit="fahrenheit" />
  <humidity value="43" unit="%" />
  <pressure value="1020" unit="hPa" />
  <wind>
    <speed value="7.78" name="Moderate breeze" />
    <direction value="140" code="SE" name="SouthEast" />
  </wind>
  <clouds value="0" name="clear sky" />
  <visibility value="10000" />
  <precipitation mode="no" />
  <weather number="800" value="Sky is Clear" icon="01d" />
  <lastupdate value="2015-06-30T08:36:14" />
</current>`

let output
parseString(xml, { trim: true }, (err, result) => {
  // console.log(util.inspect(result, {showHidden: false, depth: null}))
  if (err) throw new Error(err)
  output = result.current
})

// console.log(output)
// console.log(util.inspect(output, {showHidden: false, depth: null}))

// const flatMap$ = (arr, root) => {
//   let result = {}
//   if (arr[0]['$']) result[root] = arr[0]['$']
//   else
// }

const subkey = async (data, key) => {
  if (!key) {
    console.log(util.inspect(data, { showHidden: false, depth: null }))
    return data
  }
  data[key].forEach(element => {
    console.log(element)
    for (const subkey of Object.keys(element)) {
      if (subkey === '$') {
        console.log('$ -->', element[subkey])
        data[key] = element[subkey]
      } else {
        console.log('not $ -->', element[subkey])
        data[key][subkey] = element[subkey]
      }
    }
  })
  console.log(util.inspect(data, { showHidden: false, depth: null }))
  return data
}

const transform = async () => {
  for (const key of Object.keys(output)) {
    output = await subkey(output, key)
    for (const subkey of Object.keys(output[key])) {
      console.log('subkey--->',subkey)
    }
  }
}
// console.log(output)
// transform().then(() => console.log(util.inspect(output, { showHidden: false, depth: null })))

const parserrrr = require('xml2json')
var json = parserrrr.toJson(xml);
console.log("to json -> %s", json);
console.log(JSON.parse(json).current)

// console.log(util.inspect(output, {showHidden: false, depth: null}))
