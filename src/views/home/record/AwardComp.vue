<template>
  <div class="award-comp">
    <div class="record-award_header">
      <van-icon name="point-gift" />
      <span>中奖金额</span>
    </div>
    <div class="record-award_content">
      <div>
        <img src="@img/nuwapay.png" />
        <span>nuwapay</span>
      </div>
      <div>
        <span>2000123</span>
        <van-button size="small" type="primary" icon="share" color="rgb(187, 65, 186)" @click="onSubmit">提取</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AwardComp',
  computed: {
    ...mapGetters({
      projectContract: 'contract/getProjectContract',
      income: 'contract/getIncome'
    }),
    disabled() {
      const _number = Number(this.number)
      return isNaN(_number) || _number <= 0 || _number > Number(this.balance)
    }
  },
  methods: {
    onSubmit() {
      this.projectContract.pickup().then(() => {
        console.log('收益提取成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.award-comp {
  width: 345px;
  margin: 15px auto auto;
  border-radius: 6px;
  background: linear-gradient(133deg, #d6a24a 0%, #c843ba 22%, #2435c0 100%);
  overflow: hidden;
  > div {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
  .record-award_header {
    align-items: center;
    position: relative;
    padding: 15px;
    color: #ffffff;
    .van-icon {
      font-size: 26px;
      color: #f5cf41;
      margin-right: 10px;
    }
    :after {
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
  .record-award_content {
    flex-direction: column;
    padding: 15px;
    > div {
      display: flex;
      align-items: center;
    }
    > div:first-child {
      img {
        width: 40px;
        margin-right: 20px;
      }
      span {
        color: #ffffff;
        font-size: 16px;
      }
    }
    > div:last-child {
      margin-top: 20px;
      justify-content: space-between;
      span {
        margin-left: 4px;
        color: #f5cf41;
        font-weight: 600;
        font-size: 26px;
      }
    }
  }
}

@media screen and (min-width: 576px) {
  .award-comp,
  .keep-px {
    width: 530px;
    margin: 23px auto auto;
    border-radius: 12px;
    .record-award_header {
      padding: 23px;
      .van-icon {
        font-size: 40px;
        margin-right: 15px;
      }
    }
    .record-award_content {
      padding: 23px;
      > div:first-child {
        img {
          width: 62px;
          margin-right: 30px;
        }
        span {
          font-size: 24px;
        }
      }
      > div:last-child {
        margin-top: 30px;
        span {
          margin-left: 6px;
          font-size: 40px;
        }
      }
    }
  }
}
</style>
