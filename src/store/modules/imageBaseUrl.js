import { getBaseUrl } from '@/server/http/api'

const state = () => ({
  // 所有图片的BaseUrl
  url: ''
})

// getters
const getters = {
  getUrl: (state) => {
    return state.url
  }
}

// mutations
const mutations = {
  setUrl(state, url) {
    state.url = url
  }
}

// actions
const actions = {
  getBaseUrl({ commit, dispatch }) {
    getBaseUrl()
      .then((data) => {
        commit('setUrl', data)
      })
      .catch(() => {
        dispatch('getBaseUrl')
      })
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
