<template>
  <div class="list-comp">
    <van-cell title="竞猜记录" />
    <van-list :offset="40" v-model:loading="listLoading" :finished="finished" @load="onLoad">
      <van-row v-for="(item, index) in data" :key="index">
        {{ item }}
      </van-row>
    </van-list>
  </div>
</template>

<script>
import { findBetRecordByDistance } from '@/server/http/api'

export default {
  name: 'ListComp',
  data() {
    return {
      refreshLoading: false,
      listLoading: false,
      finished: false,
      pageNo: 0,
      pageSize: 10,
      data: []
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
      findBetRecordByDistance({
        walletAddress: this.address,
        pageSize: this.pageSize,
        pageNo: this.pageNo
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
.list-comp {
  width: 345px;
  margin: 15px auto auto;
}
</style>
