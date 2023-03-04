import Base from './Base.js'
import { Random, Version } from '../components/index.js'
import { readFile } from 'fs/promises'

export default class PcrCards extends Base {
  constructor (e) {
    super(e)
    this.model = 'pcrCards'
  }

  static async get (e) {
    let pcr = new PcrCards(e)
    return await pcr.getData()
  }

  async getData () {
    return {
      ...this.screenData,
      saveId: 'pcrCards',
      version: Version.version,
      // 设置默认第一抽卡界面
      type: 1
    }
  }

  /**
   * 抽卡
   * @param {number} num 抽卡次数 1 | 10
   */
  async drawCards (num) {
    // 抽取角色arr
    let cards = []
    let isOne = true
    for (let i = 0; i < num; i++) {
      // 随机抽卡
      let randomNum = Random.num(1000)
      // 随机获取角色
      let randomHeroNum
      // 角色对象
      let hero = {}
      // 对应星数角色
      let heroStar = []
      if (randomNum <= 25) {
        heroStar = await this.getHeroStar(3)
        randomHeroNum = Random.num(heroStar.length)
        hero = heroStar[randomHeroNum]
        hero.number = 50
        isOne = false
      } else if (randomNum <= 205 && randomNum > 25) {
        heroStar = await this.getHeroStar(2)
        randomHeroNum = Random.num(heroStar.length)
        hero = heroStar[randomHeroNum]
        hero.number = 10
      } else if (randomNum > 205) {
        heroStar = await this.getHeroStar(1)
        randomHeroNum = Random.num(heroStar.length)
        hero = heroStar[randomHeroNum]
        hero.number = 1
      }

      if (i === 9 && isOne) {
        randomNum = Random.num(1000)
        if (randomNum <= 25) {
          heroStar = await this.getHeroStar(3)
          randomHeroNum = Random.num(heroStar.length)
          hero = heroStar[randomHeroNum]
          hero.number = 50
        } else if (randomNum > 25) {
          heroStar = await this.getHeroStar(2)
          randomHeroNum = Random.num(heroStar.length)
          hero = heroStar[randomHeroNum]
          hero.number = 10
        }
      }
      cards.push(hero)
    }
    let data = await this.getData()
    data.list = cards
    data.cardsNum = num
    if (num <= 1) {
      data.bg = 'drawcard1.png'
    } else {
      data.bg = 'drawcard.png'
    }
    data.bgOne = 'bg.png'
    return data
  }

  /**
   * 获取指定星数角色
   * @param {number} num 英雄星数： 1, 2, 3
   * @returns {*}
   */
  async getHeroStar (num) {
    const heros = JSON.parse((await readFile(new URL('./../config/default/pcr/hero.json', import.meta.url))).toString())
    return heros.filter(f => f.star === num)
  }
}
