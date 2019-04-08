<template>
  <div class="Show">
    <el-container>
      <el-main v-loading="loading">
        <el-tabs>
          <el-tab-pane label="详情">
            <el-row>
              <el-col :span="4">名称:</el-col>
              <el-col :span="10">{{ daemonsetName }}</el-col>
              <el-col :span="5">状态</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">命名空间:</el-col>
              <el-col :span="10">{{ daemonsetNamespace }}</el-col>
              <el-col :span="5">容器组:</el-col>
              <el-col :span="4">{{ numberReady }} 运行中</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">创建时间:</el-col>
              <el-col :span="20">{{ time1(creationTimestamp) }}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="4">镜像:</el-col>
              <el-col :span="20">
                <span v-for="container in containers" :key="container.image">{{ container.image }}</span>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="容器组">
            <el-table
              :data="podData"
              style="width:100%"
              stripe
            >
              <el-table-column sortable prop="metadata.name" label="实例名称" width="300"/>
              <el-table-column sortable prop="status.hostIP" label="节点IP"/>
              <el-table-column sortable prop="status.podIP" label="podIP"/>
              <el-table-column sortable prop="status.phase" label="状态">
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
import { Single } from '@/api/daemonset'
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
      daemonsetName: '',
      daemonsetNamespace: '',
      // annotations: [],
      creationTimestamp: '',
      containers: '',
      numberReady: 0
    }
  },
  created() {
    this.selS()
    this.selectFunc()
    this.selNameSpace()
  },
  methods: {
    selS: function() {
      this.daemonsetName = this.$route.params.name
      this.daemonsetNamespace = this.$route.params.namespace
      this.namespace1 = this.daemonsetNamespace
      Single(this.daemonsetName, this.daemonsetNamespace).then(response => {
        // debugger
        this.daemonsetName = response.data.metadata.name
        this.daemonsetNamespace = response.data.metadata.namespace
        // this.annotations = response.data.metadata.annotations
        this.creationTimestamp = response.data.metadata.creationTimestamp
        this.containers = response.data.spec.template.spec.containers
        this.numberReady = response.data.status.numberReady
      })
    },
    selectFunc: function() {
      debugger
      const _this = this
      var data = {
        daemonsetName: _this.daemonsetName,
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
      debugger
      const _this = this
      var params = { podName: metadata.name, namespace: metadata.namespace }
      console.log(params)
      getPod(params).then(response => {
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
