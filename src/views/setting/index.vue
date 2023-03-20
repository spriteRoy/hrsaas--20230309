<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="backgroundcolor: pink; height: 60px" align="middle">
              <!-- 点击“新增角色”只需将dialog对话弹出即可 -->
              <el-button
                icon="el-icon-plus"
                type="primary"
                @click="showDialog = true"
                >新增角色</el-button
              >
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
                  <el-button type="success">分配权限</el-button>
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
    <el-dialog title="编辑弹层" :visible="showDialog"  @close="btnCancel">
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
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
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["companyId"]),
  },
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 2,
        total: 0, // 记录总数
      },
      formData: {},
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {},
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo(this.companyId);
  },
  methods: {
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
          console.log("删除成功");
          this.getRoleList();
        });
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id); // 实现数据回写
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
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  },
};
</script>

<style>
</style>
