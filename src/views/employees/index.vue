<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :showBefore="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template v-slot:after>
          <el-button size="small" type="success">excel导入</el-button>
          <el-button size="small" type="danger">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="">
            <template v-slot="scope">
              {{ scope.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="">
            <template v-slot="{ row }">
              <el-switch :value="row.enableState === 1 + ''" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" >角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev,pager,next"
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <addEmployee :showDialog.sync="showDialog"></addEmployee>
    <!-- 放置分配角色组件 -->
    <AssignRole :showRoleDialog.sync="showRoleDialog" :userId="userId"></AssignRole>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
// 引入员工的枚举对象
import EmployeeEnum from "@/api/constant/employees";
import addEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0,
      },
      loading: false, // 显示遮罩层
      showDialog:false,
      showRoleDialog:false, // 显示分配角色的弹层
      userId:null, // 定义一个userId
    };
  },
  components: {
    addEmployee,AssignRole
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    async getEmployeeList() {
      this.loading = true;
      const { total, rows } = await getEmployeeList(this.page);
      this.list = rows;
      this.page.total = total;
      this.loading = false;
    },
    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployeeList();
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    async delEmployee(id) {
      try {
        await this.$confirm("您确定删除该员工吗");
        await delEmployee(id);
        this.getEmployeeList();
        this.$message.success("删除员工成功");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>
