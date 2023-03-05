import Base from './Base.js'
import kjCfg from './kjCfg.js'
import { Random } from '../components/index.js'
import { segment } from 'oicq'

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
   * @param img
   * @returns {Promise<string[]>}
   */
  async saucenao (img) {
    let config = kjCfg.getConfig('acg', 'acg')
    let url = `${config.saucenao.url}?db=999&api_key=${config.saucenao.apiKey}&output_type=2&testmode=1&url=${encodeURIComponent(img[0])}`
    let response = await fetch(url)
    if (response.ok) {
      const res = await response.json()
      const results = res.results
      if (results.length > 0) {
        const { header, data } = results[0]
        // 相似度 ,来源id
        // eslint-disable-next-line camelcase
        const { similarity, index_id } = header
        // 来源信息
        const {
          // eslint-disable-next-line camelcase
          ext_urls = [], title, pixiv_id, member_name, member_id, user_id, user_name, creator, creator_name, // 图片信息
          // eslint-disable-next-line camelcase
          source, part, year, est_time // 番剧信息
        } = data
        let indexArr = this.saucenaoIndex(index_id)
        let sourceName = indexArr ? indexArr[0].name : undefined

        let res = [
          '经过妈分析 \n'
        ]
        // eslint-disable-next-line camelcase
        if (source && est_time) { // 番剧出处
          res.push('该片段 \n')
          // eslint-disable-next-line camelcase
          if (ext_urls.length > 0) {
            // eslint-disable-next-line camelcase
            res.push(`出处地址: ${ext_urls[0]}\n`)
          }
          if (part) {
            res.push(`出现集数: ${part}`)
          }
          // eslint-disable-next-line camelcase
          if (est_time) {
            // eslint-disable-next-line camelcase
            res.push(`出现时间: ${est_time}`)
          }
          if (year) {
            res.push(`推出年份: ${year}`)
          }
          if (source) {
            res.push(`名称: ${source}`)
          }
          if (similarity) {
            res.push(`\n相似度: ${similarity}%`)
          }
        } else { // 图片出处
          res.push('该图 \n')
          // eslint-disable-next-line camelcase
          if (ext_urls.length > 0) {
            // eslint-disable-next-line camelcase
            res.push(`出处地址: ${ext_urls[0]}\n`)
          }
          if (sourceName) {
            res.push(`来源: ${sourceName}`)
          }
          if (title) {
            res.push(`标题: ${title}`)
          }
          // eslint-disable-next-line camelcase
          if (pixiv_id) {
            // eslint-disable-next-line camelcase
            res.push(`P站信息: pixiv_id=${pixiv_id} member_id=${member_id} member_name=${member_name} \n`)
          }
          // eslint-disable-next-line camelcase
          if (user_id || user_name || creator || creator_name) {
            // eslint-disable-next-line camelcase
            if ((user_id || creator) && (user_name || creator_name)) {
              // eslint-disable-next-line camelcase
              res.push(`作者id: ${user_id || creator}`)
            }
            // eslint-disable-next-line camelcase
            res.push(`作者名称: ${user_name || creator_name || creator}`)
          }
          if (similarity) {
            res.push(`\n相似度: ${similarity}%`)
          }
        }
        return res
      }
    }
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

  /**
   * saucenao 接口 来源映射
   * @param index
   * @returns {({name: string, index: string}|{name: string, index: string}|{name: string, index: string}|{name: string, index: string}|{name: string, index: string})[]}
   */
  saucenaoIndex (index) {
    const data = [
      {
        index: '0',
        name: 'h-mags'
      },
      {
        index: '1',
        name: 'h-anime*'
      },
      {
        index: '2',
        name: 'hcg'
      },
      {
        index: '3',
        name: 'ddb-objects*'
      },
      {
        index: '4',
        name: 'ddb-samples*'
      },
      {
        index: '5',
        name: 'pixiv'
      },
      {
        index: '6',
        name: 'pixivhistorical'
      },
      {
        index: '7',
        name: 'anime*'
      },
      {
        index: '8',
        name: 'seiga_illust - nico nico seiga'
      },
      {
        index: '9',
        name: 'danbooru'
      },
      {
        index: '10',
        name: 'drawr'
      },
      {
        index: '11',
        name: 'nijie'
      },
      {
        index: '12',
        name: 'yande.re'
      },
      {
        index: '13',
        name: 'animeop*'
      },
      {
        index: '14',
        name: 'IMDb*'
      },
      {
        index: '15',
        name: 'Shutterstock*'
      },
      {
        index: '16',
        name: 'FAKKU'
      },
      {
        index: '18',
        name: 'H-MISC (nhentai)'
      },
      {
        index: '19',
        name: '2d_market'
      },
      {
        index: '20',
        name: 'medibang'
      },
      {
        index: '21',
        name: 'Anime'
      },
      {
        index: '22',
        name: 'H-Anime'
      },
      {
        index: '23',
        name: 'Movies'
      },
      {
        index: '24',
        name: 'Shows'
      },
      {
        index: '25',
        name: 'gelbooru'
      },
      {
        index: '26',
        name: 'konachan'
      },
      {
        index: '27',
        name: 'sankaku'
      },
      {
        index: '28',
        name: 'anime-pictures'
      },
      {
        index: '29',
        name: 'e621'
      },
      {
        index: '30',
        name: 'idol complex'
      },
      {
        index: '31',
        name: 'bcy illust'
      },
      {
        index: '32',
        name: 'bcy cosplay'
      },
      {
        index: '33',
        name: 'portalgraphics'
      },
      {
        index: '34',
        name: 'dA'
      },
      {
        index: '35',
        name: 'pawoo'
      },
      {
        index: '36',
        name: 'madokami'
      },
      {
        index: '37',
        name: 'mangadex'
      },
      {
        index: '38',
        name: 'H-Misc (ehentai)'
      },
      {
        index: '39',
        name: 'ArtStation'
      },
      {
        index: '40',
        name: 'FurAffinity'
      },
      {
        index: '41',
        name: 'Twitter'
      },
      {
        index: '42',
        name: 'Furry Network'
      },
      {
        index: '43',
        name: 'Kemono'
      },
      {
        index: '44',
        name: 'Skeb'
      }
    ]
    return data.filter(f => f.index == index)
  }
}
