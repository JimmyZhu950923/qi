<template>
  <div class="Show">
    <el-container>
      <el-main v-loading="loading">
        <el-tabs>
          <el-tab-pane label="详情">
            <el-row>
              <el-col :span="4">名称:</el-col>
              <el-col :span="20">{{ serviceName }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">命名空间:</el-col>
              <el-col :span="20">{{ serviceNamespace }}</el-col>
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
            <el-row>
              <el-col :span="4">标签选择器:</el-col>
              <el-col :span="20">
                <el-tag v-for="(label,value) in selector" :key="label">{{ value }}:{{ label }}</el-tag>
              </el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">类型:</el-col>
              <el-col :span="20">{{ serviceType }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">保持会话:</el-col>
              <el-col :span="20">{{ keepConversation }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="24"><h4>连接</h4></el-col>
            </el-row>
            <el-row>
              <el-col :span="4">集群IP:</el-col>
              <el-col :span="20">{{ clusterIP }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">内部端点:</el-col>
              <el-col :span="20">
                <el-tag v-for="(label) in innerPort" :key="label.a">{{ serviceName }}:{{ label.port }} {{ label.protocol }}</el-tag>
              </el-col>
            </el-row><br>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getSingle } from '@/api/service'
export default {
  data() {
    return {
      loading: true,
      serviceName: '',
      serviceNamespace: '',
      annotaions: '',
      creationTimestamp: '',
      serviceType: '',
      keepConversation: '',
      clusterIP: '',
      innerPort: '',
      labels: [],
      selector: []
    }
  },
  created() {
    this.selS()
    // this.getAllServices()
  },
  methods: {
    selS: function() {
      this.serviceName = this.$route.params.name
      this.serviceNamespace = this.$route.params.namespace
      getSingle(this.serviceNamespace, this.serviceName).then(response => {
        debugger
        this.serviceName = response.data.metadata.name
        this.serviceNamespace = response.data.metadata.namespace
        this.serviceType = response.data.spec.type
        this.clusterIP = response.data.spec.clusterIP
        this.innerPort = response.data.spec.ports
        this.keepConversation = response.data.spec.sessionAffinity
        this.creationTimestamp = response.data.metadata.creationTimestamp
        this.labels = response.data.metadata.labels
        this.selector = response.data.spec.selector
        this.loading = false
      })
    },
    // getAllServices: function() {
    //   debugger
    //   const _this = this
    //   var data = {
    //     serviceName: _this.serviceName,
    //     serviceNamespace: _this.serviceNamespace
    //   }
    //   getServices(data).then(response => {
    //     _this.serviceData = response.data.item
    //   })
    // },
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
