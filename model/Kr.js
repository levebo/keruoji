import Base from './Base.js'
import { readFile } from 'fs/promises'
import { FileNum, Random, Version } from '../components/index.js'
import { segment } from 'oicq'

export default class Kr extends Base {
  constructor (e) {
    super(e)
    this.model = 'kr'
  }

  async getKrData () {
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
    let heroInfoList = hero.filter(f => f.name.toLowerCase().includes(name) ? true : f.alias.toLowerCase().includes(name))
    let heroInfo = heroInfoList.length > 0 ? heroInfoList[0] : null
    if (heroInfo !== null) {
      let data = await this.getKrData()
      data.hero = heroInfo
      data.other = this.getBaseByClasses(heroInfo.info.basicInfo.classes)
      return data
    }
  }

  /**
   * 获取立绘
   * @param name 英雄名可选 不传直接返回随机立绘
   * @returns {Promise<ImageElem[]>}
   */
  async getLie (name) {
    const hero = await this.getHero()
    if (name !== '') {
      let heroInfoList = hero.filter(f => f.name.toLowerCase().includes(name) ? true : f.alias.toLowerCase().includes(name))
      let heroInfo = heroInfoList.length > 0 ? heroInfoList[0] : null
      if (heroInfo !== null) {
        let filePath = process.cwd() + '/plugins/keruoji/resources/img/kr/hero/costume/' + heroInfo.id
        let fileNum = await FileNum(filePath)
        let num = Random.num(fileNum)
        if (num == 0) {
          num++
        }
        return [segment.image(filePath + '/' + num + '.png')]
      }
    } else {
      let filePath = process.cwd() + '/plugins/keruoji/resources/img/kr/hero/costume/' + Random.num(hero.length)
      let fileNum = await FileNum(filePath)
      let num = Random.num(fileNum)
      if (num == 0) {
        num++
      }
      return [segment.image(filePath + '/' + num + '.png')]
    }
  }

  /**
   * 通过 角色类型获取角色名称列表
   * @param classes 角色类型
   * @returns {Promise<string>}
   */
  async getNameList (classes) {
    const hero = await this.getHero()
    if (classes !== '') {
      let heroInfoList = hero.filter(f => classes.toLowerCase().includes(f.info.basicInfo.classes))
      let nameArr = heroInfoList.map(m => m.name)
      return nameArr.join('\n')
    }
  }

  /**
   * 获取职业列表
   * @returns {Promise<string>}
   */
  async getClassesList () {
    let classesList = ['骑士', '战士', '刺客', '弓箭手', '机械工', '魔法师', '牧师']
    return classesList.join('\n')
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
        return { uw: 112763, ut: 3990076, bg: 'jobBg01.jpg' }
      case '战士':
        return { uw: 127798, ut: 3990076, bg: 'jobBg02.jpg' }
      case '刺客':
        return { uw: 140520, ut: 3990076, bg: 'jobBg03.jpg' }
      case '弓箭手':
        return { uw: 158157, ut: 3990076, bg: 'jobBg04.jpg' }
      case '机械工':
        return { uw: 144278, ut: 3990076, bg: 'jobBg05.jpg' }
      case '魔法师':
        return { uw: 147459, ut: 3990076, bg: 'jobBg06.jpg' }
      case '牧师':
        return { uw: 147459, ut: 3990076, bg: 'jobBg07.jpg' }
      default:
        return { uw: 0, ut: 0 }
    }
  }
}
