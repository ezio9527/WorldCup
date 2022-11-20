<template>
  <div class="home-view">
    <BannerComp></BannerComp>
    <van-tabbar v-model="active" :fixed="false" :route="true">
      <van-tabbar-item to="/home/all">未开赛</van-tabbar-item>
      <van-tabbar-item to="/home/progress">比赛中</van-tabbar-item>
      <van-tabbar-item to="/home/end">已结束</van-tabbar-item>
      <van-tabbar-item to="/home/record">我的竞猜</van-tabbar-item>
      <van-tabbar-item to="/home/wallet">
        <div class="home-view_wallet" :class="{ unlink: !address }">
          <template v-if="address">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-link"></use>
            </svg>
            <span>已链接</span>
          </template>
          <template v-else>
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-unlink"></use>
            </svg>
            <span>未链接</span>
          </template>
        </div>
      </van-tabbar-item>
    </van-tabbar>
    <router-view />
  </div>
</template>

<script>
import BannerComp from '@views/home/BannerComp.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HomeView',
  components: {
    BannerComp
  },
  data() {
    return {
      active: 0
    }
  },
  computed: {
    ...mapGetters({
      address: 'wallet/getAddress',
      wallet: 'wallet/getWallet'
    })
  }
}
</script>

<style lang="less" scoped>
.home-view {
  overflow: hidden;
  width: 100%;
  .home-view_wallet {
    display: flex;
    align-items: center;
    color: #67c23a;
    &.unlink {
      color: #f56c6c;
    }
  }
}
@media screen and (min-width: 576px) {
  .home-view,
  .keep-px {
    width: 576px;
  }
}
</style>
