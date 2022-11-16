<template>
  <van-swipe class="banner-comp" :autoplay="3000" indicator-color="white">
    <template v-if="data.length > 0">
      <van-swipe-item v-for="(item, index) in data" :key="index">
        <div class="banner-comp_header">
          <div class="banner-header_title">
            <p>{{ item.title }}</p>
            <p>{{ new Date(item.startTime).format('yyyy年MM月dd日') }}-{{ new Date(item.endTime).format('yyyy年MM月dd日') }}</p>
          </div>
          <van-image class="banner-header_logo" :src="baseUrl + item.imageUrl" fit="contain" lazy-load />
          <van-image class="banner-header_background" :src="baseUrl + item.backImage" fit="fill" lazy-load />
        </div>
      </van-swipe-item>
    </template>
    <template v-else>
      <van-swipe-item>
        <div class="banner-comp_header">
          <div class="banner-header_title">
            <p>有奖竞猜</p>
            <p>1月1日-12月31日</p>
          </div>
          <img class="banner-header_logo" src="@img/match_logo.png" />
          <img class="banner-header_background" src="@img/bg.jpeg" />
        </div>
      </van-swipe-item>
    </template>
  </van-swipe>
</template>

<script>
import { findMatchAll } from '@/server/http/api'
import { mapGetters } from 'vuex'
export default {
  name: 'BannerComp',
  data() {
    return {
      data: []
    }
  },
  computed: {
    ...mapGetters({
      baseUrl: 'imageBaseUrl/getUrl'
    })
  },
  created() {
    this.findMatchAll()
  },
  methods: {
    findMatchAll() {
      findMatchAll({
        pageSize: 1000,
        pageNo: 1
      }).then((data) => {
        this.data = data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.banner-comp {
  .banner-comp_header {
    position: relative;
    height: 90px;
    //background: url('../../assets/images/bg.jpeg') no-repeat right bottom;
    background-size: cover;
    background-origin: border-box;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding: 23px 17px;
    .banner-header_title {
      color: #ffffff;
      > p:first-child {
        font-size: 22px;
        margin-bottom: 5px;
      }
      > p:last-child {
        font-size: 14px;
      }
    }
    .banner-header_logo {
      width: 59px;
      height: 59px;
    }
    .banner-header_background {
      z-index: -1;
      position: absolute;
      width: 100%;
      height: 90px;
      top: 0;
      left: 0;
    }
  }
}
@media screen and (min-width: 576px) {
  .banner-comp,
  .keep-px {
    .banner-comp_header {
      width: 100%;
      height: 140px;
      padding: 35px 26px;
      .banner-header_title {
        > p:first-child {
          font-size: 34px;
          margin-bottom: 8px;
        }
        > p:last-child {
          font-size: 22px;
        }
      }
      .banner-header_logo {
        width: 91px;
        height: 91px;
      }
      .banner-header_background {
        position: absolute;
        width: 575px;
        height: 138px;
        top: 0;
        left: 0;
      }
    }
  }
}
</style>
