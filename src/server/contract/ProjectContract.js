import BaseContract from '@/server/contract/BaseContract'
import config from '@data/config.js'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

class ProjectContract extends BaseContract {
  /**
   * abi方法名
   * @type {string}
   */
  static ABI_NAME_BETTING = 'bet'
  static ABI_NAME_PICKUP = 'drawIncome'

  /**
   * 初始化合约构造器
   * @param {String} walletAddress 钱包地址
   */
  constructor(walletAddress) {
    super(config.abi.Project, walletAddress, config.contract.Project.address, config.contract.Token.decimals)
  }

  /**
   * 查中奖收益
   */
  findIncome() {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .findInfo()
        .call({})
        .then((res) => {
          let _income = this.fromWei(res[0].toString())
          _income = new BigNumber(_income).toFixed(8, 1)
          _income = new BigNumber(_income).toString(10)
          resolve(_income)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * 下注
   * @param {String} id 赛程ID
   * @param {Number} result 赛果
   * @param {Number} number 下注数量
   */
  betting({ id, result, number }) {
    let _id = Web3.utils.toHex(id.toString())
    let _result = Web3.utils.toHex(result.toString())
    let _number = this.toWei(number)
    _number = Web3.utils.toHex(_number)
    return new Promise((resolve, reject) => {
      const abi = this.getABI(ProjectContract.ABI_NAME_BETTING)
      const data = this.signature({
        func: abi,
        params: [_id, _result, _number]
      })
      this.sendEtherFrom({ data })
        .then((hash) => {
          resolve(hash)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  /**
   * 提取中奖收益
   */
  pickup() {
    return new Promise((resolve, reject) => {
      const abi = this.getABI(ProjectContract.ABI_NAME_PICKUP)
      const data = this.signature({
        func: abi,
        params: []
      })
      this.sendEtherFrom({ data })
        .then((hash) => {
          resolve(hash)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }
}

export default ProjectContract
