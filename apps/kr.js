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
          reg: '^(!kr|！kr|kr|可萝仔)(?!.*(?:图像|立绘|列表))',
          fnc: 'getInfoByName'
        },
        {
          reg: '^(!kr|！kr|kr|可萝仔)(.*)(立绘|图像)$',
          fnc: 'getLie'
        },
        {
          reg: '^(!kr|！kr|kr|可萝仔)(?!.*(?:职业列表))(.*)(列表)$',
          fnc: 'getNameList'
        },
        {
          reg: '^(!kr|！kr|kr|可萝仔)(.*)(职业列表)$',
          fnc: 'getClassesList'
        }
      ]
    })
  }

  /**
   * 通过名称获取 英雄信息
   * @returns {Promise<void>}
   */
  async getInfoByName () {
    let krObj = new Kr(this.e)
    let name = this.e.msg.replace('kr', '').trim()
    let data = await krObj.getInfo(name)
    if (data) {
      let img = await this.cache(data)
      this.reply(img)
    } else {
      this.reply('没有找到这个英雄哦，指令格式：【kr + 角色名称】')
    }
  }

  /**
   * 获取 角色立绘
   * @returns {Promise<void>}
   */
  async getLie () {
    let krObj = new Kr(this.e)
    let name = this.e.msg.replace('kr', '').trim()
    let img = await krObj.getLie(name.replace('立绘', '').trim())
    this.reply(img)
  }

  /**
   * 通过职业获取角色名字
   * @returns {Promise<void>}
   */
  async getNameList () {
    let krObj = new Kr(this.e)
    let name = this.e.msg.replace('kr', '').trim()
    let names = await krObj.getNameList(name)
    this.reply(names)
  }

  /**
   * 获取职业列表
   * @returns {Promise<void>}
   */
  async getClassesList () {
    let krObj = new Kr(this.e)
    let classesList = await krObj.getClassesList()
    this.reply(classesList)
  }

  async cache (data) {
    let tmp = md5(JSON.stringify(data))
    if (krData.md5 === tmp) return krData.img
    krData.img = await puppeteer.screenshot('kr', data)
    krData.md5 = tmp
    return krData.img
  }
}
