<template>
  <el-form>
    <el-header style="margin-top: 25px;">
      <el-dialog :visible.sync="dialogVisible" title="新建服务" width="30%" height="80%">
        <hr >
        <el-form :model="selForm" label-width="80px">
          <el-form-item label="服务名称">
            <el-input v-model="selForm.name" class="searchClass"/>
          </el-form-item>
          <el-form-item label="命名空间:">
            <el-select v-model="selForm.namespace">
              <el-option
                v-for="item in options4"
                :key="item.metadata.name"
                :label="item.metadata.name"
                :value="item.metadata.name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="服务类型">
            <el-select v-model="selForm.type">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Port">
            <el-input v-model="selForm.port" class="searchClass"/>
          </el-form-item>
          <hr >
          <el-form-item>
            <el-button size="mini" icon="el-icon-close" @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" size="mini" icon="el-icon-check" @click="newService()">发布</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-row>
        <el-col :span="3">
          <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">&nbsp;&nbsp;新建&nbsp;&nbsp;</el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            :disabled="sels.length == 0"
            type="danger"
            icon="el-icon-delete"
            @click="delService"
          >&nbsp;&nbsp;删除&nbsp;&nbsp;</el-button>
        </el-col>
        <el-col :span="4" style="margin-left:550px">
          <el-select v-model="namespace1" size="mini" @change="getAllServices">
            <el-option
              v-for="item in options4"
              :key="item.metadata.name"
              :label="item.metadata.name"
              :value="item.metadata.name"
            />
          </el-select>
        </el-col>
        <el-col :span="1" style="margin-left:10px">
          <el-button size="mini" icon="el-icon-refresh" circle @click="rr"/>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"/>
        <el-table-column prop="metadata.name" label="名称" sortable width="280"/>
        <el-table-column prop="spec.type" label="服务类型" sortable>
          <template slot-scope="s">
            {{ rag(s.row.spec.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="spec.clusterIP" label="端点" sortable/>
        <el-table-column prop="metadata.namespace" label="命名空间" sortable/>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :total="countPage"
        :page-size="pageSize"
        layout="total,prev,pager,next"
        @current-change="handlePageChange"
      />
  </el-main></el-form>
</template>

<script>
import { getServices } from '@/api/service'
import { addServices } from '@/api/service'
import { remove } from '@/api/service'
import { getAllNamespace } from '@/api/namespace'
export default {
  data() {
    return {
      name: '',
      dialogVisible: false,
      tableData: [],
      sels: [],
      input: '',
      selection: true,
      selForm: {
        metadata: {
          name: '',
          namespace: ''
        },
        spec: {
          ports: [{
            port: 0
          }],
          type: ''
        }
      },
      options: [{
        value: 'ClusterIP',
        label: '集群IP'
      }, {
        value: 'NodePort',
        label: '节点端口'
      }],
      options4: [],
      stripe: true,
      namespace: '',
      namespace1: '',
      value: '',
      pageSize: 20,
      currentPage: 1,
      countPage: 0
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
        namespace: _this.namespace1
      }
      getServices(data).then(response => {
        console.log(response)
        _this.tableData = response.data.items
        _this.countPage = response.data.items.length
      })
    },
    newService: function() {
      debugger
      const _this = this
      var name = this.selForm.name
      var namespace = this.selForm.namespace
      var type = this.selForm.type
      var port = this.selForm.port
      addServices(name, namespace, type, port).then(response => {
        _this.$message({
          type: 'success',
          message: '新建成功!'
        })
        _this.dialogVisible = false
        _this.selForm.name = ''
        _this.selForm.namespace = ''
        _this.selForm.type = ''
        _this.selForm.port = 0
        _this.getAllServices()
      })
    },
    delService: function() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // debugger
          const _this = this
          var ts = _this.sels
          console.log(ts)
          ts.forEach((item) => {
            console.log(item)
            _this.SingleDelFunc(item.metadata.name, item.metadata.namespace)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    SingleDelFunc: function(name, namespace) {
      // debugger
      const _this = this
      remove(name, namespace).then(response => {
        _this.$message({
          type: 'success',
          message: '删除成功!'
        })
        _this.getAllServices()
      })
    },
    handleSelectionChange: function(val) {
      if (val != null) {
        this.sels = val
        console.log(this.sels)
      }
    },
    selNameSpace: function() {
      getAllNamespace().then(response => {
        debugger
        this.options4 = response.data.items
      })
    },
    rr: function() {
      this.namespace = null
      this.namespace1 = null
      this.name = null
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
    handlePageChange: function(page) {
      this.currentPage = page
      this.getAllServices()
    }
  }
}
</script>
