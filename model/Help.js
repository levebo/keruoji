import kjCfg from './kjCfg.js'
import { Version } from './../components/index.js'
import Base from './Base.js'

export default class Help extends Base {
  constructor (e) {
    super(e)
    this.model = 'help'
  }

  static async get (e) {
    let html = new Help(e)
    return await html.getData()
  }

  async getData () {
    let helpData = kjCfg.getDefSet('bot', 'help')

    return {
      ...this.screenData,
      saveId: 'help',
      version: Version.version,
      helpData
    }
  }
}
