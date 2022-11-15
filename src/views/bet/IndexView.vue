<template>
  <div class="bet-view">
    <van-nav-bar title="投注记录" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-pull-refresh v-model="refreshLoading" :head-height="80" @refresh="onRefresh">
      <van-cell size="large" :title="(distance.aTeamName || 'A队') + ' vs ' + (distance.bTeamName || 'B队')" :value="new Date(distance.time).format('yyyy-MM-dd hh:mm:ss')" />
      <van-row class="bet-list_header">
        <van-col span="8">时间</van-col>
        <van-col span="8">下注</van-col>
        <van-col span="8">金额</van-col>
      </van-row>
      <van-row v-for="i in 10" :key="i">
        <van-col span="8">2022-11-11<br />12:11:12</van-col>
        <van-col span="8">A队</van-col>
        <van-col span="8">8.1231231</van-col>
      </van-row>
    </van-pull-refresh>
  </div>
</template>

<script>
import { findBetRecordByDistance } from '@/server/http/api'
import { mapGetters } from 'vuex'

export default {
  name: 'BetView',
  props: {
    distance: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      address: 'wallet/getAddress'
    })
  },
  watch: {
    address: {
      immediate: true,
      handler(val) {
        if (val) {
          this.onRefresh()
        }
      }
    }
  },
  data() {
    return {
      refreshLoading: false,
      data: []
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    onRefresh() {
      this.pageNo = 1
      this.findBetRecord()
    },
    findBetRecord() {
      findBetRecordByDistance({
        gameId: this.distance.id,
        walletAddress: this.address,
        pageSize: 1000000,
        pageNo: 1
      }).then((res) => {
        this.data = res
        this.refreshLoading = false
        this.listLoading = false
        if (!res || res.length < this.pageSize) {
          this.finished = true
        } else {
          this.finished = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.bet-view {
  flex: 1;
  .bet-list_header {
    height: 40px;
    background-color: #eeeeee;
  }
  .van-row {
    padding: 4px 15px;
    font-size: 12px;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      margin: auto;
      width: 100%;
      height: 1px;
      background: #eeeeee;
      transform: scaleY(0.8);
    }
    .van-col:nth-child(1) {
      display: flex;
      align-items: center;
    }
    .van-col:nth-child(2),
    .van-col:nth-child(3) {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
