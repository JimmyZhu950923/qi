<template>
  <div>
    <el-main>
      <el-dialog :visible.sync="dialogVisible" title="新建存储" width="35%" height="80%" @close="close('selForm')">
        <el-form ref="selForm" :model="selForm" :rules="rules" status-icon label-width="80px">
          <el-form-item label="存储名称" prop="name">
            <el-input v-model="selForm.name" class="searchClass" auto-complete="off" clearable/>
          </el-form-item>
          <el-form-item label="存储类型" prop="provisioner">
            <el-input v-model="selForm.provisioner" class="searchClass"/>
          </el-form-item>
          <el-form-item label="存储大小">
            <el-input class="searchClass">
              <template slot="append">GB</template>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button :disabled="selForm.name == ''" type="primary" @click="newStorage()">创建</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible2" title="新建存储" width="35%" height="80%" @close="closed()">
        <el-input
          :rows="12"
          v-model="textarea"
          type="textarea"
          clearable
          placeholder="填入 YAML 或 JSON 文件内容，将指定资源部署到当前所选命名空间。"/>
        <span slot="footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button :disabled="textarea.length == 0" type="primary" @click="createService()">发布</el-button>
        </span>
      </el-dialog>
      <el-row>
        <el-col :span="15">
          <el-button type="primary" size="mini" icon="el-icon-plus" round @click="dialogVisible = true">简单新建</el-button>
          <el-button type="primary" size="mini" icon="el-icon-plus" round @click="dialogVisible2 = true">yaml新建</el-button>
        </el-col>
        <el-col :span="7">
          <el-input v-model="name" size="mini" placeholder="请输入名称" class="input-with-select">
            <el-select slot="prepend" v-model="namespace1" size="mini" placeholder="请选择" @change="getAllStorages()">
              <el-option
                v-for="item in options4"
                :key="item.metadata.name"
                :label="item.metadata.name"
                :value="item.metadata.name"
              />
            </el-select>
            <el-button slot="append" size="mini" icon="el-icon-search" @click="nameChange()"/>
          </el-input>
        </el-col>
        <el-col :span="1" style="margin-left:10px">
          <el-button size="small" icon="el-icon-refresh" circle @click="rr()"/>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        highlight-current-row
      >
        <el-table-column prop="metadata.name" label="名称" sortable>
          <template slot-scope="scope">
            <a @click="goIndex2(scope.row.metadata.name, scope.row.metadata.namespace)">{{ scope.row.metadata.name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="parameters.adminSecretNamespace" label="管理者命名空间" sortable />
        <el-table-column prop="provisioner" label="类型" sortable />
        <el-table-column prop="parameters.userSecretNamespace" label="用户命名空间" sortable />
        <el-table-column prop="metadata.creationTimestamp" label="存活时间" sortable width="100">
          <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="165">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="getOneStorage(scope.row.metadata)">
              查看
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="delStorage(scope.row.metadata)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        :current-page="currentPage"
        :total="countPage"
        :page-size="pageSize"
        layout="total,prev,pager,next"
        @current-change="handlePageChange"
      /> -->
      <el-dialog
        :visible.sync="dialogVisible1"
        title="修改存储"
        width="50%">
        <el-input
          :rows="15"
          v-model="storages"
          type="textarea"
          placeholder="请输入内容"/>
        <span slot="footer" class="dialog-footer">
          <el-button type="text" @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="text" @click="dialogVisible1 = false">复 制</el-button>
          <el-button type="text" @click="updateStorage()">更 新</el-button>
        </span>
      </el-dialog>
    </el-main>
  </div>
</template>
<script>
import { getStorages, getSingle, addStorages, createYaml, remove, update } from '@/api/storage'
import { getAllNamespace } from '@/api/namespace'
export default {
  data() {
    return {
      name: '',
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      textarea: '',
      storage: '',
      storages: '',
      tableData: [],
      sels: [],
      input: '',
      selection: true,
      selForm: {
      },
      options4: [],
      namespace: '',
      namespace1: 'default',
      value: '',
      stripe: true
      // pageSize: 20,
      // currentPage: 1,
      // countPage: 0
    }
  },
  created() {
    this.getAllStorages()
    this.selNameSpace()
  },
  methods: {
    getAllStorages: function() {
      const _this = this
      var data = {
        namespace: _this.namespace1
      }
      getStorages(data).then(response => {
        console.log(response)
        _this.tableData = response.data.items
        _this.countPage = response.data.items.length
      })
    },
    getSingleStorage: function() {
      const _this = this
      if (_this.namespace1 === null && _this.name !== '') {
        _this.$message({
          type: 'danger',
          message: '请先选择命名空间'
        })
      } else if (_this.namespace1 !== null && _this.name === '') {
        _this.$message({
          type: 'danger',
          message: '请先填写名称'
        })
      } else {
        var namespace = _this.namespace1
        var name = _this.name
        _this.tableData = []
        getSingle(namespace, name).then(response => {
          console.log(response)
          _this.tableData.push(response.data)
          _this.countPage = 1
        })
      }
    },
    getOneStorage: function(metadata) {
      // debugger
      const _this = this
      var name = metadata.name
      var namespace = metadata.namespace
      getSingle(namespace, name).then(response => {
        // debugger
        _this.dialogVisible1 = true
        _this.storage = response.data
        _this.storages = JSON.stringify(response.data, null, 4)
      })
    },
    newStorage: function() {
      const _this = this
      var name = this.selForm.name
      addStorages(name).then(response => {
        _this.$message({
          type: 'success',
          message: '新建成功!'
        })
        _this.dialogVisible = false
        _this.getAllStorages()
      })
    },
    createStorage: function() {
      // debugger
      const _this = this
      var storage1 = _this.textarea
      var namespace = _this.namespace1
      this.$confirm('此操作将创建, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        createYaml(storage1, namespace).then(response => {
          _this.dialogVisible2 = false
          _this.textarea = ''
          _this.getAllStorages()
          this.$message({
            type: 'success',
            message: '新建成功'
          })
        })
      }).catch(() => {
        _this.dialogVisible2 = false
        this.$message({
          type: 'info',
          message: '取消修改'
        })
      })
    },
    delStorage: function(metadata) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // debugger
          var data = { name: metadata.name, namespace: metadata.namespace }
          remove(data).then(response => {
            this.getAllStorages()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    updateStorage: function() {
      // debugger
      const _this = this
      var name = JSON.parse(_this.storages)
      var namespace = _this.storages.metadata.namespace
      this.$confirm('此操作将作出修改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        update(name, namespace).then(response => {
          _this.dialogVisible1 = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
      }).catch(() => {
        _this.dialogVisible1 = false
        this.$message({
          type: 'info',
          message: '取消修改'
        })
      })
    },
    nameChange: function() {
      this.getAllStorages()
    },
    selNameSpace: function() {
      getAllNamespace().then(response => {
        // debugger
        this.options4 = response.data.items
      })
    },
    rr: function() {
      this.namespace1 = null
      this.name = null
      this.getAllStorages()
    },
    close: function(formName) {
      // debugger
      this.$refs[formName].resetFields()
    },
    closed: function() {
      this.textarea = ''
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
    // handlePageChange: function(page) {
    //   this.currentPage = page
    //   this.getAllStorages()
    // },
    goIndex2(name, namespace) {
      this.$router.push({ name: 'Storage2', params: { name: name, namespace: namespace }})
    }
  }
}
</script>
<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
