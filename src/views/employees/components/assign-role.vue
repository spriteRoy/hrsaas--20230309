<template>
  <el-dialog title="分配角色" :visible="showRoleDialog">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import {getUserDetailById} from '@/api/user'  
export default {
  data () {
    return {
      list:[], //  负责存储当前所有的角色id
      roleIds:[], // 负责存储当前用户所拥有的角色id
    }
  },
  created () {
    // 获取所有的角色
    this.getRoleList()
  },
  methods: {
    async getRoleList(){
      const {rows} =  await getRoleList({page:1,pagesize:20})
      this.list = rows
    },
    
    // 这个方法是什么时候调用？props传值是异步的 所以这里不能用this.userId
    // 这个方法是给父组件调用的
    async getUserDetailById(id){
      const {roleIds} = await getUserDetailById(id) // 将用户所拥有的角色赋值给当前用户的对象
      this.roleIds = roleIds
    }
  },
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  }
}
</script>

