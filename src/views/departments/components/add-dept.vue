<template>
  <el-dialog title="新增部门" :visible="showDialog"  @close="btnCancel">
    <!-- 表单数据 -->
    <!-- 问题：
            1.为什么 model 属性前面不加冒号会报错
            https://blog.csdn.net/weixin_43413645/article/details/124280038
            2.为什么 rules 属性前面加冒号才生效
     -->
    <el-form  ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.name"
        />
      </el-form-item>
      <!-- 对比“部门编码”和“部门负责人”与其他输入款的宽度 -->
      <el-form-item label="部门编码" prop="code">
        <el-input placeholder="1-50个字符" v-model="formData.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select placeholder="请选择" v-model="formData.manager" @focus="getEmployeeSimple">
           <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <!-- 将type设置为textarea，可设置rows属性 -->
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="formData.introduce"
        />
      </el-form-item>
    </el-form>
    <!-- 确定和取消 -->
    <!-- 将type属性和justify属性设置在el-row标签上，而不是el-col标签 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="4.5">
        <div class="grid-content bg-purple-light">
          <el-button size="small" class="grid-content bg-purple-dark" @click="btnCancel"
            >取消</el-button
          >
          <el-button size="small" type="primary" class="grid-content bg-purple" @click=" btnOK"
            >确定</el-button
          >
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments,addDepartments } from '@/api/departments'
import {getEmployeeSimple} from '@/api/employees'
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
     // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
        const { depts } =  await getDepartments()
        // debugger
        const isRepeat = depts.filter((item) => item.pid === this.treeNode.id).some(item => item.name === value)
        // 问题：callback是什么方法
        isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
     // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      const isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      // 定义表单数据
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },{
            trigger: "blur",
            validator:checkNameRepeat
          }
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },{
            trigger: "blur",
            validator:checkCodeRepeat
          }
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            trigger: "blur",
            min: 1,
            max: 300,
            message: "部门介绍要求1-50个字符",
          },
        ],
      },
      peoples: [] // 接收获取的员工简单列表的数据
    };
  },
  methods: {
    async getEmployeeSimple(){
      this.peoples = await getEmployeeSimple()
    },
    btnOK(){
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          // 将新增部门的id设置为操作节点的pid
          await addDepartments({...this.formData,pid:this.treeNode.id})
          this.$emit('addDepts')
          // update:props名称
          // 关闭dialog的时候会触发el-dialog的close事件，所以这里不需要再单独的重置表单数据了
          this.$emit('update:showDialog', false) //触发事件
        }
      })
    },
    btnCancel(){
      this.$emit('update:showDialog', false) //触发事件
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.deptForm.resetFields() // 重置校验字段
    }
  }
};
</script>

<style >
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>