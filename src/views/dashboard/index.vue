<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <PageTools :showBefore="true" >
      <span slot="before" >想见你</span>
      <!-- <el-button slot="after">导入excel</el-button> -->
      <template v-slot:after>
        <el-button>导入</el-button>
      </template>
    </PageTools>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  
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
