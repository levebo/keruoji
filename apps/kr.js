import Kr from '../model/Kr.js'
import md5 from 'md5'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import template from 'art-template'

/**
 * 注册一个 处理百分比的过滤器
 * @param val
 * @returns {string}
 */
template.defaults.imports.percent = function (val) {
  return Number(val / 10).toFixed(2) + '%'
}

let krData = {
  md5: '',
  img: ''
}

export class kr extends plugin {
  constructor (e) {
    super({
      name: '王之逆袭',
      dec: '可萝仔王之逆袭拓展功能',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^(!kr|！kr|kr|可萝仔)',
          fnc: 'getInfoByName'
        }
      ]
    })
  }

  async getInfoByName () {
    let krObj = new Kr(this.e)
    let data = await krObj.getInfo(this.e.msg)
    if (data) {
      let img = await this.cache(data)
      this.reply(img)
    } else {
      this.reply('没有找到这个英雄哦，指令格式：【kr + 角色名称】')
    }
  }

  async cache (data) {
    let tmp = md5(JSON.stringify(data))
    if (krData.md5 == tmp) return krData.img
    krData.img = await puppeteer.screenshot('kr', data)
    krData.md5 = tmp
    return krData.img
  }
}
