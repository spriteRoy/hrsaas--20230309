<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div v-for="user in users" :key="user.id">
      <!-- 函数 -->
      <!-- {{ fullName(user) }} -->
      <tr v-for="(user, item) in users" :key="user.id">
        <td class="col-xs-6 col-sm-3 col-md-3 col-lg-3">
          {{ fullName[item] }}
        </td>
      </tr>
    </div>

    <!-- {{obj.a}} -->
    <!-- <input type="text" v-bind:value="obj.a" @input="ipt"> -->
    <input type="text" v-model="obj.a">
    <button @click="btn">按钮</button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
    fullName() {
      return this.users.map((item) => item.first_name + " - " + item.last_name);
    },
    now: function () {
      return Date.now();
    },
  },
  methods:{
    ipt(e){
      // console.log(e);
       this.obj.a = e.data
    },
    btn(){
      // console.log(this.obj.a);
      this.obj.a = 1
      // this.$set(this.obj,'a',22)
      // delete this.obj.a
      // this.obj.a = undefined
    }
  },
  data() {
    return {
      obj:{},
      arr: [88, 90, 100, 20, 50],
      users: [
        // Duplicate keys detected: '3'. This may cause an update error
        {
          id: 1,
          first_name: "Joe",
          last_name: "Blogs",
        },
        {
          id: 2,
          first_name: "Jane",
          last_name: "Doe",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
