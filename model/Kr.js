import Base from './Base.js'
import { readFile } from 'fs/promises'
import { Version } from '../components/index.js'

export default class Kr extends Base {
  constructor (e) {
    super(e)
    this.model = 'kr'
  }

  async getData () {
    return {
      ...this.screenData,
      saveId: 'kr',
      version: Version.version
    }
  }

  /**
   * 通过名字获取 角色信息
   * @param {string} name 名字
   * @returns {Promise<string>}
   */
  async getInfo (name) {
    const hero = await this.getHero()
    let heroInfoList = hero.filter(f => name.includes(f.name) ? true : name.includes(f.alias))
    let heroInfo = heroInfoList.length > 0 ? heroInfoList[0] : null
    if (heroInfo !== null) {
      let data = await this.getData()
      data.hero = heroInfo
      data.other = this.getBaseByClasses(heroInfo.info.basicInfo.classes)
      return data
    }
  }

  /**
   * 获取角色信息
   * @returns {Promise<any>}
   */
  async getHero () {
    return JSON.parse((await readFile(new URL('./../config/default/kr/kr-data.json', import.meta.url))).toString())
  }

  /**
   * 通过职业类型 获取专武专宝 基础攻击血量信息
   * @param classes 角色职业
   * @returns {{uw: number, ut: number}}
   */
  getBaseByClasses (classes) {
    switch (classes) {
      case '骑士':
        return { uw: 112763, ut: 3990076 }
      case '战士':
        return { uw: 127798, ut: 3990076 }
      case '刺客':
        return { uw: 140520, ut: 3990076 }
      case '弓箭手':
        return { uw: 158157, ut: 3990076 }
      case '机械工':
        return { uw: 144278, ut: 3990076 }
      case '魔法师':
        return { uw: 147459, ut: 3990076 }
      case '牧师':
        return { uw: 147459, ut: 3990076 }
      default:
        return { uw: 0, ut: 0 }
    }
  }
}
