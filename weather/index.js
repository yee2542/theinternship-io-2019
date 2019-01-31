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

const subkey = async (data, key) => {
  data[key].forEach(element => {
    console.log(element)
    for (const subkey of Object.keys(element)) {
      // console.log('sib-key',element[subkey])
      console.log(subkey)
      if (subkey === '$') data[key] = element[subkey]
      else data[key][subkey] = element[subkey]
      // if(data[key][subkey]) data[key][subkey] = await subkey(data[key][subkey], subkey)
    }
  })
  return data
}

const transform = async () => {
  for (const key of Object.keys(output)) {
    // console.log(key, output[key])
    // output[key] = output[key][0]['coord']
    console.log(key, output[key])
    // console.log(typeof(output[key]), output[key])
    // output[key].forEach(element => {
    //     console.log(element)
    //     for(const subkey of Object.keys(element)) {
    //         console.log('sib-key',element[subkey])
    //         if(subkey === '$') output[key] = element[subkey]
    //         else output[key][subkey] = element[subkey]
    //     }

    // })
    output = await subkey(output, key)
    // for(const subkey of Object.keys(output[key][0]['$'])) {
    //     console.log(subkey)
    // }
    // if(output[key][0]) {
    //     for(const subkey of Object.keys(output[key][0])) {
    //         if(output[key][subkey]) console.log(subkey, output[key][subkey])
    //     }
    // }
    // console.log(output[key][0])
    // console.log(output[key][0]['$'])
  }
}
// console.log(output)
transform().then(() => console.log(util.inspect(output, { showHidden: false, depth: null })))

// console.log(util.inspect(output, {showHidden: false, depth: null}))
