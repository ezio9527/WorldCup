<template>
  <div class="betting-comp" :class="{ hidden: !visible }">
    <p class="betting-comp_title">{{ ['平局', data.teamAName + ' 胜', data.teamBName + ' 胜'][win] }}</p>
    <div class="betting-comp_input">
      <van-field v-model="number" type="number" size="mini" label="下注金额" />
      <van-field v-model="balance" type="number" size="mini" :label="config.contract.Token.symbol + '余额'" disabled />
      <van-slider v-model="percent" @update:model-value="onChange" max="100" active-color="#e3a715">
        <template #button>
          <div class="betting-input_percent">{{ percent }}%</div>
        </template>
      </van-slider>
    </div>
    <div class="betting-comp_button">
      <van-button color="#67C23A" type="primary" @click="close" size="small">收起</van-button>
      <van-button color="#F56C6C" type="primary" @click="onSubmit" size="small" :disabled="disabled" v-if="allowance">下注</van-button>
      <van-button color="#F56C6C" type="primary" @click="approve" size="small" v-else>授权</van-button>
    </div>
    <van-overlay :show="loading">
      <van-loading type="spinner" />
    </van-overlay>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from '@/assets/data/config'
export default {
  name: 'BettingComp',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    win: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => ({
        title: '',
        content: ''
      })
    }
  },
  data() {
    return {
      config,
      loading: false,
      percent: 0, // 下注金额百分比
      number: 0 // 下注金额
    }
  },
  computed: {
    ...mapGetters({
      balance: 'contract/getTokenBalance',
      projectContract: 'contract/getProjectContract',
      ercContract: 'contract/getErcContract',
      allowance: 'contract/getAllowance'
    }),
    disabled() {
      const _number = Number(this.number)
      return isNaN(_number) || _number <= 0 || _number > Number(this.balance)
    }
  },
  watch: {
    visible(val) {
      this.show = val
    }
  },
  methods: {
    approve() {
      this.loading = true
      const address = config.contract.Project.address
      const number = 999999999999999
      this.ercContract
        .approve(address, number)
        .then(() => {
          this.$store.commit('contract/setAllowance', true)
        })
        .catch(() => {
          this.$store.commit('contract/setAllowance', false)
        })
        .finally(() => {
          this.loading = false
        })
    },
    onChange(value) {
      this.number = (this.balance * (value / 100)).toString()
    },
    close() {
      this.$emit('update:visible', false)
    },
    onSubmit() {
      this.loading = true
      this.projectContract
        .betting({
          id: this.data.gameId,
          result: this.win,
          number: this.number
        })
        .then(() => {
          // this.$store.commit('contract/setAllowance', true)
        })
        .catch(() => {
          // this.$store.commit('contract/setAllowance', false)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style>
.van-overlay {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
<style lang="less" scoped>
.betting-comp {
  position: relative;
  display: flex;
  flex-direction: column !important;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 20px;
  transition: all 200ms;
  &.hidden {
    height: 0;
    padding: 0;
  }
  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    margin: auto;
    width: 90%;
    height: 1px;
    background: #ffffff;
    transform: scaleY(0.1);
  }
  .betting-comp_title {
    font-size: 22px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 10px;
    text-align: center;
  }
  .betting-comp_input {
    width: 100%;
    .van-field {
    }
    .van-slider {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .betting-input_percent {
      width: 40px;
      height: 20px;
      line-height: 20px;
      color: #fff;
      font-size: 10px;
      text-align: center;
      background-color: #e3a715;
      border-radius: 100px;
    }
  }
  .betting-comp_button {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .van-button {
      width: 40%;
    }
  }
}

@media screen and (min-width: 576px) {
  .betting-comp,
  .keep-px {
    padding: 30px;
    .betting-comp_title {
      font-size: 34px;
      margin-bottom: 15px;
    }
    .betting-comp_input {
      .van-slider {
        margin-top: 30px;
        margin-bottom: 30px;
      }
      .betting-input_percent {
        width: 60px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        border-radius: 100px;
      }
    }
  }
}
</style>
