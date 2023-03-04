import fs from 'fs'
import lodash from 'lodash'

const _path = process.cwd()
const _logPath = `${_path}/plugins/keruoji/CHANGELOG.md`
// 更新日志记录
let logs = {}
// 当前版本
let currVersion
// 更新版本记录信息
let verLog = {
  version: '1.0.0',
  logs: []
}
// 更新记录列表
let verList = []
const getLine = function (line) {
  line = line.replace(/(^\s*\*|\r)/g, '')
  line = line.replace(/\s*`([^`]+`)/g, '<span class="cmd">$1')
  line = line.replace(/`\s*/g, '</span>')
  line = line.replace(/\s*\*\*([^*]+\*\*)/g, '<span class="strong">$1')
  line = line.replace(/\*\*\s*/g, '</span>')
  line = line.replace(/ⁿᵉʷ/g, '<span class="new"></span>')
  return line
}
try {
  if (fs.existsSync(_logPath)) {
    logs = fs.readFileSync(_logPath, 'utf8') || ''
    logs = logs.split('\n')
    let lastLine = {}
    lodash.forEach(logs, (line) => {
      let versionRet = /^#\s*([0-9a-zA-Z\\.~\s]+?)\s*$/.exec(line)
      if (versionRet && versionRet[1]) {
        let v = versionRet[1].trim()
        if (!currVersion) {
          currVersion = v
        } else {
          verList.push(verLog)
        }
        verLog.version = v
      } else {
        if (!line.trim()) {
          return
        }
        if (/^\*/.test(line)) {
          lastLine = {
            title: getLine(line),
            logs: []
          }
          verLog.logs.push(lastLine)
        } else if (/^\s{2,}\*/.test(line)) {
          lastLine.logs.push(getLine(line))
        }
      }
    })
  }
} catch (e) {
  // do nth
}

const Version = {
  get version () {
    return currVersion
  }
}
export default Version
