<template>
  <div class="Show">
    <el-container>
      <el-main v-loading="loading">
        <el-tabs>
          <el-tab-pane label="详情">
            <el-row>
              <el-col :span="4">名称:</el-col>
              <el-col :span="20">{{ deploymentName }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">命名空间:</el-col>
              <el-col :span="20">{{ deploymentNamespace }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">注释:</el-col>
              <el-col :span="20">
                <el-tag v-for="(label,value) in annotations" :key="label">{{ value }}:{{ label }}</el-tag>
              </el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">创建时间:</el-col>
              <el-col :span="20">{{ time1(creationTimestamp) }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">选择器:</el-col>
              <el-col :span="20">
                <el-tag v-for="(label,value) in selector" :key="label">{{ value }}:{{ label }}</el-tag>
              </el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">策略:</el-col>
              <el-col :span="20">{{ strategy }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">最小就绪秒数:</el-col>
              <el-col :span="20">{{ minReadySeconds }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">历史版本限制值:</el-col>
              <el-col :span="20">{{ revisionHistoryLimit }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">滚动更新策略:</el-col>
              <el-col :span="20">最大激增数：{{ maxSurge }}, 最大无效数：{{ maxUnavailable }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">状态:</el-col>
              <el-col :span="20">{{ updatedReplicas }} 个已更新, 共计 {{ replicas }} 个, {{ readyReplicas }} 个可用, {{ unReplicas }} 个不可用</el-col>
            </el-row><br>
          </el-tab-pane>
          <el-tab-pane label="容器组">
            <el-table
              :data="podData"
              style="width:100%"
              stripe
            >
              <el-table-column sortable prop="metadata.name" label="实例名称" width="270"/>
              <el-table-column sortable prop="status.hostIP" label="节点IP"/>
              <el-table-column sortable prop="status.podIP" label="podIP"/>
              <el-table-column sortable prop="status.phase" label="状态" width="130">
                <template slot-scope="scope">
                  <font :color="checkStatusFunc(scope.row.status.phase)">{{ scope.row.status.phase }}</font>
                </template>
              </el-table-column>
              <el-table-column sortable prop="metadata.creationTimestamp" label="已创建">
                <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template>
              </el-table-column>
              <el-table-column sortable prop="status.containerStatuses[0].restartCount" label="重启次数"/>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="small"
                    @click="getSinglePod(scope.row.metadata)">
                    查看
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="delFunc(scope.row.metadata)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <el-dialog
      :visible.sync="dialogVisible"
      title="修改容器组"
      width="50%">
      <el-input
        :rows="15"
        v-model="pods"
        type="textarea"
        placeholder="请输入内容"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogVisible = false">取 消</el-button>
        <el-button type="text" @click="dialogVisible = false">复 制</el-button>
        <el-button type="text" @click="updatePod()">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Single } from '@/api/deployment'
import { getPods, update, delPod, getPod } from '@/api/pod'
import { getAllNamespace } from '@/api/namespace'
export default {
  data() {
    return {
      dialogVisible: false,
      pods: '',
      podData: [],
      loading: true,
      options4: [],
      namespace1: 'default',
      deploymentName: '',
      deploymentNamespace: '',
      annotations: [],
      creationTimestamp: '',
      selector: '',
      minReadySeconds: 0,
      revisionHistoryLimit: 0,
      strategy: 0,
      maxSurge: 0,
      maxUnavailable: 0,
      updatedReplicas: 0,
      replicas: 0,
      readyReplicas: 0,
      unReplicas: 0
    }
  },
  created() {
    this.selS()
    this.selectFunc()
    this.selNameSpace()
  },
  methods: {
    selS: function() {
      this.deploymentName = this.$route.params.name
      this.deploymentNamespace = this.$route.params.namespace
      this.namespace1 = this.deploymentNamespace
      Single(this.deploymentName, this.deploymentNamespace).then(response => {
        debugger
        this.deploymentName = response.data.metadata.name
        this.deploymentNamespace = response.data.metadata.namespace
        this.annotations = response.data.metadata.annotations
        this.creationTimestamp = response.data.metadata.creationTimestamp
        this.selector = response.data.spec.selector.matchLabels
        this.minReadySeconds = response.data.spec.minReadySeconds === undefined ? 0 : response.data.spec.minReadySeconds
        this.revisionHistoryLimit = response.data.spec.revisionHistoryLimit
        this.strategy = response.data.spec.strategy.type
        this.maxSurge = response.data.spec.strategy.rollingUpdate === undefined ? 0 : response.data.spec.strategy.rollingUpdate.maxSurge
        this.maxUnavailable = response.data.spec.strategy.rollingUpdate === undefined ? 0 : response.data.spec.strategy.rollingUpdate.maxUnavailable
        this.updatedReplicas = response.data.status.updatedReplicas
        this.replicas = response.data.status.replicas
        this.readyReplicas = response.data.status.readyReplicas
        this.unReplicas = this.replicas - this.readyReplicas
      })
    },
    selectFunc: function() {
      debugger
      const _this = this
      var data = {
        deploymentName: _this.deploymentName,
        nameSpace: _this.namespace1
      }
      getPods(data).then(response => {
        _this.podData = response.data.items
        _this.loading = false
      })
    },
    resetFunc: function(data) {
    },
    time: function(tm) {
      var createTime = new Date(tm).getTime()
      var now = new Date().getTime()
      var age = Math.floor((now - createTime) / 1000)
      if (age < 60) {
        return Math.floor(age) + 's'
      } else if (age / 60 < 60) {
        return Math.floor(age / 60) + 'm'
      } else if (age / 60 / 60 < 24) {
        return Math.floor(age / 60 / 60) + 'h'
      } else {
        return Math.floor(age / 60 / 60 / 24) + 'd'
      }
    },
    checkStatusFunc: function(phase) {
      if (phase === 'Running') {
        return '#46AF60'
      } else {
        return '#F56C6C'
      }
    },
    getReady: function(containerStatuses) {
      if (containerStatuses !== undefined) {
        var flag = 0
        containerStatuses.forEach(function(item) {
          if (item.ready) {
            flag++
          }
        })
        return flag
      }
      return 0
    },
    delFunc: function(metadata) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delPod({ name: metadata.name, namespace: metadata.namespace }).then(response => {
            this.selectFunc()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            setTimeout(() => {
              this.selectFunc()
            }, 4000)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    rr: function() {
      this.loading = true
      this.namespace1 = 'default'
      this.selectFunc()
    },
    selNameSpace: function() {
      getAllNamespace().then(response => {
        debugger
        this.options4 = response.data.items
      })
    },
    getSinglePod(metadata) {
      const _this = this
      var params = { podName: metadata.name, namespace: metadata.namespace }
      console.log(params)
      getPod(params).then(response => {
        debugger
        _this.dialogVisible = true
        _this.pods = JSON.stringify(response.data, null, 4)
      })
    },
    updatePod() {
      debugger
      const _this = this
      var name = _this.pods
      var nameSpace = JSON.parse(_this.pods).metadata.namespace
      this.$confirm('此操作将作出修改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        update(name, nameSpace).then(response => {
          _this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
      }).catch(() => {
        _this.dialogVisible = false
        this.$message({
          type: 'info',
          message: '取消修改'
        })
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
