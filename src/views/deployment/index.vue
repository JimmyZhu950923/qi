<template>
  <div>
    <el-header>
      <el-main>
        <el-tabs>
          <el-tab-pane label="工作负载">
            <el-table
              :data="deployment"
              style="width:100%"
              stripe>
              <el-table-column label="名称" prop="metadata.name"/>
              <el-table-column label="READY" prop="status.readyReplicas">
                <template slot-scope="scope">{{ scope.row.status.readyReplicas }}/{{ scope.row.status.replicas }}</template>
              </el-table-column>
              <el-table-column label="现在" prop="status.updatedReplicas"/>
              <el-table-column label="可用" prop="status.availableReplicas"/>
              <el-table-column prop="metadata.creationTimestamp" label="AGE">
                <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-main>
  </el-header></div>
</template>
<script>
import { list } from '@/api/deployment'
export default {
  data() {
    return {
      deployment: []
    }
  },
  created() {
    this.selectFunc()
  },
  methods: {
    selectFunc: function() {
      var namespace = ''
      list({ namespace: namespace }).then(response => {
        debugger
        this.deployment = response.data.items
      })
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
    }
  }
}
</script>
