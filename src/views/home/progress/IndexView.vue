<template>
  <div class="progress-view">
    <div class="progress-view_balance">
      <van-cell-group inset>
        <van-cell>
          <template #title>
            <span>钱包USDT余额</span>
          </template>
          <template #label>
            <span class="line-word-hidden">{{ usdt }}</span>
          </template>
        </van-cell>
        <van-cell>
          <template #title>
            <span>托管账户USDT余额</span>
          </template>
          <template #label>
            <span class="line-word-hidden">{{ usdtForTrusteeship }}</span>
          </template>
        </van-cell>
        <van-cell>
          <template #title>
            <span>冻结资金</span>
          </template>
          <template #label>
            <span class="line-word-hidden">{{ usdtForFreeze }}</span>
          </template>
        </van-cell>
        <van-field v-model="depositVal" placeholder="充值到托管账户">
          <template v-if="usdtAllowance" #button>
            <van-button size="small" type="primary" @click="deposit" :disabled="depositDisabled">充币</van-button>
          </template>
          <template v-else #button>
            <van-button size="small" type="primary" @click="approveUSDT">授权USDT</van-button>
          </template>
        </van-field>
        <van-field v-model="trusteeshipVal" placeholder="托管到合约">
          <template v-if="usdtAllowance" #button>
            <van-button size="small" type="primary" @click="trusteeship" :disabled="trusteeshipDisabled">托管</van-button>
          </template>
          <template v-else #button>
            <van-button size="small" type="primary" @click="approveUSDT">授权USDT</van-button>
          </template>
        </van-field>
        <van-field v-model="transferVal" placeholder="划转到余额账户">
          <template v-if="usdtAllowance" #button>
            <van-button size="small" type="primary" @click="transfer" :disabled="transferDisabled">划转</van-button>
          </template>
          <template v-else #button>
            <van-button size="small" type="primary" @click="approveUSDT">授权USDT</van-button>
          </template>
        </van-field>
      </van-cell-group>
    </div>
    <van-overlay :show="loading">
      <van-loading type="spinner" />
    </van-overlay>
    <!--<van-pull-refresh v-model="refreshLoading" :head-height="80" @refresh="onRefresh">-->
    <!--  <van-list :offset="40" v-model:loading="listLoading" :finished="finished" @load="onLoad">-->
    <!--    <div v-for="(item, index) in filterData" :key="index" class="all-item_wrapper">-->
    <!--      <div class="item-wrapper_time">-->
    <!--        <span>{{ new Date(item.startTime).format('yyyy-MM-dd hh:mm:ss') }}</span>-->
    <!--        <van-icon name="records" @click="goBettingRecord(item)" />-->
    <!--      </div>-->
    <!--      <div class="item-wrapper_team">-->
    <!--        <div>-->
    <!--          <van-image :src="baseUrl + item.teamAImageUrl" fit="contain" lazy-load />-->
    <!--          <span>{{ item.teamAName || 'A队' }}</span>-->
    <!--        </div>-->
    <!--        <img src="@img/vs.png" />-->
    <!--        <div>-->
    <!--          <van-image :src="baseUrl + item.teamBImageUrl" fit="contain" lazy-load />-->
    <!--          <span>{{ item.teamBName || 'B队' }}</span>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="item-wrapper_operation">-->
    <!--        <div>-->
    <!--          <span>1:{{ item.aodds }}</span>-->
    <!--          <van-button size="small" type="primary" @click="betting()">-->
    <!--            <template #icon>-->
    <!--              <img src="@img/cup.png" />-->
    <!--            </template>-->
    <!--            {{ item.teamAName || 'A队' }}胜-->
    <!--          </van-button>-->
    <!--        </div>-->
    <!--        <div>-->
    <!--          <span>1:{{ item.codds }}</span>-->
    <!--          <van-button size="small" type="primary" @click="betting()">平局</van-button>-->
    <!--        </div>-->
    <!--        <div>-->
    <!--          <span>1:{{ item.bodds }}</span>-->
    <!--          <van-button size="small" type="primary" @click="betting()">-->
    <!--            <template #icon>-->
    <!--              <img src="@img/cup.png" />-->
    <!--            </template>-->
    <!--            {{ item.teamBName || 'B队' }}胜-->
    <!--          </van-button>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--  </van-list>-->
    <!--  <van-empty description="没有更多了" v-show="!refreshLoading && !listLoading && filterData.length === 0" />-->
    <!--</van-pull-refresh>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { findDistanceAll } from '@/server/http/api'
import config from '@data/config'
// import ProjectContract from '@/server/contract/ProjectContract'
export default {
  name: 'AllView',
  computed: {
    ...mapGetters({
      usdtForFreeze: 'contract/getUsdtForFreeze',
      usdt: 'contract/getUsdt',
      usdtAllowance: 'contract/getUsdtAllowance',
      usdtForTrusteeship: 'contract/getUsdtForTrusteeship',
      projectContract: 'contract/getProjectContract',
      usdtContract: 'contract/getUsdtContract'
    }),
    filterData() {
      return this.data.filter((item) => {
        return +new Date(item.startTime) - +new Date() < 1800000
      })
    },
    depositDisabled() {
      const _number = Number(this.depositVal)
      return isNaN(_number) || _number <= 0 || _number > Number(this.usdt)
    },
    trusteeshipDisabled() {
      const _number = Number(this.trusteeshipVal)
      return isNaN(_number) || _number <= 0 || _number > Number(this.usdtForTrusteeship)
    },
    transferDisabled() {
      const _number = Number(this.transferVal)
      return isNaN(_number) || _number <= 0 || _number > Number(this.usdtForTrusteeship)
    }
  },
  data() {
    return {
      loading: false,
      depositVal: '',
      trusteeshipVal: '',
      transferVal: '',
      refreshLoading: false,
      listLoading: false,
      finished: true,
      pageNo: 0,
      pageSize: 10,
      data: []
    }
  },
  methods: {
    // 授权
    approveUSDT() {
      this.loading = true
      const address = config.contract.Project.address
      const number = 999999999999999
      this.usdtContract
        .approve(address, number)
        .then(() => {
          this.$store.commit('contract/setUsdtAllowance', true)
        })
        .catch(() => {
          this.$store.commit('contract/setUsdtAllowance', false)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 充值
    deposit() {
      this.loading = true
      this.projectContract.deposit(this.depositVal).finally(() => {
        this.loading = false
        this.depositVal = ''
      })
    },
    // 托管
    trusteeship() {
      this.loading = true
      this.projectContract.trusteeship(this.trusteeshipVal).finally(() => {
        this.loading = false
        this.trusteeshipVal = ''
      })
    },
    // 划转
    transfer() {
      this.loading = true
      this.projectContract
        .transfer({
          type: 1,
          number: Number(this.transferVal)
        })
        .finally(() => {
          this.loading = false
          this.transferVal = ''
        })
    },
    betting() {
      this.$toast('已停止下注')
    },
    onRefresh() {
      this.pageNo = 1
      // this.findMatch()
    },
    onLoad() {
      this.pageNo += 1
      // this.findMatch()
    },
    findMatch() {
      findDistanceAll({
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }).then((res) => {
        if (this.pageNo === 1) {
          this.data = res
        } else {
          this.data = this.data.concat(res || [])
        }
        this.refreshLoading = false
        this.listLoading = false
        if (res.length < this.pageSize) {
          this.finished = true
        } else {
          this.finished = false
        }
      })
    },
    goBettingRecord(distance) {
      this.$router.push({
        name: 'bet',
        query: {
          id: distance.gameId.toString(),
          a: distance.teamAName,
          b: distance.teamBName,
          t: distance.startTime
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.progress-view {
  flex: 1;
  overflow: scroll;
  background-color: #f6f6f6;
  .progress-view_balance {
    margin-top: 20px;
  }
  .van-list:after {
    content: '';
    display: block;
    height: 50px;
  }
  .all-item_wrapper {
    width: 345px;
    margin: 15px auto auto;
    border-radius: 6px;
    background: linear-gradient(to bottom right, #1678f2, #1678f2);
    overflow: hidden;
    > div {
      width: 100%;
      display: flex;
      flex-direction: row;
    }
    .item-wrapper_time {
      position: relative;
      justify-content: space-between;
      padding: 15px;
      color: #ffffff;
      .van-icon {
        font-size: 20px;
        cursor: pointer;
      }
      &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 90%;
        height: 1px;
        background: #ffffff;
        transform: scaleY(0.1);
      }
    }
    .item-wrapper_team {
      margin-top: 20px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        .van-image {
          width: 60px;
          min-height: 40px;
          margin-bottom: 15px;
        }
        span {
          color: #ffffff;
        }
      }
      > img {
        align-self: center;
        width: 26px;
        height: 19px;
      }
    }
    .item-wrapper_operation {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        span {
          color: #ffffff;
          margin-bottom: 10px;
        }
        .van-button {
          img {
            width: 22px;
          }
        }
      }
    }
  }

  .van-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media screen and (min-width: 576px) {
  .progress-view,
  .keep-px {
    .van-list:after {
      height: 50px;
    }
    .all-item_wrapper {
      width: 530px;
      margin: 24px auto auto;
      border-radius: 12px;
      .item-wrapper_time {
        padding: 23px;
        .van-icon {
          font-size: 30px;
        }
      }
      .item-wrapper_team {
        margin-top: 30px;
        margin-bottom: 30px;
        > div {
          img,
          .van-image {
            width: 92px;
            margin-bottom: 23px;
          }
        }
        > img {
          width: 40px;
          height: 30px;
        }
      }
      .item-wrapper_operation {
        margin-bottom: 30px;
        > div {
          span {
            margin-bottom: 15px;
          }
          .van-button {
            img {
              width: 28px;
            }
          }
        }
      }
    }
  }
}
</style>
