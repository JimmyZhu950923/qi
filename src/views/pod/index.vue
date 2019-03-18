<template>
  <el-main>
    <el-tabs>
      <el-tab-pane label="容器实例">
        <el-table
          v-loading="loading"
          :data="podData"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="width:100%"
          stripe
        >
          <el-table-column prop="metadata.namespace" label="命名空间" width="130"/>
          <el-table-column prop="metadata.name" label="实例名称" width="300"/>
          <el-table-column prop="status.hostIP" label="READY" width="140">
            <template slot-scope="scope">{{ getReady(scope.row.status.containerStatuses) }}/{{ scope.row.spec.containers.length }}</template>
          </el-table-column>
          <el-table-column prop="status.phase" label="状态" width="120">
            <template slot-scope="scope">
              <font :color="checkStatusFunc(scope.row.status.phase)">{{ scope.row.status.phase }}</font>
            </template>
          </el-table-column>
          <el-table-column prop="metadata.creationTimestamp" label="AGE" width="150">
            <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template>
          </el-table-column>
          <el-table-column prop="status.containerStatuses[0].restartCount" label="命名空间" width="130"/>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="replaceFunc(scope.row.metadata)">
                重建
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>
<script>
import { getPods, update } from '@/api/pod'
export default {
  data() {
    return {
      podData: [],
      loading: true
    }
  },
  created() {
    this.selectFunc()
  },
  methods: {
    selectFunc: function() {
      const _this = this
      var data = {
        nameSpace: ''
      }
      getPods(data).then(response => {
        console.log(response.data.items)
        _this.podData = response.data.items
        _this.loading = false
      })
    },
    resetFunc: function(data) {
      console.log(data)
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
      console.log(metadata.name, metadata.namespace)
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
          console.log(item)
          if (item.ready) {
            flag++
          }
        })
        return flag
      }
      return 0
    }
  }
}
</script>
