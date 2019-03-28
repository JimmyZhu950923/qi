<template>
  <div class="setting">
    <el-container>
      <el-header>系统设置</el-header>
      <el-main>
        <el-form ref="form" :model="form" label-width="40px">
          <el-form-item label-width="40px"><span style="font-size:16px"><b>是否开启存储功能:</b></span>
            <el-switch v-model="form.storage"/>
          </el-form-item>
          <el-form-item><span style="font-size:16px"><b>邮件服务器配置</b></span></el-form-item>
          <el-form-item label="smtp" label-width="110px" >
            <el-input v-model="form.smtp" size="small"/>
          </el-form-item>
          <el-form-item label="发送人" label-width="110px">
            <el-input v-model="form.sendPerson" size="small"/>
          </el-form-item>
          <el-form-item label="用户名" label-width="110px">
            <el-input v-model="form.username" size="small"/>
          </el-form-item>
          <el-form-item label="密码" label-width="110px">
            <el-input v-model="form.password" type="password" size="small"/>
          </el-form-item>
          <el-form-item><span style="font-size:16px"><b>短信网关配置</b></span></el-form-item>
          <el-form-item label="网关地址" label-width="110px">
            <el-input v-model="form.address" size="small"/>
          </el-form-item>
          <el-form-item label="用户名" label-width="110px">
            <el-input v-model="form.username" size="small"/>
          </el-form-item>
          <el-form-item label="密码" label-width="110px">
            <el-input v-model="form.password" type="password" size="small"/>
          </el-form-item>
          <el-form-item label-width="110px">
            <el-button type="primary" size="small" round @click="set"> 确定 </el-button>
          </el-form-item>
        </el-form>

      </el-main>
      <el-footer/>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'Setting',
  data() {
    return {
      form: {
        storage: true,
        smtp: 'smtp.venusource.com',
        sendPerson: 'cj.zhao@venusource.com',
        username: 'dockerad',
        password: '123456',
        address: 'smtp.venusource.com'
      }
    }
  },
  methods: {
    set() {
      this.$message({
        type: 'success',
        message: '设置成功'
      })
    }
  }
}
</script>
<style>
.el-header {
    color: #333;
    line-height: 60px;
  }
    .el-main {
    color: #333;
  }
    .setting .el-input{
        width:480px;
    }
</style>
