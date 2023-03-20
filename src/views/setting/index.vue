<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="backgroundcolor: pink; height: 60px" align="middle">
              <el-button icon="el-icon-plus" type="primary">新增角色</el-button>
            </el-row>
            <el-table border="" :data="list">
              <!-- 
                align="center"
                header-align="left"
               -->
              <el-table-column label="序号" type="index" width="120" align="center" header-align="left"/>
              <el-table-column label="角色名称" prop="name" width="240" align="center" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <el-button type="success">分配权限</el-button>
                <el-button type="primary">编辑</el-button>
                <el-button type="danger">删除</el-button>
              </el-table-column>
            </el-table>
            <el-row
              type="flex"
              justify="center"
              style="backgroundcolor: pink; height: 60px"
              align="middle"
            >
              <el-pagination layout="prev, pager, next" 
              :current-page="page.page" :page-size="page.pagesize" 
              :total="page.total" @current-change="handleCurrentChange" />
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
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
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
  </div>
</template>

<script>
import { getRoleList } from "@/api/setting";
export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 2,
        total: 0, // 记录总数
      },
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total
      this.list = rows
    },
    handleCurrentChange(newPage){
      this.page.page = newPage
      this.getRoleList(this.page)
    }
  },
};
</script>

<style>
</style>
