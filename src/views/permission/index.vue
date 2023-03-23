<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <!-- id为对象的唯一标识 -->
      <el-table :data="list" border="" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template  slot-scope="{ row }">
            <el-button v-if="row.type === 1" type="text">添加</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getPermissionList } from "@/api/permission";
// 注意：tranListToTreeData而不是transListToTreeData
import { tranListToTreeData } from "@/utils/index";
export default {
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getPermissionList();
  },
  methods: {
   async getPermissionList() {
      // 将数据转化成了 带chilren的树形结构
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
  },
};
</script>
