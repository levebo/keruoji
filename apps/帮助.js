import md5 from 'md5'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import 帮助 from '../model/帮助.js';

let helpData = {
  md5: '',
  img: ''
}

export class help extends plugin {
  constructor (e) {
    super({
      name: '可萝仔帮助',
      dec: '可萝仔帮助',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^(!|可萝仔)*(命令|帮助|菜单|help|说明|功能|指令|使用说明)$',
          fnc: 'help'
        }
      ]
    })
  }

  async help () {
    let data = await 帮助.get(this.e)
    if (!data) return

    let img = await this.cache(data)
    await this.reply(img)
  }

  async cache (data) {
    let tmp = md5(JSON.stringify(data))
    if (helpData.md5 == tmp) return helpData.img

    helpData.img = await puppeteer.screenshot('help', data)
    helpData.md5 = tmp

    return helpData.img
  }
}
