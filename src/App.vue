<template>
  <KeepAlive>
    <RouterView />
  </KeepAlive>
</template>

<script>
import { Locale } from 'vant'
import zhCN from 'vant/es/locale/lang/zh-CN'
import enUS from 'vant/es/locale/lang/en-US'
import Wallet from '@/plugins/Wallet'
import config from '@/assets/data/config.js'

export default {
  name: 'App',
  data() {
    return {
      wallet: null
    }
  },
  mounted() {
    this.wallet = new Wallet({
      config: config.wallet,
      enable: this.enableHandler,
      connect: this.connectHandler,
      chainChanged: this.enable,
      accountsChanged: this.enableHandler
    })
    this.$store.commit('wallet/setWallet', this.wallet)
    this.setLanguage()
    this.$store.dispatch('imageBaseUrl/getBaseUrl')
  },
  methods: {
    // 授权回调
    enableHandler(accounts) {
      this.$store.commit('wallet/setAddress', accounts[0])
      this.$store.dispatch('contract/initialize', accounts[0])
    },
    // 连接回调
    connectHandler({ wallet }) {
      wallet.enable()
    },
    // 网络切换回调
    enable({ wallet, chainId, config }) {
      if (chainId !== config.chainId) {
        this.$dialog
          .confirm({
            title: this.$t('common.changeNet'),
            message: this.$t('common.changeNetTips')
          })
          .then(() => {
            wallet.enable()
          })
          .catch(() => {
            // on cancel
            this.$notify({ message: this.$t('common.netError'), duration: 5000 })
          })
      } else {
        wallet.enable()
      }
    },
    // 设置语言环境
    setLanguage() {
      localStorage.setItem('language', 'zh')
      switch (localStorage.getItem('language')) {
        case 'en':
          Locale.use('en-US', enUS)
          break
        default:
          Locale.use('zh-CN', zhCN)
          break
      }
    }
  }
}
</script>

<style lang="less">
#app {
  overflow: hidden;
  > div {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}

@media screen and (min-width: 576px) {
  body {
    background-color: #eeeeee;
  }
  #app,
  .keep-px {
    max-width: 575px;
    margin-left: auto;
    margin-right: auto;
    background-color: #ffffff;
  }
}
</style>
