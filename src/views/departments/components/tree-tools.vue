<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col><span>{{ treeNode.name }}</span></el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>操作<i class="el-icon-arrow-down"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- 编辑部门和删除部门只会在子节点上显示 -->
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    // 定义传入的属性
    treeNode: {
      type: Object, // 对象类型
      required: true, // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 给下拉菜单注册的点击事件
    operateDepts(type){
      if (type === 'add') {
        // 添加子部门的操作
        // 添加子部门，在当前点击的部门下添加子部门 => this.treeNode就是当前点击的部门
        this.$emit('addDepts',this.treeNode) // 触发自定义事件，告诉父组件显示弹层
      }else if (type === 'edit') {
        // 编辑部门的操作
        
      } else {
        // 删除操作
        this.$confirm('您确定删除该组织部门吗').then(() => {
          return delDepartments(this.treeNode.id) // 返回promise对象
        }).then(() => {
          // 如果删除成功了，就会进入这里
          // 通过自定义事件抛出一个事件，让父组件监听这个事件
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
};
</script>

<style>
</style>