<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
        <el-col>
            <div v-if="showBefore" class="before">
                <i class="el-icon-info" />
                <slot name="before"></slot>
            </div>
        </el-col>
        <el-col>
            <el-row type="flex" justify="end">
                <slot name="after" />
                <!-- type="flex" justify="end"要写在el-row标签上 -->
                <!-- 比较设置:span="5"和不设置:span="5"的区别 -->
                <!-- <el-col :span="5">
                    <slot name="after" />
                </el-col> -->
            </el-row>
        </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
    props:{
        showBefore:{
            type:Boolean,
            default:false
        }
    }
}
</script>

<style>

</style>