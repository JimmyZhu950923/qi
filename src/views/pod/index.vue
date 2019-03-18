<template>
  <el-main>
    <el-tabs>
      <el-tab-pane label="容器实例">
        <el-table
          :data="podData"
          style="width:100%"
          stripe
        >
          <el-table-column prop="metadata.namespace" label="命名空间" width="130"/>
          <el-table-column prop="metadata.name" label="实例名称" width="300"/>
          <el-table-column prop="status.phase" label="状态" width="120">
            <template slot-scope="scope">
              <font :color="checkStatusFunc(scope.row.status.phase)">{{ scope.row.status.phase }}</font>
            </template>
          </el-table-column>
          <el-table-column prop="metadata.creationTimestamp" label="开始时间" width="150">
            <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template>
          </el-table-column>
          <el-table-column prop="status.hostIP" label="所在主机IP" width="140"/>
          <el-table-column prop="status.podIP" label="容器IP" width="140"/>
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
      podData: []
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
      })
    },
    resetFunc: function(data) {
      console.log(data)
    },
    time: function(tm) {
      var data = new Date(tm)
      var str =
        data.getFullYear() +
        '-'

      if (data.getMonth().toString().length === 1) {
        str += '0' + data.getMonth() + '-'
      } else {
        str += data.getMonth() + '-'
      }

      if (data.getDate().toString().length === 1) {
        str += '0' + data.getDate() + ' '
      } else {
        str += data.getDate() + ' '
      }

      if (data.getHours().toString().length === 1) {
        str += '0' + data.getHours() + ':'
      } else {
        str += data.getHours() + ':'
      }

      if (data.getSeconds().toString().length === 1) {
        str += '0' + data.getSeconds()
      } else {
        str += data.getSeconds()
      }
      return str
    },
    checkStatusFunc: function(phase) {
      debugger
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
    }
  }
}
</script>
