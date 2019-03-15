<template>
  <div class="node">
    <el-container>
      <el-main>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="主机" name="first">
            <el-row>
              <el-col :span="7" :offset="17">
                <el-input
                  v-model="name1"
                  size="small"
                  placeholder="按IP过滤"
                  prefix-icon="el-icon-search"
                  @keyup.native="nameChange1"
                />
              </el-col>
            </el-row>
            <el-table
              ref="multipleTable"
              :fit="true"
              :data="tableData"
              stripe
              height="430px"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column
                prop="status.addresses[0].address"
                label="私有IP">
                <template slot-scope="scope"><font color="#2995d7">{{ scope.row.status.addresses[0].address }}</font></template>
              </el-table-column>
              <el-table-column
                prop="metadata.labels"
                label="主机标签">
                <template slot-scope="scope"><font color="#2995d7">{{ getJsonLength(scope.row.metadata.labels)+'个' }}</font></template>
              </el-table-column>
              <el-table-column
                prop="status.conditions[3].status"
                label="状态">
                <template slot-scope="scope"><font :color="getColor(scope.row.status.conditions[3].status)">{{ getStatus(scope.row.status.conditions[3].status) }}{{ getSchedule(scope.row.spec) }}</font></template>
              </el-table-column>
              <el-table-column
                label="创建方式"/>
              <el-table-column
                label="Pod数量"/>
              <el-table-column
                label="CPU数量">
                <template slot-scope="scope">{{ scope.row.status.allocatable.cpu }}</template>
              </el-table-column>
              <el-table-column
                label="内存大小">
              <template slot-scope="scope">{{ getMemory(scope.row.status.allocatable.memory) }}</template></el-table-column>
              <el-table-column
                label="主机类型">
                <template slot-scope="scope">{{ getType(scope.row.metadata.labels) }}</template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                  <el-dropdown size="small" split-button type="primary" @click="selectRow(scope.row.metadata.name)" @command="handleCommand">
                    查看
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="b">迁移</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="监控" name="second">监控</el-tab-pane>
          <el-tab-pane label="时间" name="third">事件</el-tab-pane>
          <el-tab-pane label="日志源" name="fourth">日志源</el-tab-pane>
          <el-tab-pane label="命名空间" name="five">命名空间</el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getNodes } from '@/api/node'
export default {
  name: 'Node',
  data() {
    return {
      activeName: 'first',
      tableData: [],
      name1: ''
    }
  },
  created() {
    this.getAllNode()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    getAllNode() {
      const _this = this
      getNodes().then(response => {
        // debugger
        _this.tableData = response.data.items
      })
    },
    getJsonLength(jsonData) {
      var length = 0
      for (var str in jsonData) {
        console.log(str)
        length++
      }
      return length
    },
    getStatus(bol) {
      if (bol) {
        return '运行中'
      } else {
        return '未运行'
      }
    },
    getSchedule(spec) {
      // debugger
      if (spec.taints === undefined) {
        return '-可调度'
      } else {
        return ''
      }
    },
    getMemory(memory) {
      var num = memory.split('K')[0]
      var num1 = num / 1024 / 1024
      num = num1.toFixed(1)
      return num + 'G'
    },
    getColor(bol) {
      if (bol) {
        return '#46AF40'
      } else {
        return '#F56C6C'
      }
    },
    getType(jsonData) {
      for (var str in jsonData) {
        var str1 = ''
        if (str === 'node-role.kubernetes.io/master') {
          str1 = 'controller'
        } else {
          str1 = 'compute'
        }
      }
      return str1
    },
    selectRow(nodeName) {
      this.$router.push({ name: 'ShowNode', params: { nodeName: nodeName }})
    },
    handleCommand(command) {
      if (command === 'b') {
        alert('迁移方法')
      }
    },
    nameChange1: function() {
      console.log(this.name1)
      // this.selectFunc()
    }

  }
}
</script>
