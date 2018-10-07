import babel from '@babel/core'
import fs from 'fs'
import plugin from './plugin'

const code = fs.readFileSync(`${__dirname}/in.js`).toString()

const transformedCode = babel.transform(code, {
  plugins: [plugin],
  code: true,
  ast: false,
}).code

fs.writeFileSync(`${__dirname}/out.js`, transformedCode)
