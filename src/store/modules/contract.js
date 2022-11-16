// 合约
import ProjectContract from '@/server/contract/ProjectContract'
import ERCContract from '@/server/contract/ERCContract'
import config from '@data/config.js'
import Web3 from 'web3'
// import Web3 from 'web3'

const state = () => ({
  projectContract: null,
  ercContract: null,
  balance: 0, // erc代币余额
  allowance: false, // erc代币授权
  income: 0 // 中奖收益
})

// getters
const getters = {
  getIncome(state) {
    return state.income
  },
  getProjectContract(state) {
    return state.projectContract
  },
  getErcContract(state) {
    return state.ercContract
  },
  getTokenBalance(state) {
    return state.balance
  },
  getAllowance(state) {
    return state.allowance
  }
}

// mutations
const mutations = {
  setIncome(state, income) {
    state.income = income
  },
  setProjectContract(state, contract) {
    state.projectContract = contract
  },
  setErcContract(state, contract) {
    state.ercContract = contract
  },
  setTokenBalance(state, balance) {
    state.balance = balance
  },
  setAllowance(state, allowance) {
    state.allowance = allowance
  }
}

const actions = {
  initialize({ commit }, account) {
    // 创建竞猜合约
    const projectContract = new ProjectContract(account)
    commit('setProjectContract', projectContract)
    // 创建代币合约
    const ercContract = new ERCContract(account, config.contract.Token.address, config.contract.Token.decimals)
    commit('setErcContract', ercContract)
    // 查询代币余额
    const qryBalance = () => {
      ercContract.getBalanceInfo().then((balance) => {
        commit('setTokenBalance', balance)
      })
    }
    // 查询中奖收益
    const qryIncome = () => {
      projectContract.findIncome().then((income) => {
        console.log(income)
        commit('setIncome', income[0])
      })
    }
    // 查询授权
    const allowance = () => {
      ercContract
        .allowance(config.contract.Project.address)
        .then((num) => {
          num = Web3.utils.toBN(num.toString())
          commit('setAllowance', num.gt(Web3.utils.toBN(0)))
        })
        .catch(() => {
          // 额度查询失败
          allowance()
        })
    }
    allowance()
    qryBalance()
    qryIncome()
    setInterval(() => {
      qryBalance()
      qryIncome()
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
