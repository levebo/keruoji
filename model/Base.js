export default class Base {
  constructor (e = {}) {
    this.e = e
    this.userId = e?.user_id
    this.model = 'keruoji'
    this._path = process.cwd().replace(/\\/g, '/')
  }

  get prefix () {
    return `Yz:keruoji:${this.model}:`
  }

  /**
   * 截图默认数据
   * @param saveId html保存id
   * @param tplFile 模板html路径
   * @param pluResPath 插件资源路径
   */
  get screenData () {
    return {
      saveId: this.userId,
      cwd: this._path,
      tplFile: `./plugins/keruoji/resources/html/${this.model}/${this.model}.html`,
      /** 绝对路径 */
      pluResPath: `${this._path}/plugins/keruoji/resources/`
    }
  }
}
