<template>
  <div class="node">
    <el-container>
      <el-main>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="主机" name="first">
            <el-row>
              <el-col :span="15">
                <el-button type="primary" round size="mini" @click="addNew = true">新建</el-button>
                <el-button size="mini" type="success" round @click="addNode = true">添加节点</el-button>
                <el-dialog
                  :visible.sync="addNew"
                  title="新建集群"
                  width="40%"
                  center>
                  <span>
                    <el-form ref="form" :model="form" label-width="80px">
                      <el-form-item label="集群名称">
                        <el-input v-model="form.name"/>
                      </el-form-item>
                      <el-form-item label="集群类型">
                        <el-radio-group v-model="form.resource">
                          <el-radio label="test8067"/>
                          <el-radio label="done02632"/>
                        </el-radio-group>
                      </el-form-item>
                    </el-form>
                  </span>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="addNew = false">取 消</el-button>
                    <el-button type="primary" @click="addNew = false">确 定</el-button>
                  </span>
                </el-dialog>
                <el-dialog
                  :visible.sync="addNode"
                  title="添加节点"
                  width="40%"
                  center>
                  <span v-html="str"/>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="addNode = false">取 消</el-button>
                    <el-button type="primary" @click="addNode = false">确 定</el-button>
                  </span>
                </el-dialog>
              </el-col>
              <el-col :span="7">
                <el-input
                  v-model="name1"
                  size="mini"
                  placeholder="过滤节点"
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
                label="NAME">
                <template slot-scope="scope"><font color="#2995d7">{{ scope.row.metadata.name }}</font></template>
              </el-table-column>
              <el-table-column
                prop="status.conditions[3].status"
                label="STATUS">
                <template slot-scope="scope"><font :color="getColor(scope.row.status.conditions[3].status)">{{ scope.row.status.conditions[3].type }}</font></template>
              </el-table-column>
              <el-table-column
                label="ROLES">
                <template slot-scope="scope">{{ getType(scope.row.metadata.labels) }}</template>
              </el-table-column>
              <el-table-column
                label="AGE">
              <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template></el-table-column>
              <el-table-column
                label="VERSION">
                <template slot-scope="scope">{{ scope.row.status.nodeInfo.kubeletVersion }}</template>
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
      form: {
        name: '',
        resource: 'test8067'
      },
      addNode: false,
      addNew: false,
      activeName: 'first',
      tableData: [],
      name1: '',
      str: '请SSH登录主机执行如下命令:</br>curl 10.10.17.111:8080/initcluster.sh | sh - -i C-2342id -arch arm64'
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
          str1 = 'master'
        } else {
          str1 = 'node'
        }
      }
      return str1
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
