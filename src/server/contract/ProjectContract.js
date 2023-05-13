import BaseContract from '@/server/contract/BaseContract'
import config from '@data/config.js'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

class ProjectContract extends BaseContract {
  /**
   * abi方法名
   * @type {String}
   */
  static ABI_NAME_DEPOSIT = 'deposit'
  static ABI_NAME_TRANSFER = 'workTransfer'
  static ABI_NAME_TRUSTEESHIP = 'fund'
  static ABI_NAME_DRAW = 'withDraw'
  static ABI_NAME_BETTING = 'bet'
  static ABI_NAME_PICKUP = 'drawIncome'

  /**
   * 参数
   * @type {String | Number}
   */
  static PARAMS_BALANCE_TO_TRUSTEESHIP = 0
  static PARAMS_TRUSTEESHIP_TO_BALANCE = 1

  /**
   * 初始化合约构造器
   * @param {String} walletAddress 钱包地址
   */
  constructor(walletAddress) {
    super(config.abi.Project, walletAddress, config.contract.Project.address, config.contract.Token.decimals)
  }

  /**
   * 查余额账户USDT
   */
  findBalanceByBalance() {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .balAccount(this.contract.options.from)
        .call({})
        .then((res) => {
          let balance = this.fromWeiByDecimals(res.toString(), config.contract.USDT.decimals)
          balance = new BigNumber(balance).toFixed(8, 1)
          balance = new BigNumber(balance).toString(10)
          resolve(balance)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * 查托管账户USDT
   */
  findBalanceByTrusteeship() {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .fundAccount(this.contract.options.from)
        .call({})
        .then((res) => {
          let balance = this.fromWeiByDecimals(res[0].toString(), config.contract.USDT.decimals)
          balance = new BigNumber(balance).toFixed(8, 1)
          balance = new BigNumber(balance).toString(10)
          let freeze = this.fromWeiByDecimals(res['freeze'].toString(), config.contract.USDT.decimals)
          freeze = new BigNumber(freeze).toFixed(8, 1)
          freeze = new BigNumber(freeze).toString(10)
          resolve({ balance, freeze })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * 托管账户充值
   * @param {String} address 邀请人地址
   * @param {Number} number 数量
   */
  deposit({ number, address }) {
    let _address = Web3.utils.toHex('')
    if (address) {
      _address = Web3.utils.toHex(address.toString())
    }
    let _number = this.toWeiByDecimals(number.toString(), config.contract.USDT.decimals)
    _number = Web3.utils.toHex(_number)
    return new Promise((resolve, reject) => {
      const abi = this.getABI(ProjectContract.ABI_NAME_DEPOSIT)
      const data = this.signature({
        func: abi,
        params: [_address, _number]
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
   * 余额账户提现
   * @param {Number} number 数量
   */
  draw(number) {
    let _number = this.toWeiByDecimals(number.toString(), config.contract.USDT.decimals)
    _number = Web3.utils.toHex(_number)
    return new Promise((resolve, reject) => {
      const abi = this.getABI(ProjectContract.ABI_NAME_DRAW)
      const data = this.signature({
        func: abi,
        params: [_number]
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
   * 账户划转
   * @param {Number} type 转账方向
   * @param {Number} number 数量
   */
  transfer({ type, number }) {
    let _type = Web3.utils.toHex(type)
    let _number = this.toWeiByDecimals(number.toString(), config.contract.USDT.decimals)
    _number = Web3.utils.toHex(_number)
    return new Promise((resolve, reject) => {
      const abi = this.getABI(ProjectContract.ABI_NAME_TRANSFER)
      const data = this.signature({
        func: abi,
        params: [_type, _number]
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
   * 托管
   * @param {Number} number 数量
   */
  trusteeship(number) {
    let _number = this.toWeiByDecimals(number.toString(), config.contract.USDT.decimals)
    _number = Web3.utils.toHex(_number)
    return new Promise((resolve, reject) => {
      const abi = this.getABI(ProjectContract.ABI_NAME_TRUSTEESHIP)
      const data = this.signature({
        func: abi,
        params: [_number]
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
