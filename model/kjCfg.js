import YAML from 'yaml'
import fs from 'node:fs'
import chokidar from 'chokidar'

/**
 * 配置文件
 */
class KjCfg {
  constructor () {
    /** 默认设置 */
    // 默认配置路径
    this.defSetPath = './plugins/keruoji/config/default/'
    // 默认配置信息
    this.defSet = {}
    /** 用户设置 */
    this.configPath = './plugins/keruoji/config/user/'
    this.config = {}
    /** 监听文件
     * @type {{config: {}, defSet: {}}}
     */
    this.watcher = { defSet: {}, config: {} }
    this.ignore = []
  }

  /**
   *
   * @param app 功能
   * @param name 配置文件名称
   */
  getDefSet (app, name) {
    return this.getYaml(app, name, 'defSet')
  }

  /**
   * 获取配置信息
   * @param app
   * @param name
   * @returns {*|boolean|(*)}
   */
  getConfig (app, name) {
    if (this.ignore.includes(`${app}.${name}`)) {
      return this.getYaml(app, name, 'config')
    }

    return { ...this.getDefSet(app, name), ...this.getYaml(app, name, 'config') }
  }

  /**
   * 获取配置yaml
   * @param app 功能
   * @param name 名称
   * @param type 默认跑配置-defSet，用户配置-config
   * @param app
   * @param name
   * @param type
   * @returns {*|boolean}
   */
  getYaml (app, name, type) {
    let file = this.getFilePath(app, name, type)
    let key = `${app}.${name}`

    if (this[type][key]) return this[type][key]

    try {
      this[type][key] = YAML.parse(
        fs.readFileSync(file, 'utf8')
      )
    } catch (error) {
      logger.error(`[${app}][${name}] 格式错误 ${error}`)
      return false
    }

    this.watch(file, app, name, type)

    return this[type][key]
  }

  /***
   * 获取文件路径
   * @param app 功能
   * @param name 名称
   * @param type 默认跑配置-defSet，用户配置-config
   * @returns {string}
   */
  getFilePath (app, name, type) {
    if (type == 'defSet') return `${this.defSetPath}${app}/${name}.yaml`
    else return `${this.configPath}${app}/${name}.yaml`
  }

  /** 监听配置文件 */
  watch (file, app, name, type = 'defSet') {
    let key = `${app}.${name}`

    if (this.watcher[type][key]) return

    const watcher = chokidar.watch(file)
    watcher.on('change', path => {
      delete this[type][key]
      logger.mark(`[修改配置文件][${type}][${app}][${name}]`)
      if (this[`change_${app}${name}`]) {
        this[`change_${app}${name}`]()
      }
    })

    this.watcher[type][key] = watcher
  }
}

export default new KjCfg()
