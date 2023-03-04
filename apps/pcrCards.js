import md5 from 'md5'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import PcrCards from '../model/PcrCards.js'

let pcrCardsData = {
  md5: '',
  img: ''
}

/**
 * 公主链接模块
 */
export class pcrCards extends plugin {
  constructor (e) {
    super({
      name: '公主链接',
      dec: '可萝仔公主链接拓展功能',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^(!|！|可萝仔)*(十连|10连)$',
          fnc: 'cards'
        },
        {
          reg: '^(!|！|可萝仔)*(一连|1连|单抽|1抽|一抽)$',
          fnc: 'cardsOne'
        }
      ]
    })
  }

  /**
   * 十连抽
   * @returns {Promise<void>}
   */
  async cards () {
    let pcr = new PcrCards(this.e)
    let data = await pcr.drawCards(10)
    // 设置第一抽卡绘制
    let imgOne = await this.cache(data)
    // 设置第二抽卡绘制
    data.type = 2
    let img = await this.cache(data)
    // noinspection JSCheckFunctionSignatures
    await this.reply([imgOne, img], true)
  }

  /**
   * 单抽
   * @returns {Promise<void>}
   */
  async cardsOne () {
    let pcr = new PcrCards(this.e)
    let data = await pcr.drawCards(1)
    // 设置第一抽卡绘制
    let imgOne = await this.cache(data)
    // 设置第二抽卡绘制
    data.type = 2
    let img = await this.cache(data)
    // noinspection JSCheckFunctionSignatures
    await this.reply([imgOne, img], true)
  }

  async cache (data) {
    let tmp = md5(JSON.stringify(data))
    if (pcrCardsData.md5 == tmp) return pcrCardsData.img

    pcrCardsData.img = await puppeteer.screenshot('pcrCards', data)
    pcrCardsData.md5 = tmp

    return pcrCardsData.img
  }
}
