<template>
  <div v-loading="loading">
    <el-dialog :visible.sync="dialogVisible2" @close="re">
      <span>
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="设置负载属性"/>
          <el-step title="选择指定项目"/>
          <el-step title="选择指定镜像"/>
          <el-step title="选择指定标签"/>
        </el-steps>
        <el-main v-loading="loading2">
          <div v-if="active === 0" style="height:243px">
            <el-form ref="deployForm" :model="deploymentForm" label-width="83px">
              <el-form-item
                :rules="[{ required: true, validator: validateName, trigger: 'blur' }]"
                prop="name"
                label="负载名称:"
                autocomplete="off">
                <el-input v-model="deploymentForm.name"/>
              </el-form-item>
              <el-form-item label="副本数量:">
                <el-input-number v-model="num" :min="1" :max="10" label="描述文字"/>
              </el-form-item>
              <el-form-item label="命名空间:">
                <el-select v-model="namespace2" placeholder="请选择">
                  <el-option
                    v-for="item in options4"
                    :key="item.Name"
                    :label="item.Name"
                    :value="item.Name"/>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="active === 1" style="height:243px">
            <el-row>
              <el-col v-for="o in options1" :key="o.name" :span="7" style="margin:0 10px 10px 0">
                <el-card shadow="hover">
                  <el-radio v-model="pro" :label="o" style="width:120px">{{ o.name }}</el-radio>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <div v-if="active === 2" style="height:243px">
            <el-row>
              <el-col v-for="o in options2" :key="o.name" :span="7" style="margin:0 10px 10px 0">
                <el-card shadow="hover">
                  <el-radio v-model="repo" :label="o" style="width:120px">{{ o.name }}</el-radio>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <div v-if="active === 3" style="height:243px">
            <el-row>
              <el-col v-for="o in options3" :key="o.name" :span="7" style="margin:0 10px 10px 0">
                <el-card shadow="hover">
                  <el-radio v-model="tag" :label="o" style="width:120px">{{ o.name }}</el-radio>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <div v-if="active === 4" style="height:243px">
            <el-row type="flex" justify="center">
              <h1>创建成功</h1>
            </el-row>
            <el-row type="flex" justify="center" style="margin-top:50px">
              <el-button type="primary" @click="re">关闭</el-button>
            </el-row>
          </div>
        </el-main>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button-group>
          <el-button v-if="active==1||active==2||active==3" @click="prev">上一步</el-button>
          <el-button v-if="active < 3" :disabled="active == 3" @click="next">下一步</el-button>
        </el-button-group>
        <el-button v-if="active == 3" @click="finish">完成</el-button>
      </span>
    </el-dialog>
    <el-main>
      <el-row>
        <el-col :span="15">
          <el-button type="primary" size="mini" round icon="el-icon-plus" @click="dialogVisible2 = true">新建</el-button>
          <el-button type="primary" size="mini" round icon="el-icon-plus" @click="dialogVisible4 = true">从模板输入框新建</el-button>
        </el-col>
        <el-col :span="7">
          <el-input v-model="flag" size="mini" clearable placeholder="请输入负载名称" class="input-with-select" @clear="selectFunc">
            <el-select slot="prepend" v-model="select" placeholder="命名空间" @change="selectFunc">
              <el-option
                v-for="item in options4"
                :key="item.Name"
                :label="item.Name"
                :value="item.Name"/>
            </el-select>
            <el-button slot="append" size="mini" icon="el-icon-search" @click="singleSelFunc"/>
          </el-input>
        </el-col>
        <el-col :span="1" style="margin-left:10px">
          <el-button size="mini" icon="el-icon-refresh" circle @click="rr"/>
        </el-col>
      </el-row>

      <el-table
        :data="deployment"
        style="width:100%"
        stripe>
        <el-table-column label="名称" prop="metadata.name" width="200" sortable>
          <template slot-scope="scope">
            <a @click="goRouter(scope.row.metadata)">{{ scope.row.metadata.name }}</a>
          </template>
        </el-table-column>
        <el-table-column label="POD" prop="status.readyReplicas" sortable>
          <template slot-scope="scope" sortable>{{ scope.row.status.readyReplicas == undefined?0:scope.row.status.readyReplicas }}/{{ scope.row.status.replicas == undefined?0:scope.row.status.replicas }}</template>
        </el-table-column>
        <el-table-column label="现在" prop="status.updatedReplicas" sortable><template slot-scope="scope">{{ scope.row.status.updatedReplicas==undefined?0:scope.row.status.updatedReplicas }}</template></el-table-column>
        <el-table-column label="可用" prop="status.availableReplicas" sortable>
          <template slot-scope="scope">{{ scope.row.status.availableReplicas == undefined?0:scope.row.status.availableReplicas }}</template>
        </el-table-column>
        <el-table-column :default-sort = "{prop: 'metadata.creationTimestamp', order: 'ascending'}" prop="metadata.creationTimestamp" label="存活时间" sortable>
          <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template>
        </el-table-column>
        <el-table-column label="命名空间" prop="metadata.namespace" sortable/>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="getSingleD(scope.row.metadata)">
              查看
            </el-button>
            <el-button type="warning" size="small" @click="replicasFun(scope.row)">伸缩</el-button>
            <el-button
              size="small"
              type="danger"
              @click="delFunc(scope.row.metadata)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination :total="countPage" layout="total"/>
      </div>
    </el-main>

    <el-dialog :visible.sync="dialogVisible1" :title="currentRow.metadata.name" width="30%">
      <el-form :model="form">
        <el-form-item label="副本数量">
          <el-input-number v-model="form.num" :min="1" :max="10"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button :disabled="currentRow.status.replicas === form.num" type="primary" @click="update">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible3"
      title="修改 部署"
      width="50%">
      <el-input
        :rows="15"
        v-model="deploymentSTR"
        type="textarea"
        placeholder="请输入内容"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="text" @click="dialogVisible3 = false">复 制</el-button>
        <el-button type="text" @click="update1">更 新</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible4" title="填入 YAML 或 JSON 文件内容，将指定资源部署到当前所选命名空间。" width="50%">
      <el-input
        :rows="15"
        v-model="deploymentSTR1"
        type="textarea"
        placeholder="请填入yaml或json"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4 = false">取 消</el-button>
        <el-button :disabled="deploymentSTR1 === ''" type="primary" @click="create">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { list, updateDep, delDep, Single, createD, createDYaml } from '@/api/deployment'
import { getProjects } from '@/api/project'
import { getRepositories } from '@/api/repositories'
import { all } from '@/api/tag'
import { getAllNamespace } from '@/api/namespace'
export default {
  data() {
    return {
      loading: true,
      loading1: false,
      loading2: false,
      deployment: [],
      deploymentSTR: '',
      deploymentSTR1: '',
      form: {
        name: '',
        num: 0
      },
      currentRow: {
        metadata: {
          name: ''
        },
        status: {
          replicas: 0
        }
      },
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      active: 0,
      pro: {},
      repo: {},
      tag: {},
      deploymentForm: {
        name: ''
      },
      num: 1,
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      namespace2: 'default',
      namespace1: '',
      flag: '',
      select: 'default',
      countPage: 0
    }
  },
  created() {
    this.selectFunc()
    this.sel()
    this.selNameSpace()
  },
  methods: {
    selectFunc: function() {
      debugger
      var namespace = this.select
      list({ namespace: namespace }).then(response => {
        this.loading = false
        this.deployment = response.data.items
        this.countPage = response.data.items.length
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
    },
    replicasFun: function(row) {
      this.currentRow = row
      this.form.name = row.metadata.name
      this.form.num = row.status.replicas
      this.namespace1 = row.metadata.namespace
      this.dialogVisible1 = true
    },
    update: function() {
      this.$confirm('此操作将修改副本数量, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading1 = true
        var param = {
          name: this.form.name,
          num: this.form.num,
          namespace: this.namespace1
        }
        updateDep(param).then(response => {
          this.dialogVisible1 = false
          this.loading1 = false
          this.loading = true
          this.selectFunc()
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            this.selectFunc()
          }, 3000)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        })
      })
    },
    update1: function() {
      const _this = this
      var name = _this.deploymentSTR
      var nameSpace = JSON.parse(_this.deploymentSTR).metadata.namespace
      this.$confirm('此操作将作出修改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateDep({ name: name, namespace: nameSpace }).then(response => {
          _this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
      }).catch(() => {
        _this.dialogVisible = false
        this.$message({
          type: 'info',
          message: '取消修改'
        })
      })
    },
    sel: function() {
      if (this.pro.project_id === undefined) {
        getProjects().then(response => {
          this.options1 = response.data
        })
      }
    },
    prev: function() {
      this.active--
    },
    next: function() {
      const _this = this
      if (this.active === 0) {
        _this.$refs['deployForm'].validate((valid) => {
          if (valid) {
            _this.active++
          } else {
            return false
          }
        })
      } else if (this.active === 1) {
        if (_this.pro.project_id !== undefined) {
          _this.loading2 = true
          var param = { project_id: _this.pro.project_id }
          getRepositories(param).then(response => {
            _this.loading2 = false
            if (response.result.length === 0) {
              _this.$message({
                type: 'warning',
                message: '该项目无镜像!'
              })
            } else {
              _this.repo = {}
              _this.options2 = response.result
              _this.active++
            }
          })
        } else {
          _this.$message({
            type: 'warning',
            message: '请选择项目!'
          })
        }
      } else if (this.active === 2) {
        if (_this.repo.name !== undefined) {
          _this.loading2 = true
          all(_this.repo.name).then(response => {
            _this.loading2 = false
            if (response.result.length === 0) {
              _this.$message({
                type: 'warning',
                message: '该镜像无标签!'
              })
            } else {
              _this.tag = {}
              _this.options3 = response.result
              _this.active++
            }
          })
        } else {
          _this.$message({
            type: 'warning',
            message: '请选择镜像!'
          })
        }
      } else {
        this.active++
      }
    },
    finish: function() {
      if (this.tag.name === undefined) {
        this.$message({
          type: 'warning',
          message: '请选择标签!'
        })
      } else {
        this.loading2 = true
        var name = this.deploymentForm.name
        var image = this.repo.name + ':' + this.tag.name
        var num = this.num
        var namespace = this.namespace2
        var param = { name: name, image: image, num: num, namespace: namespace }
        createD(param).then(response => {
          this.loading2 = false
          this.loading = true
          this.selectFunc()
          this.active++
          setTimeout(() => {
            this.selectFunc()
          }, 3000)
        })
      }
    },
    re: function() {
      this.dialogVisible2 = false
      this.namespace2 = 'default'
      this.deploymentForm.name = ''
      this.pro = {}
      this.repo = {}
      this.tag = {}
      this.active = 0
    },
    selNameSpace: function() {
      getAllNamespace().then(response => {
        this.options4 = response.data
      })
    },
    rr: function() {
      this.loading = true
      this.selectFunc()
    },
    delFunc: function(metadata) {
      this.$confirm('此操作将永久删除该负载, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var param = { name: metadata.name, namespace: metadata.namespace }
        delDep(param).then(response => {
          this.loading = true
          this.selectFunc()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          setTimeout(() => {
            this.selectFunc()
          }, 3000)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    singleSelFunc: function() {
      if (this.select === '') {
        this.$message({
          type: 'danger',
          message: '请选择命名空间'
        })
      } else {
        this.loading = true
        this.deployment = []
        Single(this.flag, this.select).then(response => {
          if (response.data !== undefined) {
            this.deployment.push(response.data)
          }
          this.loading = false
        })
      }
    },
    goRouter: function(metadata) {
      this.$router.push({ name: 'Pod1', params: { name: metadata.name, namespace: metadata.namespace }})
    },
    getSingleD(metadata) {
      const _this = this
      Single(metadata.name, metadata.namespace).then(response => {
        _this.dialogVisible3 = true
        _this.deploymentSTR = JSON.stringify(response.data, null, 4)
      })
    },
    create: function() {
      const _this = this
      debugger
      var namespace = this.select
      var deployment = this.deploymentSTR1
      console.log(deployment)
      createDYaml(namespace, deployment).then(response => {
        _this.dialogVisible4 = false
        _this.deploymentSTR1 = ''
        _this.selectFunc()
        _this.$message({
          type: 'success',
          message: '创建成功!'
        })
      })
    },
    validateName: function(rule, value, callback) {
      if (!value) {
        return callback(new Error('负载名称不能为空'))
      }
      Single(value, this.namespace2).then(response => {
        if (response.data !== undefined) {
          if (response.data.metadata.name === value) {
            return callback(new Error(this.namespace2 + '内负载名字重复'))
          }
        } else {
          return callback()
        }
      })
    }
  }
}
</script>
<style>
.input-with-select .el-input-group__prepend {
    width: 100px;
    background-color: #fff;
  }
</style>
