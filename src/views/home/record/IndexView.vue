<template>
  <div class="record-view">
    <award-comp></award-comp>
    <list-comp></list-comp>
  </div>
</template>

<script>
import AwardComp from '@views/home/record/AwardComp.vue'
import ListComp from '@views/home/record/ListComp.vue'
export default {
  name: 'RecordView',
  components: {
    AwardComp,
    ListComp
  }
}
</script>

<style lang="less" scoped>
.record-view {
  flex: 1;
  background-color: #f6f6f6;
}
</style>
