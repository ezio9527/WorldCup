<template>
  <div class="list-comp">
    <van-cell title="竞猜记录" />
    <van-list :offset="40" v-model:loading="listLoading" :finished="finished" @load="onLoad">
      <van-collapse v-model="t">
        <van-collapse-item :name="index" v-for="(item, index) in data" :key="index">
          <template #title>
            <van-badge color="#F56C6C" :content="Number(item.result) === 1 ? '胜' : ''">
              <span>{{ item.teamAName || 'A队' }}</span>
            </van-badge>
            <span v-if="Number(item.result) === 0" class="list-comp_vs list-comp_tie">平局</span>
            <span class="list-comp_vs" v-else>vs</span>
            <van-badge color="#F56C6C" :content="Number(item.result) === 2 ? '胜' : ''">
              <span>{{ item.teamBName || 'B队' }}</span>
            </van-badge>
          </template>
          <template #value>
            <van-tag color="#F56C6C" v-if="Number(item.betResult) === Number(item.result)">中</van-tag>
            <span>{{ '下注:' + ['平局', (item.teamAName || 'A队') + '胜', (item.teamBName || 'B队') + '胜'][Number(item.betResult)] }}</span>
          </template>
          <van-row>
            <van-col span="8">比赛时间</van-col>
            <van-col span="16">{{ new Date(item.sysTime * 1000).format('yyyy-MM-dd hh:mm:ss') }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">下注时间</van-col>
            <van-col span="16">{{ new Date(item.betDate).format('yyyy-MM-dd hh:mm:ss') }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">{{ item.teamAName || 'A队' }}胜 1:{{ item.aodds }}</van-col>
            <van-col span="8">平局 1:{{ item.codds }}</van-col>
            <van-col span="8">{{ item.teamBName || 'B队' }}胜 1:{{ item.bodds }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">赛果:{{ ['平局', (item.teamAName || 'A队') + '胜', (item.teamBName || 'B队') + '胜'][Number(item.result)] }}</van-col>
            <van-col span="12">金额:{{ item.amount }}</van-col>
          </van-row>
        </van-collapse-item>
      </van-collapse>
    </van-list>
  </div>
</template>

<script>
import { findBetRecordAll } from '@/server/http/api'
import { mapGetters } from 'vuex'

export default {
  name: 'ListComp',
  data() {
    return {
      t: [],
      refreshLoading: false,
      listLoading: false,
      finished: false,
      pageNo: 0,
      pageSize: 10,
      data: []
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
  methods: {
    onRefresh() {
      this.pageNo = 1
      this.findBetRecord()
    },
    onLoad() {
      this.pageNo += 1
      this.findBetRecord()
    },
    findBetRecord() {
      findBetRecordAll({
        walletAddress: this.address,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }).then((res) => {
        if (this.pageNo === 1) {
          this.data = Array.from(res).reverse()
        } else {
          this.data = this.data.concat(Array.from(res).reverse() || [])
        }
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
.list-comp {
  width: 345px;
  margin: 15px auto auto;
  .list-comp_vs {
    margin-left: 10px;
    margin-right: 10px;
  }
  .list-comp_vs.list-comp_tie {
    display: inline-block;
    background-color: #67c23a;
    color: white;
    font-size: 12px;
    border-radius: 1000px;
    padding: 4px;
    transform: scale(0.6);
  }
}

@media screen and (min-width: 576px) {
  .list-comp,
  .keep-px {
    width: 530px;
    margin: 24px auto auto;
    .list-comp_vs {
      margin-left: 15px;
      margin-right: 15px;
    }
    .list-comp_vs.list-comp_tie {
      font-size: 12px;
      border-radius: 1000px;
      padding: 4px;
      transform: scale(0.6);
    }
  }
}
</style>
