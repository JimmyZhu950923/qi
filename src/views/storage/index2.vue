<template>
  <div class="Show">
    <el-container>
      <el-main v-loading="loading">
        <el-tabs>
          <el-tab-pane label="详情">
            <el-row>
              <el-col :span="4">名称:</el-col>
              <el-col :span="20">{{ storageClassName }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">创建时间:</el-col>
              <el-col :span="20">{{ time1(creationTimestamp) }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">类型:</el-col>
              <el-col :span="20">{{ provisioner }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">管理者ID:</el-col>
              <el-col :span="20">{{ adminID }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">管理者名字:</el-col>
              <el-col :span="20">{{ adminName }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">管理者命名空间:</el-col>
              <el-col :span="20">{{ adminNamespace }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">用户ID:</el-col>
              <el-col :span="20">{{ userID }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">用户名字:</el-col>
              <el-col :span="20">{{ userName }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">用户命名空间:</el-col>
              <el-col :span="20">{{ userNamespace }}</el-col>
            </el-row><br>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getSingle } from '@/api/storage'
export default {
  data() {
    return {
      loading: true,
      storageClassName: '',
      creationTimestamp: '',
      provisioner: '',
      adminID: '',
      adminName: '',
      adminNamespace: '',
      userID: '',
      userName: '',
      userNamespace: ''
    }
  },
  created() {
    this.selS()
    // this.getAllServices()
  },
  methods: {
    selS: function() {
      this.storageClassName = this.$route.params.name
      this.storageClassNamespace = this.$route.params.namespace
      getSingle(this.storageClassNamespace, this.storageClassName).then(response => {
        // debugger
        this.storageClassName = response.data.metadata.name
        this.creationTimestamp = response.data.metadata.creationTimestamp
        this.provisioner = response.data.provisioner
        this.adminID = response.data.parameters.adminID
        this.adminName = response.data.parameters.adminSecretName
        this.adminNamespace = response.data.parameters.adminSecretNamespace
        this.userID = response.data.parameters.userId
        this.userName = response.data.parameters.userSecretName
        this.userNamespace = response.data.parameters.userSecretNamespace
        this.loading = false
      })
    },
    time1: function(tm) {
      var data = new Date(tm)
      var str =
        data.getFullYear() +
        '/' +
        (data.getMonth() + 1) +
        '/' +
        data.getDate() +
        ' '
      if (data.getHours() < 12) {
        str += '上午' + data.getHours() + ':'
      } else {
        str += '下午' + (data.getHours() - 12) + ':'
      }
      if (data.getSeconds().toString().length === 1) {
        str += '0' + data.getSeconds()
      } else {
        str += data.getSeconds()
      }
      return str
    }
  }
}
</script>
<style>
.Show .el-tag{
  font-size:15px;
  border-radius: 20px;
  margin-right: 15px;
  margin-bottom: 10px;
}
.Show{
font-size:15px;
}
.el-header{
  padding-bottom: 0%;
}
</style>
