<template>
  <div class="home-view_header">
    <div class="home-header_title">
      <p>2022卡塔尔世界杯</p>
      <p>11月20日-12月18日</p>
    </div>
    <img class="home-header_cup" src="@img/fifa_world_cup.png" />
  </div>
</template>

<script>
export default {
  name: 'BannerCom'
}
</script>

<style lang="less" scoped>
.home-view_header {
  width: 100%;
  height: 90px;
  background: url('../../assets/images/bg.jpeg') no-repeat right bottom;
  background-size: cover;
  background-origin: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 23px 17px;
  .home-header_title {
    color: #ffffff;
    > p:first-child {
      font-size: 22px;
      margin-bottom: 5px;
    }
    > p:last-child {
      font-size: 14px;
    }
  }
  .home-header_cup {
    width: 59px;
    height: 59px;
  }
}
@media screen and (min-width: 576px) {
  .home-view_header,
  .keep-px {
    width: 100%;
    height: 140px;
    padding: 35px 26px;
    .home-header_title {
      > p:first-child {
        font-size: 34px;
        margin-bottom: 8px;
      }
      > p:last-child {
        font-size: 22px;
      }
    }
    .home-header_cup {
      width: 91px;
      height: 91px;
    }
  }
}
</style>
