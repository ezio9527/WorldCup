<template>
  <div class="progress-view">
    <van-pull-refresh v-model="refreshLoading" :head-height="80" @refresh="onRefresh">
      <van-list :offset="40" v-model:loading="listLoading" :finished="finished" @load="onLoad">
        <div v-for="(item, index) in filterData" :key="index" class="all-item_wrapper">
          <div class="item-wrapper_time">
            <span>{{ new Date(item.startTime).format('yyyy-MM-dd hh:mm:ss') }}</span>
            <van-icon name="records" @click="goBettingRecord(item)" />
          </div>
          <div class="item-wrapper_team">
            <div>
              <van-image :src="baseUrl + item.teamAImageUrl" fit="contain" />
              <span>{{ item.teamAName || 'A队' }}</span>
            </div>
            <img src="@img/vs.png" />
            <div>
              <van-image :src="baseUrl + item.teamBImageUrl" fit="contain" />
              <span>{{ item.teamBName || 'B队' }}</span>
            </div>
          </div>
          <div class="item-wrapper_operation">
            <div>
              <span>1:{{ item.aodds }}</span>
              <van-button size="small" type="primary" @click="betting()">
                <template #icon>
                  <img src="@img/cup.png" />
                </template>
                {{ item.teamAName || 'A队' }}胜
              </van-button>
            </div>
            <div>
              <span>1:{{ item.codds }}</span>
              <van-button size="small" type="primary" @click="betting()">平局</van-button>
            </div>
            <div>
              <span>1:{{ item.bodds }}</span>
              <van-button size="small" type="primary" @click="betting()">
                <template #icon>
                  <img src="@img/cup.png" />
                </template>
                {{ item.teamBName || 'B队' }}胜
              </van-button>
            </div>
          </div>
        </div>
      </van-list>
      <van-empty description="没有更多了" v-show="!refreshLoading && !listLoading && filterData.length === 0" />
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { findDistanceAll } from '@/server/http/api'
export default {
  name: 'AllView',
  computed: {
    ...mapGetters({
      baseUrl: 'imageBaseUrl/getUrl'
    }),
    filterData() {
      return this.data.filter((item) => {
        return +new Date(item.startTime) - +new Date() < 1800000
      })
    }
  },
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
    betting() {
      this.$toast('已停止下注')
    },
    onRefresh() {
      this.pageNo = 1
      this.findMatch()
    },
    onLoad() {
      this.pageNo += 1
      this.findMatch()
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
