<template>
  <div class="Show">
    <el-container>
      <el-main>
        <el-dialog :visible.sync="dialogVisible" title="新建服务" width="35%" height="80%" @close="close('selForm')">
          <el-form ref="selForm" :model="selForm" :rules="rules" status-icon label-width="80px">
            <el-form-item label="服务名称" prop="name">
              <el-input v-model="selForm.name" class="searchClass" auto-complete="off" clearable/>
            </el-form-item>
            <el-form-item label="命名空间" prop="namespace1">
              <el-select v-model="selForm.namespace1">
                <el-option
                  v-for="item in options4"
                  :key="item.Name"
                  :label="item.Name"
                  :value="item.Name"/>
              </el-select>
            </el-form-item>
            <el-form-item label="服务类型" prop="type">
              <el-select v-model="selForm.type">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item
              label="端点"
              prop="port">
              <el-input v-model.number="selForm.port" class="searchClass" auto-complete="off" clearable/>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button :disabled="selForm.name == ''" type="primary" @click="newService()">发布</el-button>
          </span>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible2" title="新建服务" width="35%" height="80%" @close="closed()">
          <el-input
            :rows="12"
            v-model="textarea"
            type="textarea"
            placeholder="填入 YAML 或 JSON 文件内容，将指定资源部署到当前所选命名空间。"/>
          <span slot="footer">
            <el-button @click="dialogVisible2 = false">取消</el-button>
            <el-button :disabled="textarea.length == 0" type="primary" @click="createService()">发布</el-button>
          </span>
        </el-dialog>
        <el-row>
          <el-col :span="15">
            <el-button type="primary" size="mini" icon="el-icon-plus" round @click="dialogVisible = true">新建</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" round @click="dialogVisible2 = true">从模板输入框新建</el-button>
          </el-col>
          <el-col :span="7">
            <el-input v-model="name" :clearable="name !== null" size="mini" placeholder="请输入名称" class="input-with-select">
              <el-select slot="prepend" v-model="namespace2" size="mini" placeholder="请选择" @change="getAllServices()">
                <el-option
                  v-for="item in options4"
                  :key="item.Name"
                  :label="item.Name"
                  :value="item.Name"/>
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
          height="501px"
          width="100%"
          highlight-current-row
        >
          <el-table-column prop="metadata.name" label="名称" sortable>
            <template slot-scope="scope">
              <a @click="goIndex2(scope.row.metadata.name, scope.row.metadata.namespace)">{{ scope.row.metadata.name }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="spec.type" label="服务类型" sortable>
            <template slot-scope="s">
              {{ rag(s.row.spec.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="spec.clusterIP" label="IP" sortable/>
          <el-table-column prop="spec.ports[0].port" label="端口">
            <template slot-scope="s">
              <span v-if="s.row.spec.type === 'ClusterIP'" >
                <el-tag v-for="label in s.row.spec.ports" :key="label.a">
                  {{ label.port }}
                </el-tag>
              </span>
              <span v-else-if="s.row.spec.type === 'NodePort'">
                <el-tag v-for="label in s.row.spec.ports" :key="label.a">
                  {{ label.port }}.{{ label.nodePort }}
                </el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column :default-sort = "{prop: 'metadata.creationTimestamp', order: 'descending'}" prop="metadata.creationTimestamp" label="存活时间" sortable>
            <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template>
          </el-table-column>
          <el-table-column prop="metadata.namespace" label="命名空间" sortable/>
          <el-table-column label="操作" width="165">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="getOneService(scope.row.metadata)">
                查看
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="delService(scope.row.metadata)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination :total="countPage" layout="total"/>
        </div>
        <!-- <el-pagination
          :current-page="currentPage"
          :total="countPage"
          :page-size="pageSize"
          layout="total,prev,pager,next"
          @current-change="handlePageChange"
        /> -->
        <el-dialog
          :visible.sync="dialogVisible1"
          title="修改服务"
          width="50%">
          <el-input
            :rows="15"
            v-model="services"
            type="textarea"
            placeholder="请输入内容"/>
          <span slot="footer" class="dialog-footer">
            <el-button type="text" @click="dialogVisible1 = false">取 消</el-button>
            <el-button type="text" @click="dialogVisible1 = false">复 制</el-button>
            <el-button type="text" @click="updateService()">更 新</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getServices, getSingle, addServices, createYaml, remove, update } from '@/api/service'
import { getAllNamespace } from '@/api/namespace'
export default {
  data() {
    var checkPort = (rule, value, callback) => {
      // debugger
      if (!value) {
        callback(new Error('请输入端点'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        callback()
      }
    }
    var checkName = (rule, value, callback) => {
      // debugger
      if (!value) {
        return callback(new Error('请输入名称'))
      }
      var usern = /^[a-zA-Z0-9]{1,}$/
      if (!value.match(usern)) {
        return callback(new Error('服务名称只能由字母数字组成'))
      }
      // debugger
      getSingle(this.selForm.namespace1, value).then(response => {
        // debugger
        if (response.data === undefined) {
          callback()
        } else {
          callback(new Error('服务名称重复'))
        }
      })
    }
    return {
      name: '',
      namespace: '',
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      services: '',
      service: '',
      textarea: '',
      tableData: [],
      sels: [],
      input: '',
      selection: true,
      selForm: {
        name: '',
        namespace1: 'default',
        port: '',
        type: ''
      },
      selForm1: {},
      options: [{
        value: 'ClusterIP',
        label: '集群IP'
      }, {
        value: 'NodePort',
        label: '节点端口'
      }],
      options4: [],
      stripe: true,
      namespace1: '',
      namespace2: 'default',
      value: '',
      // pageSize: 20,
      // currentPage: 1,
      countPage: 0,
      rules: {
        name: [
          { required: true, validator: checkName, trigger: 'blur' }
        ],
        namespace1: [
          { required: true, message: '请必须选择命名空间', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请必须选择服务类型', trigger: 'change' }
        ],
        port: [
          { required: true, validator: checkPort, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getAllServices()
    this.selNameSpace()
  },
  methods: {
    getAllServices: function() {
      // debugger
      const _this = this
      var data = {
        namespace: _this.namespace2
      }
      getServices(data).then(response => {
        console.log(response)
        _this.tableData = response.data.items
        _this.countPage = response.data.items.length
      })
    },
    getSingleService: function() {
      // debugger
      const _this = this
      if (_this.namespace2 === null && _this.name !== '') {
        _this.$message({
          type: 'danger',
          message: '请先选择命名空间'
        })
      } else if (_this.namespace2 !== null && _this.name === '') {
        _this.$message({
          type: 'danger',
          message: '请先填写名称'
        })
      } else {
        var namespace = _this.namespace2
        var name = _this.name
        _this.tableData = []
        getSingle(namespace, name).then(response => {
          console.log(response)
          _this.tableData.push(response.data)
          _this.countPage = 1
        })
      }
    },
    getOneService: function(metadata) {
      // debugger
      const _this = this
      var name = metadata.name
      var namespace = metadata.namespace
      getSingle(namespace, name).then(response => {
        // debugger
        _this.dialogVisible1 = true
        _this.service = response.data
        _this.services = JSON.stringify(response.data, null, 4)
      })
    },
    nameChange: function() {
      this.getSingleService()
    },
    newService: function() {
      // debugger
      const _this = this
      this.$refs['selForm'].validate((valid) => {
        if (valid) {
          var name = _this.selForm.name
          var namespace = _this.selForm.namespace1
          var type = _this.selForm.type
          var port = _this.selForm.port
          addServices(name, namespace, type, port).then(response => {
            _this.$message({
              type: 'success',
              message: '新建成功!'
            })
            _this.dialogVisible = false
            _this.selForm.name = ''
            _this.selForm.namespace1 = ''
            _this.selForm.type = ''
            _this.selForm.port = 0
            this.$refs['selForm'].resetFields()
            _this.getAllServices()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createService: function() {
      // debugger
      const _this = this
      var service1 = _this.textarea
      var namespace = _this.namespace2
      this.$confirm('此操作将创建, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        createYaml(service1, namespace).then(response => {
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
    delService: function(metadata) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // debugger
          var data = { name: metadata.name, namespace: metadata.namespace }
          remove(data).then(response => {
            this.getAllServices()
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
    updateService: function() {
      // debugger
      const _this = this
      var name = JSON.parse(_this.services)
      var namespace = _this.service.metadata.namespace
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
    selNameSpace: function() {
      getAllNamespace().then(response => {
        // debugger
        this.options4 = response.data
      })
    },
    rr: function() {
      this.namespace1 = null
      this.namespace2 = null
      this.name = null
      this.port = null
      this.getAllServices()
    },
    rag: function(data) {
      var result = data
      if (data === 'ClusterIP') {
        result = '集群IP'
      } else if (data === 'NodePort') {
        result = '节点端口'
      }
      return result
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
    close: function(formName) {
      // debugger
      this.$refs[formName].resetFields()
    },
    closed: function() {
      this.textarea = ''
    },
    // handlePageChange: function(page) {
    //   this.currentPage = page
    //   this.getAllServices()
    // },
    goIndex2(name, namespace) {
      this.$router.push({ name: 'Service2', params: { name: name, namespace: namespace }})
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
