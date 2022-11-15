import { createStore } from 'vuex'
import imageBaseUrl from './modules/imageBaseUrl'
import wallet from './modules/wallet'
import contract from './modules/contract'
import transaction from './modules/transaction'

// const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    imageBaseUrl,
    wallet,
    contract,
    transaction
  }
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})
