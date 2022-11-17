<template>
  <div class="bet-view">
    <van-nav-bar title="投注记录" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-skeleton title :row="10" :loading="loading" />
    <van-pull-refresh v-model="refreshLoading" :head-height="80" @refresh="findBetRecord" v-show="!loading">
      <van-cell size="large" :title="(distance.aTeamName || 'A队') + ' vs ' + (distance.bTeamName || 'B队')" :value="new Date(distance.time).format('yyyy-MM-dd hh:mm:ss')" />
      <van-row class="bet-list_header">
        <van-col span="8">我的押注</van-col>
        <van-col span="16">我的金额</van-col>
      </van-row>
      <van-row>
        <van-col span="8">{{ data.teamAName || 'A队' }}</van-col>
        <van-col span="16">{{ data.teamAAmount }}</van-col>
      </van-row>
      <van-row>
        <van-col span="8">{{ data.teamBName || 'B队' }}</van-col>
        <van-col span="16">{{ data.teamBAmount }}</van-col>
      </van-row>
      <van-row>
        <van-col span="8">平局</van-col>
        <van-col span="16">{{ data.teamPAmount }}</van-col>
      </van-row>
      <van-row class="bet-view_percent">
        <van-col span="8">
          <van-circle :current-rate="teamAPercent" :rate="100" :speed="100" layer-color="#eeeeee" color="#1989fa">
            <span>{{ teamAPercent.toFixed(2) }}%</span>
            <br />
            <span>{{ data.teamAName || 'A队' }}</span>
          </van-circle>
          <div>{{ data.teamASum }}</div>
        </van-col>
        <van-col span="8">
          <van-circle :current-rate="teamCPercent" :rate="100" :speed="100" layer-color="#eeeeee" color="#67C23A">
            <span>{{ teamCPercent.toFixed(2) }}%</span>
            <br />
            <span>平局</span>
          </van-circle>
          <div>{{ data.teamPSum }}</div>
        </van-col>
        <van-col span="8">
          <van-circle :current-rate="teamBPercent" :rate="100" :speed="100" layer-color="#eeeeee" color="#F56C6C">
            <span>{{ teamBPercent.toFixed(2) }}%</span>
            <br />
            <span>{{ data.teamBName || 'B队' }}</span>
          </van-circle>
          <div>{{ data.teamBSum }}</div>
        </van-col>
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
      data: {},
      teamAPercent: 0,
      teamBPercent: 0,
      teamCPercent: 0
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
        const teamSum = Number(res.teamASum) + Number(res.teamBSum) + Number(res.teamPSum)
        if (teamSum === 0) {
          this.teamAPercent = 0
          this.teamBPercent = 0
          this.teamCPercent = 0
        } else {
          this.teamAPercent = (Number(res.teamASum) / teamSum) * 100
          this.teamBPercent = (Number(res.teamBSum) / teamSum) * 100
          this.teamCPercent = (Number(res.teamPSum) / teamSum) * 100
        }
      })
    }
  }
}
</script>
<style lang="less">
.bet-view {
  flex: 1;
  .van-circle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
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
  .bet-view_percent {
    .van-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      > div {
        margin-top: 20px;
      }
    }
  }
}
@media screen and (min-width: 450px) {
  .bet-view,
  .keep-px {
    min-width: 450px;
    max-width: 575px;
    flex: 1;
    .bet-list_header {
      height: 40px;
      background-color: #ffffff;
    }
    .van-row {
      padding: 10px 15px;
      font-size: 12px;
    }
    .bet-view_percent {
      .van-col {
        > div {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
