import fs from 'node:fs'
import chalk from 'chalk'

const files = fs.readdirSync('./plugins/keruoji/apps').filter(file => file.endsWith('.js'))

let ret = []
logger.info(chalk.rgb(153, 255, 165)('可萝仔初始化中.......'))

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')

  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}
export { apps }
