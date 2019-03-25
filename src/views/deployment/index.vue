<template>
  <div v-loading="loading">
    <el-dialog :visible.sync="dialogVisible2" custom-class="dia" @close="re">
      <span>
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="设置负载属性"/>
          <el-step title="选择指定项目"/>
          <el-step title="选择指定镜像"/>
          <el-step title="选择指定标签"/>
        </el-steps>
        <el-main v-loading="loading2">
          <div v-if="active === 0" style="height:243px">
            <el-form label-width="80px">
              <el-form-item label="负载名称:">
                <el-input v-model="name"/>
              </el-form-item>
              <el-form-item label="副本数量:">
                <el-input-number v-model="num" :min="1" :max="10" label="描述文字"/>
              </el-form-item>
              <el-form-item label="命名空间:">
                <el-select v-model="namespace2" placeholder="请选择">
                  <el-option
                    v-for="item in options4"
                    :key="item.metadata.name"
                    :label="item.metadata.name"
                    :value="item.metadata.name"/>
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
        <el-col :span="23">
          <el-button type="primary" size="mini" @click="dialogVisible2 = true">新建</el-button>
        </el-col>
        <el-col :span="1">
          <el-button size="mini" icon="el-icon-refresh" circle @click="rr"/>
        </el-col>
      </el-row>
      <el-tabs>
        <el-tab-pane label="工作负载">
          <el-table
            :data="deployment"
            style="width:100%"
            stripe>
            <el-table-column label="名称" prop="metadata.name" width="200"/>
            <el-table-column label="POD" prop="status.readyReplicas">
              <template slot-scope="scope">{{ scope.row.status.readyReplicas == undefined?0:scope.row.status.readyReplicas }}/{{ scope.row.status.replicas == undefined?0:scope.row.status.replicas }}</template>
            </el-table-column>
            <el-table-column label="现在" prop=""><template slot-scope="scope">{{ scope.row.status.updatedReplicas==undefined?0:scope.row.status.updatedReplicas }}</template></el-table-column>
            <el-table-column label="可用" prop="status.availableReplicas">
              <template slot-scope="scope">{{ scope.row.status.availableReplicas == undefined?0:scope.row.status.availableReplicas }}</template>
            </el-table-column>
            <el-table-column prop="metadata.creationTimestamp" label="存活时间">
              <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template>
            </el-table-column>
            <el-table-column label="命名空间" prop="metadata.namespace"/>
            <el-table-column label="操作" width="165">
              <template slot-scope="scope">
                <el-button type="warning" size="small" @click="replicas(scope.row)">扩缩容</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="delFunc(scope.row.metadata)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
  </div>
</template>
<script>
import { list, updateDep, delDep } from '@/api/deployment'
import { getProjects } from '@/api/project'
import { getRepositories } from '@/api/repositories'
import { all } from '@/api/tag'
import { createD } from '@/api/deployment'
import { getAllNamespace } from '@/api/namespace'
export default {
  data() {
    return {
      loading: true,
      loading1: false,
      loading2: false,
      deployment: [],
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
      active: 0,
      pro: {},
      repo: {},
      tag: {},
      num: 1,
      name: '',
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      namespace2: 'default'
    }
  },
  created() {
    this.selectFunc()
    this.sel()
    this.selNameSpace()
  },
  methods: {
    selectFunc: function() {
      var namespace = ''
      list({ namespace: namespace }).then(response => {
        this.loading = false
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
    },
    replicas: function(row) {
      this.currentRow = row
      this.form.name = row.metadata.name
      this.form.num = row.status.replicas
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
          num: this.form.num
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
          message: '已取消删除'
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
      if (this.active === 0 && this.name === '') {
        _this.$message({
          type: 'warning',
          message: '请输入负载名称!'
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
        var name = this.name
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
      this.name = ''
      this.pro = {}
      this.repo = {}
      this.tag = {}
      this.active = 0
    },
    selNameSpace: function() {
      getAllNamespace().then(response => {
        debugger
        this.options4 = response.data.items
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
    }
  }
}
</script>
