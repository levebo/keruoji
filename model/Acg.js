import Base from './Base.js'
import kjCfg from './kjCfg.js'
import { Random } from '../components/index.js'
import { segment } from "oicq";

export default class Acg extends Base {
  constructor (e) {
    super(e)
    this.model = 'acg'
  }

  async r18 (level) {
    let config = kjCfg.getConfig('acg', 'acg')
    let params = {
      r18: this.rating2(level)
    }
    let response = await fetch(`${config.lolicon.url}?num=1&r18=${params.r18}`)
    if (response.ok) {
      let res = await response.json()
      let msg = [
        '名称：', res.data[0].title,
        '\n作者：', res.data[0].author,
        segment.image(res.data[0].urls.original)
      ]
      return msg
    }
  }

  /**
   * 以图搜图
   */
  saucenao (img) {
    let config = kjCfg.getConfig('acg', 'acg')
  }

  /**
   * 随机搜图
   * @param {string} level 分级 s: safe, q: questionable, e: explicit
   */
  async yandere (level = 'q') {
    let config = kjCfg.getConfig('acg', 'acg')
    let params = {
      limit: 100,
      page: Random.num(100),
      rating: this.rating(level)
    }
    let response = await fetch(`${config.yandere.url}?limit=100&page=${params.page}&rating=${params.rating}`)
    if (response.ok) {
      let res = await response.json()
      return res.sample_url
    }
  }

  /**
   * 分级
   * @param {string} level 分级 s: safe, q: questionable, e: explicit
   */
  rating (level) {
    switch (level) {
      case 's':
        return 'safe'
      case 'q':
        return 'questionable'
      case 'e':
        return 'explicit'
      default:
        return 'unknown'
    }
  }

  /**
   *
   * 分级
   * @param {string} level 分级 s: 普通, q: 混合, e: r18
   * @returns {number}
   */
  rating2 (level) {
    switch (level) {
      case 's':
        return 0
      case 'q':
        return 2
      case 'e':
        return 1
      default:
        return 0
    }
  }
}
