<template>
  <el-main v-loading="loading">
    <el-dialog :visible.sync="dialogVisible1" custom-class="dia" @close="re">
      <span>
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="设置负载属性"/>
          <el-step title="选择指定项目"/>
          <el-step title="选择指定镜像"/>
          <el-step title="选择指定标签"/>
        </el-steps>
        <el-main>
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
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"/>
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
              <el-button type="primary" @click="re">返回</el-button>
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
    <el-row>
      <el-col :span="17">
        <el-button size="mini" @click="dialogVisible1 = true">新建</el-button>
      </el-col>
      <el-col :span="4">
        <el-select v-model="namespace1" size="mini" placeholder="请选择">
          <el-option
            v-for="item in options4"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-col>
      <el-col :span="1">
        <el-button size="mini" icon="el-icon-refresh" circle @click="rr"/>
      </el-col>
    </el-row>
    <el-tabs>
      <el-tab-pane label="容器实例">
        <el-table
          :data="podData"
          style="width:100%"
          stripe
        >
          <el-table-column prop="metadata.namespace" label="命名空间" width="130"/>
          <el-table-column prop="metadata.name" label="实例名称" width="305"/>
          <el-table-column prop="status.hostIP" label="READY" width="140">
            <template slot-scope="scope">{{ getReady(scope.row.status.containerStatuses) }}/{{ scope.row.spec.containers.length }}</template>
          </el-table-column>
          <el-table-column prop="status.phase" label="状态" width="130">
            <template slot-scope="scope">
              <font :color="checkStatusFunc(scope.row.status.phase)">{{ scope.row.status.phase }}</font>
            </template>
          </el-table-column>
          <el-table-column prop="metadata.creationTimestamp" label="AGE" width="150">
            <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template>
          </el-table-column>
          <el-table-column prop="status.containerStatuses[0].restartCount" label="重启次数" width="130"/>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="replaceFunc(scope.row.metadata)">
                重建
              </el-button>
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
</template>
<script>
import { getPods, update, delPod } from '@/api/pod'
import { getProjects } from '@/api/project'
import { getRepositories } from '@/api/repositories'
import { all } from '@/api/tag'
import { createD } from '@/api/deployment'
export default {
  data() {
    return {
      podData: [],
      loading: true,
      dialogVisible1: false,
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
      namespace1: 'default',
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
      const _this = this
      var data = {
        nameSpace: _this.namespace1
      }
      getPods(data).then(response => {
        _this.podData = response.data.items
        _this.loading = false
      })
    },
    resetFunc: function(data) {
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
    checkStatusFunc: function(phase) {
      if (phase === 'Running') {
        return '#46AF60'
      } else {
        return '#F56C6C'
      }
    },
    replaceFunc: function(metadata) {
      const _this = this
      update(metadata.name, metadata.namespace).then(response => {
        _this.$message({
          type: 'success',
          message: '重建成功!'
        })
      })
    },
    getReady: function(containerStatuses) {
      if (containerStatuses !== undefined) {
        var flag = 0
        containerStatuses.forEach(function(item) {
          if (item.ready) {
            flag++
          }
        })
        return flag
      }
      return 0
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
          var param = { project_id: _this.pro.project_id }
          getRepositories(param).then(response => {
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
          all(_this.repo.name).then(response => {
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
      debugger
      if (this.tag.name === undefined) {
        this.$message({
          type: 'warning',
          message: '请选择标签!'
        })
      } else {
        var name = this.name
        var image = this.repo.name + ':' + this.tag.name
        var num = this.num
        var namespace = this.namespace
        var param = { name: name, image: image, num: num, namespace: namespace }
        createD(param).then(response => {
          this.active++
        })
      }
    },
    re: function() {
      this.dialogVisible1 = false
      this.name = ''
      this.pro = {}
      this.repo = {}
      this.tag = {}
      this.active = 0
    },
    delFunc: function(metadata) {
      delPod({ name: metadata.name, namespace: metadata.namespace }).then(response => {
        this.selectFunc()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    },
    rr: function() {
      // this.plc = null
      this.namespace1 = 'default'
      this.selectFunc()
    },
    selNameSpace: function() {

    }
  }
}
</script>
<style>
.dia{
  height: 500px
}
</style>
