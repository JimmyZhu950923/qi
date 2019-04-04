<template>
  <div class="node">
    <el-container>
      <el-main v-loading="loading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="主机" name="first">
            <el-row>
              <el-col :span="15">
                <el-button size="mini" type="success" round icon="el-icon-plus" @click="addNode = true">添加节点</el-button>
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
                label="名称">
                <template slot-scope="scope"><font color="#2995d7">
                  <a @click="selectRow(scope.row.metadata.name)">{{ scope.row.metadata.name }}</a>
                </font></template>
              </el-table-column>
              <el-table-column
                prop="status.conditions[3].status"
                label="状态">
                <template slot-scope="scope"><font :color="getColor(scope.row.status.conditions[3].status)">{{ scope.row.status.conditions[3].type }}</font></template>
              </el-table-column>
              <el-table-column
                label="角色">
                <template slot-scope="scope">{{ getType(scope.row.metadata.labels) }}</template>
              </el-table-column>
              <el-table-column
                label="存活时长">
              <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template></el-table-column>
              <el-table-column
                label="版本">
                <template slot-scope="scope">{{ scope.row.status.nodeInfo.kubeletVersion }}</template>
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-dropdown size="small" split-button type="primary" @click="selectRow(scope.row.metadata.name)" @command="handleCommand">
                    查看
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item command="b">迁移</el-dropdown-item> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="命名空间" name="five">
            <el-row>
              <el-col :span="18">
                <el-button type="success" size="mini" round icon="el-icon-plus" @click="insert = true">添加</el-button>
                <el-button type="primary" size="mini" round icon="el-icon-refresh" @click="getAllNsp">刷新</el-button>
                <el-dialog :visible.sync="insert" title="添加namespace" width="30%">
                  <el-form ref="insertForm" :label-position="labelPosition" :model="insertForm" label-width="80px">
                    <el-form-item
                      :rules="[
                        { required: true, validator: validateName, trigger: 'blur' }
                      ]"
                      label="name"
                      prop="name"
                      autocomplete="off">
                      <el-input v-model="insertForm.name" />
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="insert = false">取 消</el-button>
                    <el-button type="primary" @click="addNsp">确 定</el-button>
                  </span>
                </el-dialog>
              </el-col>
              <el-col :span="5">
                <el-input
                  v-model="singleForm.name"
                  :clearable="true"
                  size="mini"
                  placeholder="请输入名称"
                  prefix-icon="el-icon-search"
                  @clear="getAllNsp"
                  @keyup.native="nameChange"
                />
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
              <el-table-column label="名称" prop="Name"/>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <font color="#46AF40">{{ scope.row.Status }}</font>
                </template>
              </el-table-column>
              <el-table-column label="创建时间">
                <template slot-scope="scope">{{ getCreateTime(scope.row.CreateTime) }}</template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="120px">
                <template slot-scope="scope">
                  <el-button :disabled="scope.row.Name==='default'" type="danger" size="small" @click="deleteNsp(scope.row)">删除</el-button>
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
      singleForm: {
        name: ''
      },
      insertForm: {
        name: ''
      },
      addNode: false,
      activeName: 'first',
      tableData: [],
      name1: '',
      str: '请SSH登录主机执行如下命令:</br>curl 10.10.17.111:8080/initcluster.sh | sh - -i C-2342id -arch arm64',
      loading: true,
      namespaceData: [],
      insert: false,
      labelPosition: 'right',
      namespace: ''
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
        _this.namespaceData = response.data
        _this.loading = false
      })
    },
    getNsp() {
      // debugger
      this.namespaceData = []
      const _this = this
      var params = _this.singleForm.name
      getNamespace(params).then(response => {
        _this.namespaceData = response.data
      })
    },
    addNsp() {
      this.$refs['insertForm'].validate((valid) => {
        if (valid) {
          const _this = this
          this.insert = false
          var params = { name: _this.insertForm.name }
          addNamespace(params).then(response => {
            _this.getAllNsp()
          })
        } else {
          return false
        }
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
        var params = row.Name
        deleteNamespace(params).then(response => {
          _this.getAllNsp()
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
      debugger
      this.namespace = this.$route.params.namespace
      const _this = this
      getNodes().then(response => {
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
      this.$router.push({ name: 'ShowNode', params: { nodeName: nodeName, namespace: this.namespace }})
    },
    handleCommand(command) {
      if (command === 'b') {
        alert('迁移方法')
      }
    },
    nameChange() {
      this.getNsp()
    },
    validateName(rule, value, callback) {
      if (!value) {
        return callback(new Error('name不能为空'))
      }

      getNamespace(value).then(response => {
        if (response.data === undefined) {
          return callback()
        } else {
          return callback(new Error('name重复'))
        }
      })
    }
  }
}
</script>
