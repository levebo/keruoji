import Acg from '../model/Acg.js'

/**
 * acg图片模块
 */
export class acg extends plugin {
  constructor (e) {
    super({
      name: 'acg图片',
      dec: 'acg图片拓展功能',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^(!|！|可萝仔)*(gkd|ldst|色图|涩图|gkd s|gkd e|gkd q)*$',
          fnc: 'acgPic'
        },
        {
          reg: '^(!|！|可萝仔)*(车来)$',
          fnc: 'acgSearch'
        }
      ]
    })
  }

  /**
   * 搜图
   * @returns {Promise<void>}
   */
  async acgPic () {
    let acg = new Acg()
    let level = 's'
    level = this.e?.msg.includes('s') ? 's' : level
    level = this.e?.msg.includes('q') ? 'q' : level
    level = this.e?.msg.includes('e') ? 'e' : level
    let img = await acg.r18(level)
    this.reply(img)
  }

  /**
   * 以图搜图 搜出处
   */
  async acgSearch () {
    if (!this.e.img) {
      this.e.reply('请正确发送需要查找的图片')
      return false
    }
    // let acg = new Acg()
    // this.reply(acg.saucenao())
  }
}
