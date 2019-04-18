<template>
  <div class="Show">
    <el-main>
      <el-dialog :visible.sync="dialogVisible2" title="新建配置" width="35%" height="80%" @close="closed()">
        <el-input
          :rows="12"
          v-model="textarea"
          type="textarea"
          clearable
          placeholder="填入 YAML 或 JSON 文件内容，将指定资源部署到当前所选命名空间。"/>
        <span slot="footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button :disabled="textarea.length == 0" type="primary" @click="createSecret()">发布</el-button>
        </span>
      </el-dialog>
      <el-row>
        <el-col :span="15">
          <el-button type="primary" size="mini" icon="el-icon-plus" round @click="dialogVisible2 = true">yaml新建</el-button>
        </el-col>
        <el-col :span="7">
          <el-input v-model="name" size="mini" clearable placeholder="请输入名称" class="input-with-select">
            <el-select slot="prepend" v-model="namespace" size="mini" placeholder="请选择" @change="getAllSecrets()">
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
          <el-button size="mini" icon="el-icon-refresh" circle @click="rr()"/>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        highlight-current-row
      >
        <el-table-column prop="metadata.name" label="名称" sortable show-overflow-tooltip>
          <template slot-scope="scope">
            <a @click="goIndex2(scope.row.metadata.name, scope.row.metadata.namespace)">{{ scope.row.metadata.name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="metadata.labels" label="标签" show-overflow-tooltip>
          <template slot-scope="s">
            <el-tag v-for="(label,value) in s.row.metadata.labels" :key="label.a">
              {{ value }}:{{ label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" sortable show-overflow-tooltip/>
        <el-table-column prop="metadata.creationTimestamp" label="存活时间" sortable width="100">
          <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template>
        </el-table-column>
        <el-table-column prop="metadata.namespace" label="命名空间" sortable width="150"/>
        <el-table-column label="操作" width="165">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="getOneSecret(scope.row.metadata)">
              查看
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="delSecret(scope.row.metadata)">
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
        title="修改保密"
        width="50%">
        <el-input
          :rows="15"
          v-model="configs"
          type="textarea"
          placeholder="请输入内容"/>
        <span slot="footer" class="dialog-footer">
          <el-button type="text" @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="text" @click="dialogVisible1 = false">复 制</el-button>
          <el-button type="text" @click="updateSecret()">更 新</el-button>
        </span>
      </el-dialog>
    </el-main>
  </div>
</template>

<script>
import { getSecrets, getSingle, remove, update, createYaml } from '@/api/secret'
import { getAllNamespace } from '@/api/namespace'
export default {
  data() {
    return {
      textarea: '',
      dialogVisible1: false,
      dialogVisible2: false,
      configs: '',
      config: '',
      options4: [],
      name: '',
      namespace: 'default',
      tableData: [],
      selection: true,
      stripe: true,
      pageSize: 20,
      currentPage: 1,
      countPage: 0
    }
  },
  created() {
    this.getAllSecrets()
    this.selNameSpace()
  },
  methods: {
    getAllSecrets: function() {
      // debugger
      const _this = this
      var data = {
        namespace: _this.namespace
      }
      getSecrets(data).then(response => {
        console.log(response)
        _this.tableData = response.data.items
        _this.countPage = response.data.items.length
      })
    },
    getSingleSecret: function() {
      // debugger
      const _this = this
      if (_this.namespace === '' || _this.name === '') {
        _this.$message({
          type: 'danger',
          message: '请先选择命名空间或者输入名称'
        })
      } else {
        var namespace = _this.namespace
        var name = _this.name
        _this.tableData = []
        getSingle(namespace, name).then(response => {
          console.log(response)
          _this.tableData.push(response.data)
          _this.countPage = 1
        })
      }
    },
    getOneSecret: function(metadata) {
      // debugger
      const _this = this
      var name = metadata.name
      var namespace = metadata.namespace
      getSingle(namespace, name).then(response => {
        // debugger
        _this.dialogVisible1 = true
        _this.config = response.data
        _this.configs = JSON.stringify(response.data, null, 4)
      })
    },
    createSecret: function() {
      // debugger
      const _this = this
      var secret1 = _this.textarea
      var namespace = _this.namespace
      this.$confirm('此操作将创建, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        createYaml(secret1, namespace).then(response => {
          _this.dialogVisible2 = false
          _this.textarea = ''
          _this.getAllServices()
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
    delSecret: function(metadata) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // debugger
          var data = { name: metadata.name, namespace: metadata.namespace }
          remove(data).then(response => {
            this.getAllSecrets()
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
    updateSecret: function() {
      // debugger
      const _this = this
      var name = JSON.parse(_this.configs)
      var namespace = _this.config.metadata.namespace
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
      this.getSingleSecret()
    },
    selNameSpace: function() {
      // debugger
      getAllNamespace().then(response => {
        // debugger
        this.options4 = response.data.items
      })
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
    rr: function() {
      this.namespace = null
      this.name = null
      this.getAllSecrets()
    },
    // handlePageChange: function(page) {
    //   this.currentPage = page
    //   this.getAllSecrets()
    // },
    goIndex2(name, namespace) {
      this.$router.push({ name: 'Secret2', params: { name: name, namespace: namespace }})
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
