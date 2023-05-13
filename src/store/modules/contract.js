// 合约
import ProjectContract from '@/server/contract/ProjectContract'
import ERCContract from '@/server/contract/ERCContract'
import config from '@data/config.js'
import Web3 from 'web3'

const state = () => ({
  projectContract: null, // 项目合约对象
  usdtContract: null, // usdt合约对象
  tgtContract: null, // tgt合约对象
  usdt: 0, // usdt余额
  usdtAllowance: false, // usdt授权
  tgt: 0, // tgt余额
  tgtAllowance: false, // tgt授权
  usdtForBalance: 0, // 余额账户里的usdt
  usdtForTrusteeship: 0, // 托管账户里的usdt
  usdtForFreeze: 0 // 托管账户里冻结的usdt
})

// getters
const getters = {
  getProjectContract(state) {
    return state.projectContract
  },
  getUsdtContract(state) {
    return state.usdtContract
  },
  getTgtContract(state) {
    return state.tgtContract
  },
  getUsdt(state) {
    return state.usdt
  },
  getUsdtAllowance(state) {
    return state.usdtAllowance
  },
  getTgt(state) {
    return state.tgt
  },
  getTgtAllowance(state) {
    return state.tgtAllowance
  },
  getUsdtForBalance(state) {
    return state.usdtForBalance
  },
  getUsdtForTrusteeship(state) {
    return state.usdtForTrusteeship
  },
  getUsdtForFreeze(state) {
    return state.usdtForFreeze
  }
}

// mutations
const mutations = {
  setProjectContract(state, contract) {
    state.projectContract = contract
  },
  setUsdtContract(state, usdtContract) {
    state.usdtContract = usdtContract
  },
  setTgtContract(state, tgtContract) {
    state.tgtContract = tgtContract
  },
  setUsdt(state, usdt) {
    state.usdt = usdt
  },
  setUsdtAllowance(state, usdtAllowance) {
    state.usdtAllowance = usdtAllowance
  },
  setTgt(state, tgt) {
    state.tgt = tgt
  },
  setTgtAllowance(state, tgtAllowance) {
    state.tgtAllowance = tgtAllowance
  },
  setUsdtForBalance(state, usdtForBalance) {
    state.usdtForBalance = usdtForBalance
  },
  setUsdtForTrusteeship(state, usdtForTrusteeship) {
    state.usdtForTrusteeship = usdtForTrusteeship
  },
  setUsdtForFreeze(state, usdtForFreeze) {
    state.usdtForFreeze = usdtForFreeze
  }
}

const actions = {
  initialize({ commit }, account) {
    // 创建项目合约
    const projectContract = new ProjectContract(account)
    commit('setProjectContract', projectContract)
    // 创建usdt合约
    const usdtContract = new ERCContract(account, config.contract.USDT.address, config.contract.USDT.decimals)
    commit('setUsdtContract', usdtContract)
    // 创建tgt合约
    const tgtContract = new ERCContract(account, config.contract.Token.address, config.contract.Token.decimals)
    commit('setTgtContract', tgtContract)
    const qryBalance = () => {
      // 查询钱包里代币余额
      usdtContract.getBalanceInfo().then((balance) => {
        commit('setUsdt', balance)
      })
      tgtContract.getBalanceInfo().then((balance) => {
        commit('setTgt', balance)
      })
      // 查询余额账户和托管账户里的USDT
      projectContract.findBalanceByBalance().then((balance) => {
        commit('setUsdtForBalance', balance)
      })
      projectContract.findBalanceByTrusteeship().then(({ balance, freeze }) => {
        commit('setUsdtForTrusteeship', balance)
        commit('setUsdtForFreeze', freeze)
      })
    }
    // 查询授权
    const allowance = () => {
      usdtContract
        .allowance(config.contract.Project.address)
        .then((num) => {
          num = Web3.utils.toBN(num.toString())
          commit('setUsdtAllowance', num.gt(Web3.utils.toBN(0)))
        })
        .catch(() => {
          // 额度查询失败
          allowance()
        })
      tgtContract
        .allowance(config.contract.Project.address)
        .then((num) => {
          num = Web3.utils.toBN(num.toString())
          commit('setTgtAllowance', num.gt(Web3.utils.toBN(0)))
        })
        .catch(() => {
          // 额度查询失败
          allowance()
        })
    }
    allowance()
    qryBalance()
    setInterval(() => {
      qryBalance()
    }, 5000)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {}
}
