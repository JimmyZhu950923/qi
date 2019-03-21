<template>
  <el-main v-loading="loading">
    <el-tabs>
      <el-tab-pane label="容器实例">
        <el-row>
          <el-col :span="4">
            <el-select v-model="namespace1" size="mini" placeholder="请选择" @change="selectFunc">
              <el-option
                v-for="item in options4"
                :key="item.metadata.name"
                :label="item.metadata.name"
                :value="item.metadata.name"
              />
            </el-select>
          </el-col>
          <el-col :span="1">
            <el-button size="mini" icon="el-icon-refresh" circle @click="rr"/>
          </el-col>
        </el-row>
        <el-table
          :data="podData"
          style="width:100%"
          stripe
        >
          <el-table-column prop="metadata.name" label="实例名称" width="300"/>
          <el-table-column prop="status.hostIP" label="READY" width="140">
            <template slot-scope="scope">{{ getReady(scope.row.status.containerStatuses) }}/{{ scope.row.spec.containers.length }}</template>
          </el-table-column>
          <el-table-column prop="status.phase" label="状态" width="130">
            <template slot-scope="scope">
              <font :color="checkStatusFunc(scope.row.status.phase)">{{ scope.row.status.phase }}</font>
            </template>
          </el-table-column>
          <el-table-column prop="metadata.creationTimestamp" label="AGE">
            <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template>
          </el-table-column>
          <el-table-column prop="status.containerStatuses[0].restartCount" label="重启次数"/>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="replaceFunc(scope.row.metadata)">
                重建
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
</template>
<script>
import { getPods, update, delPod } from '@/api/pod'
import { getAllNamespace } from '@/api/namespace'
export default {
  data() {
    return {
      podData: [],
      loading: true,
      options4: [],
      namespace1: 'default'
    }
  },
  created() {
    this.selectFunc()
    this.selNameSpace()
  },
  methods: {
    selectFunc: function() {
      debugger
      const _this = this
      var data = {
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
    replaceFunc: function(metadata) {
      const _this = this
      update(metadata.name, metadata.namespace).then(response => {
        _this.$message({
          type: 'success',
          message: '重建成功!'
        })
      })
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
    }
  }
}
</script>
<style>
.dia{
  height: 500px
}
</style>
