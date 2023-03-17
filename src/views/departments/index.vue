<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <treeTools :tree-node="company" :is-root="true" ></treeTools>
        <el-tree default-expand-all :data="departs" :props="defaultProps">
          <!-- 通过slot-scope属性接受el-tree传递给el-row的数据 -->
          <!-- https://v2.cn.vuejs.org/v2/guide/components-slots.html#%E7%8B%AC%E5%8D%A0%E9%BB%98%E8%AE%A4%E6%8F%92%E6%A7%BD%E7%9A%84%E7%BC%A9%E5%86%99%E8%AF%AD%E6%B3%95 -->
          <!-- 当被提供的内容只有默认插槽时，组件的标签才可以被当作插槽的模板来使用。这样我们就可以把 v-slot 直接用在组件上： -->
          <!-- <el-row slot-scope="{ node,data }" type="flex" justify="space-between" align="middle" style="height:40px;width:100%">
          <el-col><span>{{ node.label }} - {{ data }}</span></el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <el-col>负责人</el-col>
              <el-col>
                <el-dropdown>
                  <span>操作<i class="el-icon-arrow-down"></i></span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                    <el-dropdown-item>编辑部门</el-dropdown-item>
                    <el-dropdown-item>删除部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row> -->
          <treeTools slot-scope="{ data }" :tree-node="data"></treeTools>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import treeTools from "./components/tree-tools";
import { getDepartments } from '@/api/departments'
export default {
  data() {
    return {
      defaultProps: {
        label: "name",
      },
      company: {},
      departs:[],
    };
  },
  components: {
    treeTools,
  },
  created () {
    this.getDepartments()
  },
  methods: {
    async getDepartments(){
      const result = await getDepartments()
      console.log(result);
      this.company = {name:result.companyName,manager:"负责人"}
      this.departs = result.depts
    }
  }
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
