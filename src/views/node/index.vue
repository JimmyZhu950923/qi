<template>
  <div class="node">
    <el-container>
      <el-main v-loading="loading">
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
                >
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
                >
                  <span v-html="str"/>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="addNode = false">取 消</el-button>
                    <el-button type="primary" @click="addNode = false">确 定</el-button>
                  </span>
                </el-dialog>
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
          <el-tab-pane label="命名空间" name="five">
            <el-row>
              <el-col :span="18">
                <el-button type="primary" size="mini" round @click="getAllNsp">查询</el-button>
                <el-button type="success" size="mini" round @click="insert = true">添加</el-button>
                <el-dialog :visible.sync="single" title="根据name查询单个namespace" width="30%">
                  <el-form :label-position="labelPosition" :model="singleForm" label-width="80px">
                    <el-form-item label="name">
                      <el-input v-model="singleForm.name"/>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="single = false">取 消</el-button>
                    <el-button type="primary" @click="getNsp">确 定</el-button>
                  </span>
                </el-dialog>
                <el-dialog :visible.sync="insert" title="添加namespace" width="30%">
                  <el-form :label-position="labelPosition" :model="insertForm" label-width="80px">
                    <el-form-item label="name">
                      <el-input v-model="insertForm.name" />
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="insert = false">取 消</el-button>
                    <el-button type="primary" @click="addNsp">确 定</el-button>
                  </span>
                </el-dialog>
              </el-col>
              <el-col :span="4">
                <el-input v-model="singleForm.name" style="width:175px" size="mini" placeholder="请输入NAME" prefix-icon="el-icon-search"/>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="getNsp"/>
              </el-col>
            </el-row>
            <el-table
              ref="multipleTable"
              :fit="true"
              :data="namespaceData"
              stripe
              height="430px"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column label="NAME" prop="metadata.name"/>
              <el-table-column label="STATUS">
                <template slot-scope="scope">
                  <font :color="getColor1(scope.row.status.phase)">{{ scope.row.status.phase }}</font>
                </template>
              </el-table-column>
              <el-table-column label="CREATIONTIMESTAMP">
                <template slot-scope="scope">{{ getCreateTime(scope.row.metadata.creationTimestamp) }}</template>
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="danger" size="small" round @click="deleteNsp(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getNodes } from '@/api/node'
import { getAllNamespace, getNamespace, addNamespace, deleteNamespace } from '@/api/namespace'
export default {
  name: 'Node',
  data() {
    return {
      form: {
        name: '',
        resource: 'test8067'
      },
      singleForm: {
        name: ''
      },
      insertForm: {
        name: ''
      },
      addNode: false,
      addNew: false,
      activeName: 'first',
      tableData: [],
      name1: '',
      str: '请SSH登录主机执行如下命令:</br>curl 10.10.17.111:8080/initcluster.sh | sh - -i C-2342id -arch arm64',
      loading: true,
      namespaceData: [],
      insert: false,
      labelPosition: 'right'
    }
  },
  created() {
    this.getAllNode()
    this.getAllNsp()
  },
  destroyed() {

  },
  methods: {
    handleClick(tab, event) {

    },
    // 查询所有namespace
    getAllNsp() {
      const _this = this
      getAllNamespace().then(response => {
        _this.namespaceData = response.data.items
        _this.loading = false
      })
    },
    getNsp() {
      // debugger
      this.namespaceData = []
      const _this = this
      var params = _this.singleForm.name
      getNamespace(params).then(response => {
        _this.namespaceData.push(response.data)
      })
    },
    addNsp() {
      const _this = this
      this.insert = false
      var params = { name: _this.insertForm.name }
      addNamespace(params).then(response => {
        _this.getAllNsp()
      })
    },
    deleteNsp(row) {
      // debugger
      this.$confirm('此操作会删除该空间下的所有资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _this = this
        var params = row.metadata.name
        deleteNamespace(params).then(response => {
          _this.getAllNsp()
          setTimeout(() => {
            console.log('>>>>>>>')
            _this.getAllNsp()
          }, 6000)
        })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    // 查询所有node
    getAllNode() {
      const _this = this
      getNodes().then(response => {
        // debugger
        _this.tableData = response.data.items
        _this.loading = false
      })
    },
    getColor(bol) {
      if (bol) {
        return '#46AF40'
      } else {
        return '#F56C6C'
      }
    },
    getColor1(status) {
      if (status === 'Active') {
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
    getCreateTime: function(row) {
      // debugger
      var data = new Date(row)
      var str =
        data.getFullYear() +
        '-' +
        (data.getMonth() + 1) +
        '-' +
        data.getDate() +
        '    '
      if (data.getHours() < 12) {
        str += '上午' + data.getHours() + ':'
      } else {
        str += '下午' + (data.getHours() - 12) + ':'
      }
      if (data.getMinutes() < 10) {
        str += '0' + data.getMinutes()
      } else {
        str += data.getMinutes()
      }
      return str
    },
    selectRow(nodeName) {
      this.$router.push({ name: 'ShowNode', params: { nodeName: nodeName }})
    },
    handleCommand(command) {
      if (command === 'b') {
        alert('迁移方法')
      }
    }
  }
}
</script>
