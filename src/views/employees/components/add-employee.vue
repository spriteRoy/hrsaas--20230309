<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input
          style="width: 50%"
          placeholder="请输入姓名"
          v-model="formData.username"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          style="width: 50%"
          placeholder="请输入手机号"
          v-model="formData.mobile"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          style="width: 50%"
          placeholder="请选择入职时间"
          v-model="formData.timeOfEntry"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          style="width: 50%"
          placeholder="请选择"
          v-model="formData.formOfEmployment"
        >
            <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          style="width: 50%"
          placeholder="请输入工号"
          v-model="formData.workNumber"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          style="width: 50%"
          placeholder="请选择部门"
          v-model="formData.departmentName"
          @focus="getDepartments"
        />
        <!-- 放置一个树形组件 -->
        <el-tree v-loading="loading" v-if="showTree" :data="treeData" :props="{ label:'name' }" default-expand-all @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          style="width: 50%"
          placeholder="请选择转正时间"
          v-model="formData.correctionTime"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small"  @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import {getDepartments} from '@/api/departments'
import {tranListToTreeData} from '@/utils/index'
import {addEmployee} from '@/api/employees'
// 引入员工的枚举对象
// 组件模板中的数据只能来源于data、props和计算属性
import EmployeeEnum from "@/api/constant/employees";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        // 为什么要设置为change呢？
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
      treeData:[],
      showTree:false,// 默认不显示树形组件
      loading:false, // 加上进度条
      EmployeeEnum
    };
  },
  methods: {
    async getDepartments(){
        this.loading = true
        this.showTree = true
       const {depts} =  await getDepartments()
       // 将depts转化为树形
       this.treeData =  tranListToTreeData(depts,'')
       this.loading = false
    },
    selectNode(node){
        this.formData.departmentName = node.name
        this.showTree = false
    },
    async btnOK(){
      try {
        await this.$refs.addEmployee.validate()
        await addEmployee(this.formData) // 调用新增接口
        // this.$parent:父组件实例
        this.$parent.getEmployeeList && this.$parent.getEmployeeList()
        this.$parent.showDialog = false
        // 这里不用写重置，因为关闭弹层，触发了close事件
      } catch (error) {
        console.log(error);
      }
    },
    btnCancel(){
      this.formData = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      }
      this.$refs.addEmployee.resetFields() 
      // update:props名称 这么写的话 可以在父组件 直接用sync修饰符处理
      this.$emit('update:showDialog',false)
    }
  }
};
</script>

<style>
</style>
