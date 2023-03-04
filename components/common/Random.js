/**
 * 随机数处理
 */
let Random = {
  /**
   * 生成随机数
   * @param {number} minNum
   * @param {?number} [maxNum]
   * @returns {number}
   */
  num (minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt((Math.random() * minNum).toString(), 10)
      case 2:
        return parseInt((Math.random() * (maxNum - minNum) + minNum).toString(), 10)
      default:
        return 0
    }
  }
}

export default Random
