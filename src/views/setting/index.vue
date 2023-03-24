<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!-- <button @click="btn">点击</button> -->
        {{ obj.a }}
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="backgroundcolor: pink; height: 60px" align="middle">
              <!-- 点击“新增角色”只需将dialog对话弹出即可 -->
              <el-button
                icon="el-icon-plus"
                type="primary"
                @click="add"
                >新增角色</el-button
              >
              <!-- <el-button
                icon="el-icon-plus"
                type="primary"
                @click="showDialog = true"
                >新增角色</el-button
              > -->
            </el-row>
            <el-table border="" :data="list">
              <!-- 
                align="center"
                header-align="left"
               -->
              <el-table-column
                label="序号"
                type="index"
                width="120"
                align="center"
                header-align="left"
              />
              <el-table-column
                label="角色名称"
                prop="name"
                width="240"
                align="center"
              />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button type="primary" @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button type="danger" @click="deleteRole(row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-row
              type="flex"
              justify="center"
              style="backgroundcolor: pink; height: 60px"
              align="middle"
            >
              <el-pagination
                layout="prev, pager, next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="handleCurrentChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              :closable="false"
              :show-icon="true"
              title="消息提示的文案"
              type="info"
            >
            </el-alert>
            <!-- 
              并不是所有的表单都需要model rules prop, 只有在表单校验时才需要写
            -->
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="电话">
                <el-input
                  v-model="formData.companyPhone"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item v-model="formData.remarks" label="备注">
                <el-input
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置编辑弹层 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
      this.roleForm.id:{{ this.roleForm.id }}
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置分配权限的弹层 -->
    <el-dialog title="分配权限" :visible="showPermDialog">
      <!-- 
        check-strictly如果为true，表示父子勾选时，不互相关联
        如果为false，表示父子勾选时，互相关联
       -->
       <!-- default-checked-keys：默认勾选的节点的key的数组 -->
       <!-- node-key:每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 -->
      <el-tree :data="permData" :props="defaultProps" :show-checkbox="true" default-expand-all :check-strictly="true" :default-checked-keys="selectCheck" node-key="id"	/>
       <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
} from "@/api/setting";
import {getPermissionList} from '@/api/permission'
import { tranListToTreeData } from "@/utils/index";
import { mapGetters } from "vuex";
export default {
  // 计算属性
  computed: {
    ...mapGetters(["companyId"]),

    // showTitle() {
    //   console.log('计算属性被执行了');
    //   return this.roleForm.id ? "编辑角色" : "新增角色";
    // },
    showTitle:{
      // 禁用计算属性的缓存
      // cache: false,
      get(){
        // return this.roleForm.id ? "编辑角色" : "新增角色";
        return this.roleForm.id===undefined ? "新增角色" : "编辑角色";
      }
    }

  },
  data() {
    return {
      obj:{},
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0, // 记录总数
      },
      showDialog: false,
      formData:{},
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {},
      rules: {
        name: [
          // { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
      showPermDialog:false,
      permData:[], // 接受权限数据
      defaultProps: {
        label: 'name'
      }, // 定义显示字段的名称 和 子属性的字段名称
      roleId:null, // 用来记录当前分配权限的id
      selectCheck:[], // 用来记录当前权限点的标识
    };
  },
  mounted () {
    this.obj.a = 3
    this.obj.c = 5
  },
  created() {
    this.obj.b = 4
    this.getRoleList();
    this.getCompanyInfo(this.companyId);
  },
  methods: {
    // btn(){
    //   this.obj.a = 1
    // },
    add(){
      console.log('add - this.roleForm.id:'+this.roleForm.id);
      this.showDialog = true
    },
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    handleCurrentChange(newPage) {
      this.page.page = newPage;
      this.getRoleList(this.page);
    },
    async getCompanyInfo(companyId) {
      this.formData = await getCompanyInfo(companyId);
    },
    // 和讲义中代码不一样
    async deleteRole(row) {
      // this.$modal.confirm 和 this.$confirm 的区别
      this.$confirm(`确认删除${row.name}吗`)
        .then(() => {
          return deleteRole(row.id);
        })
        .then(() => {
          // this.$modal.msgSuccess(`${row.name}删除成功`)
          this.getRoleList();
        });
    },
    async editRole(id) {
      console.log('edit - 赋值前this.roleForm.id:'+this.roleForm.id);
      // roleForm对象与表单双向绑定  而不是formData
      this.roleForm = await getRoleDetail(id); // 实现数据回写
      console.log('edit - 赋值后this.roleForm.id:'+this.roleForm.id);
      this.showDialog = true; // 为了不出现闪烁的问题 先获取数据 再弹出层
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate();
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm);
        } else {
          // 新增业务
          await addRole(this.roleForm);
        }
        // 重新拉取数据
        this.getRoleList();
        this.$message.success("操作成功");
        this.showDialog = false; // 关闭弹层  =>  触发el-dialog的事件close事件
      } catch (error) {
        console.log(error);
      }
    },
    btnCancel() {
      // 重置数据，因为resetFields只能重置表单上的数据，非表单上的数据，比如编辑中的id不能重置
      this.roleForm = {
        name: "",
        description: "",
      };
      console.log();
      this.roleForm.id = undefined
      let a = this.roleForm.id
      console.log('a:'+a);
      // delete删除属性，vue监听不到
      // delete this.roleForm.id
      let b = this.roleForm.id
      console.log('b:'+b);
      // console.log("a===b:"+a===b);
      console.log("a===b:");
      console.log(a===b);
      // 移除校验
      // resetFields只能重置表单上的数据
      this.$refs.roleForm.resetFields();
      console.log('重置之后的数据');
      console.log(this.roleForm);
      this.showDialog = false;
    },

    // 获取权限点数据
    async assignPerm(id){
      let result = await getPermissionList() // 获取所有权限点
      this.permData = tranListToTreeData(result,'0') // 转化list到树形数据
      // 有id就可以
      this.roleId = id
      // 获取当前id所拥有的权限点
      const {permIds} = await getRoleDetail(id) // permIds为当前角色拥有的权限点数据
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    btnPermOK(){

    },
    btnPermCancel(){

    }
  },
};
</script>

<style>
</style>
