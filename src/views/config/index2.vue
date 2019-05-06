<template>
  <div class="Show">
    <el-container>
      <el-main v-loading="loading">
        <el-tabs>
          <el-tab-pane label="详情">
            <el-row>
              <el-col :span="4">名称:</el-col>
              <el-col :span="20">{{ configName }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">命名空间:</el-col>
              <el-col :span="20">{{ configNamespace }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">注释:</el-col>
              <el-col :span="20">
                <el-tag v-for="(label,value) in annotations" :key="label">{{ value }}:{{ label }}</el-tag>
              </el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">标签:</el-col>
              <el-col :span="20">
                <el-tag v-for="(label,value) in labels" :key="label">{{ value }}:{{ label }}</el-tag>
              </el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">创建时间:</el-col>
              <el-col :span="20">{{ time1(creationTimestamp) }}</el-col>
            </el-row><br>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getSingle } from '@/api/config'
export default {
  data() {
    return {
      loading: true,
      configName: '',
      configNamespace: '',
      annotations: '',
      labels: '',
      creationTimestamp: ''
    }
  },
  created() {
    this.selC()
  },
  methods: {
    selC: function() {
      this.configName = this.$route.params.name
      this.configNamespace = this.$route.params.namespace
      getSingle(this.configNamespace, this.configName).then(response => {
        // debugger
        this.configName = response.data.metadata.name
        this.configNamespace = response.data.metadata.namespace
        this.annotations = response.data.metadata.annotations
        this.labels = response.data.metadata.labels
        this.creationTimestamp = response.data.metadata.creationTimestamp
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
