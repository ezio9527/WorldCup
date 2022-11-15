import Web3 from 'web3'
import Contract from 'web3-eth-contract'
import ABIFactory from '@/server/contract/ABIFactory'
import Type from '@/plugins/Type'
import BigNumber from 'bignumber.js'

class BaseContract {
  /**
   * abi方法名
   * @type {string}
   */
  static ABI_NAME_APPROVE = 'approve'

  /**
   * 构造函数
   * @param {Array} abi 包含abi信息的Array对象
   * @param {String} walletAddress 钱包地址
   * @param {String} contractAddress 合约地址
   * @param {Number} decimals 代币精度
   */
  constructor(abi, walletAddress, contractAddress, decimals = 18) {
    // 设置rpc节点
    const web3Instanceof = new Web3(Web3.givenProvider)
    Contract.setProvider(web3Instanceof.eth.givenProvider)
    // 创建合约对象
    this.contract = new Contract(abi, contractAddress)
    this.contract.options.jsonInterface = abi
    this.contract.options.address = contractAddress
    this.contract.options.from = walletAddress
    // 创建ABI对象
    this.abi = new ABIFactory(abi)
    this.web3 = web3Instanceof
    // 设置代币精度
    this.decimals = decimals
  }

  /**
   * 获取代币信息
   */
  getSymbol() {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .symbol()
        .call({})
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * 获取余额
   */
  getBalanceInfo() {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .balanceOf(this.contract.options.from)
        .call({})
        .then((balance) => {
          let _balance = this.fromWei(balance)
          _balance = new BigNumber(_balance).toFixed(8, 1)
          _balance = new BigNumber(_balance).toString(10)
          resolve(_balance)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * 授权
   * @param {String} address 需要授权的代币地址
   * @param {Number} number 需要授权的代币数量
   */
  approve(address, number) {
    let num = Web3.utils.toWei(number.toString())
    num = Web3.utils.toHex(num)
    return new Promise((resolve, reject) => {
      const abi = this.getABI(BaseContract.ABI_NAME_APPROVE)
      const data = this.signature({
        func: abi,
        params: [address, Web3.utils.toHex(num)]
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
   * 查询授权
   * @param {String} spender 需要被授权的合约地址
   */
  allowance(spender) {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .allowance(this.contract.options.from, spender)
        .call({})
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * 根据名称获取abi对象
   * @param name
   * @returns {*|{}}
   */
  getABI(name) {
    return this.abi.getABIByName(name)
  }

  /**
   * 计算旷工费
   * @param {Object} address 用户地址
   * @param {Object} data 数据
   * @param {Object} value 转账金额
   */
  getGas({ data, from = this.contract.options.from, to = this.contract.options.address }) {
    return new Promise((resolve) => {
      // 计算旷工费
      console.log('开始计算旷工费gaslimit')
      window.ethereum
        .request({
          method: 'eth_estimateGas',
          params: [
            {
              from,
              QUANTITY: 'latest',
              to,
              data
            }
          ]
        })
        .then((gaslimit) => {
          console.log(Web3.utils.hexToNumber(gaslimit))
          resolve(Web3.utils.hexToNumber(gaslimit))
        })
        .catch((e) => {
          resolve(310000)
          console.log('gaslimit计算失败', e)
        })
    })
  }

  /**
   * 发送交易
   * @param {Number} gasLimit 自定义旷工费
   * @param {Object} address 用户地址
   * @param {Object} data 数据
   * @param {Object} value 转账金额
   */
  sendEtherFrom({ gasLimit, data, value = '0x0', from = this.contract.options.from, to = this.contract.options.address }) {
    return new Promise((resolve, reject) => {
      const parameters = [
        {
          from,
          to,
          value,
          data: data
        }
      ]
      const payload = {
        method: 'eth_sendTransaction',
        params: parameters,
        from
      }
      if (gasLimit) {
        parameters.gasLimit = gasLimit
        window.ethereum.sendAsync(payload, (error, response) => {
          if (error) {
            reject(error)
          }
          if (response.result) {
            resolve(response.result)
          }
        })
      } else {
        this.getGas({ data, value, from, to }).then((gasLimit) => {
          parameters.gasLimit = gasLimit
          window.ethereum.sendAsync(payload, (error, response) => {
            if (error) {
              reject(error)
            }
            if (response.result) {
              resolve(response.result)
            }
          })
          // getGas调用结束
        })
      }
    })
  }

  /**
   * 确认交易是否成功
   * @param {String} hash 交易Hash
   */
  getTransactionReceipt(hash) {
    return new Promise((resolve, reject) => {
      let queryTimes = 0
      const timer = setInterval(() => {
        queryTimes++
        window.ethereum
          .request({
            method: 'eth_getTransactionReceipt',
            params: [hash]
          })
          .then((res) => {
            console.log('交易确认函数-------', res)
            if (res) {
              console.log('交易确认了-------', res.status === 1)
              resolve(res.status === 1)
              clearInterval(timer)
            }
          })
          .catch((e) => {
            console.log(e)
          })
        if (queryTimes > 10) {
          clearInterval(timer)
          queryTimes = 0
          reject(new Error('timeout'))
        }
      }, 4000)
    })
  }

  /**
   * 签名
   * @param {Array} func
   * @param {Array} params
   */
  signature({ func, params }) {
    let data = ''
    const funcSign = this.web3.eth.abi.encodeFunctionSignature(func)
    data = funcSign
    const newParams = params.map((param) => {
      if (Type.isNumber(param)) {
        let temp = Web3.utils.toHex(param.toString()).substring(2)
        temp = Web3.utils.padLeft(temp, 64)
        return temp
      } else if (Type.isBoolean(param)) {
        let temp = Web3.utils.toHex(Web3.utils.toWei(param ? '1' : '0')).substring(2)
        temp = Web3.utils.padLeft(temp, 64)
        return temp
      } else if (Web3.utils.isHex(param)) {
        let temp = param.substring(2)
        temp = Web3.utils.padLeft(temp, 64)
        return temp
      } else {
        return param
      }
    })
    return data + newParams.join('')
  }

  // 获取精度和处理后的数
  _getDecimals(number) {
    let _decimals = '',
      _number = number
    const decimalsList = {
      3: 'kwei',
      6: 'mwei',
      9: 'gwei',
      12: 'szabo',
      15: 'finney',
      18: 'ether'
    }
    _decimals = decimalsList[this.decimals]
    if (!_decimals) {
      let _d
      switch (this.decimals) {
        case 1:
          _number = _number + '00'
          _d = 3
          break
        case 2:
          _number = _number + '0'
          _d = 3
          break
        case 4:
          _number = _number + '00'
          _d = 6
          break
        case 5:
          _number = _number + '0'
          _d = 6
          break
        case 7:
          _number = _number + '00'
          _d = 9
          break
        case 8:
          _number = _number + '0'
          _d = 9
          break
        case 10:
          _number = _number + '00'
          _d = 12
          break
        case 11:
          _number = _number + '0'
          _d = 12
          break
        case 13:
          _number = _number + '00'
          _d = 15
          break
        case 14:
          _number = _number + '0'
          _d = 15
          break
        case 16:
          _number = _number + '00'
          _d = 18
          break
        case 17:
          _number = _number + '0'
          _d = 18
          break
      }
      _decimals = decimalsList[_d]
    }
    return {
      _number,
      _decimals
    }
  }
  /**
   * 根据合约精度转换单位
   * @param {Number} number 代币
   */
  fromWei(number) {
    const result = this._getDecimals(number)
    return Web3.utils.fromWei(result._number, result._decimals)
  }

  /**
   * 根据合约精度转换单位
   * @param {Number} number 代币
   */
  toWei(number) {
    const result = this._getDecimals(number)
    return Web3.utils.toWei(result._number, result._decimals)
  }
}

export default BaseContract
