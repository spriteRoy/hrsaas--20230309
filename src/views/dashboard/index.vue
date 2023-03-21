<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <PageTools>
      <span slot="before" :showBefore="true">想见你</span>
      <el-button slot="after">导入excel</el-button>
    </PageTools>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageTools from '@/components/PageTools/index.vue'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: {
    PageTools
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
