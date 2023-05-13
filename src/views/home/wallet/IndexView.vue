<template>
  <div class="wallet-view">
    <div class="wallet-view_connected" v-if="address">
      <van-cell-group inset>
        <van-cell id="copy-wallet-address">
          <template #title>
            <span>钱包地址(点击复制)</span>
          </template>
          <template #label>
            <span class="line-word-hidden">{{ address }}</span>
          </template>
        </van-cell>
        <van-cell id="copy-project-address">
          <template #title>
            <span>云链地址(点击复制)</span>
          </template>
          <template #label>
            <span class="line-word-hidden">{{ config.contract.Project.address }}</span>
          </template>
        </van-cell>
        <van-cell id="copy-tgt-address">
          <template #title>
            <span>TGT地址(点击复制)</span>
          </template>
          <template #label>
            <span class="line-word-hidden">{{ config.contract.Token.address }}</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <div @click="wallet.enable" class="wallet-view_connect" v-else>
      <div>
        <svg class="icon svg-icon" aria-hidden="true">
          <use xlink:href="#icon-wifi"></use>
        </svg>
        <div>点击链接钱包</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ClipboardJS from 'clipboard'
import config from '@/assets/data/config'

export default {
  name: 'WalletView',
  data() {
    return {
      config
    }
  },
  computed: {
    ...mapGetters({
      address: 'wallet/getAddress',
      wallet: 'wallet/getWallet'
    })
  },
  mounted() {
    const copyWalletAddress = new ClipboardJS('#copy-wallet-address', {
      text: () => {
        return this.address
      }
    })
    copyWalletAddress.on('success', () => {
      this.$toast('钱包地址复制成功!')
    })
    copyWalletAddress.on('error', () => {
      this.$toast('钱包地址复制失败!')
    })
    const copyProjectAddress = new ClipboardJS('#copy-project-address', {
      text: () => {
        return this.config.contract.Project.address
      }
    })
    copyProjectAddress.on('success', () => {
      this.$toast('云链地址复制成功!')
    })
    copyProjectAddress.on('error', () => {
      this.$toast('云链地址复制失败!')
    })
    const copyTGTAddress = new ClipboardJS('#copy-tgt-address', {
      text: () => {
        return this.config.contract.Project.address
      }
    })
    copyTGTAddress.on('success', () => {
      this.$toast('TGT地址复制成功!')
    })
    copyTGTAddress.on('error', () => {
      this.$toast('TGT地址复制失败!')
    })
  }
}
</script>

<style lang="less" scoped>
.wallet-view {
  flex: 1;
  background-color: #f6f6f6;
  .wallet-view_connect {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    > div {
      text-align: center;
      svg {
        font-size: 100px;
      }
    }
  }
  .wallet-view_connected {
    width: 100%;
    height: 100%;
    display: block;
    overflow: hidden;
    padding-top: 20px;
  }
}
</style>
