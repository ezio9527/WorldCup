<template>
  <div class="bet-view">
    <van-nav-bar title="投注记录" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-skeleton title :row="10" :loading="loading" />
    <van-pull-refresh v-model="refreshLoading" :head-height="80" @refresh="findBetRecord" v-show="!loading">
      <van-cell size="large" :title="(distance.aTeamName || 'A队') + ' vs ' + (distance.bTeamName || 'B队')" :value="new Date(distance.time).format('yyyy-MM-dd hh:mm:ss')" />
      <van-row class="bet-list_header">
        <van-col span="8">押注</van-col>
        <van-col span="16">金额</van-col>
      </van-row>
      <van-row>
        <van-col span="8">{{ data.teamAName }}</van-col>
        <van-col span="16">{{ data.teamAAmount }}</van-col>
      </van-row>
      <van-row>
        <van-col span="8">{{ data.teamBName }}</van-col>
        <van-col span="16">{{ data.teamBAmount }}</van-col>
      </van-row>
      <van-row>
        <van-col span="8">平局</van-col>
        <van-col span="16">{{ data.teamPAmount }}</van-col>
      </van-row>
      <van-row>
        <van-col span="8">总计</van-col>
        <van-col span="16">{{ data.teamPSum }}</van-col>
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
          this.findBetRecord()
        }
      }
    }
  },
  data() {
    return {
      loading: true, // 骨架屏加载
      refreshLoading: false,
      data: {}
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    findBetRecord() {
      findBetRecordByDistance({
        gameId: this.distance.id,
        walletAddress: this.address
      }).then((res) => {
        this.data = res
        this.refreshLoading = false
        this.loading = false
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
    padding: 10px 15px;
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
