import { exec } from 'child_process'

let timer

export class admin extends plugin {
  constructor (e) {
    super({
      name: '管理员',
      dec: '管理员拓展功能',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^(!|！|可萝仔)*(更新|强制更新)*$',
          fnc: 'update'
        }
      ]
    })
  }

  update () {
    if (!this.checkAdmin()) {
      return true
    }
    let isForce = this.e.msg.includes('强制')
    let command = 'git  pull'
    if (isForce) {
      command = 'git  checkout . && git  pull'
      this.reply('正在执行强制更新操作，请稍等')
    } else {
      this.reply('正在执行更新操作，请稍等')
    }
    exec(command, { cwd: `${process.cwd()}/plugins/keruoji/` }, (error, stdout, stderr) => {
      if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
        this.reply('目前已经是最强的可萝仔了~')
        return true
      }
      if (error) {
        this.reply('可萝仔更新失败！\nError code: ' + error.code + '\n' + error.stack + '\n 请稍后重试。')
        return true
      }
      this.reply('可萝仔更新成功，正在尝试重新启动Yunzai以应用更新...')
      timer && clearTimeout(timer)
      timer = setTimeout(function () {
        let command = 'npm run start'
        if (process.argv[1].includes('pm2')) {
          command = 'npm run restart'
        }
        exec(command, (error, stdout, stderr) => {
          if (error) {
            this.reply('自动重启失败，请手动重启以使用变强后的可萝仔。\nError code: ' + error.code + '\n' + error.stack + '\n')
            Bot.logger.error(`重启失败\n${error.stack}`)
            return true
          } else if (stdout) {
            Bot.logger.mark('重启成功，运行已转为后台，查看日志请用命令：npm run log')
            Bot.logger.mark('停止后台运行命令：npm stop')
            process.exit()
          }
        })
      }, 1000)
    })
    return true
  }

  /**
   * 检查权限
   * @returns {boolean}
   */
  checkAdmin () {
    if (!this.e.isMaster) {
      this.reply('只有主人才能操作可萝仔特别服务~')
      return false
    }
    return true
  }
}
