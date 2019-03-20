<template>
  <el-form>
    <el-header style="margin-top: 25px;">
      <el-dialog :visible.sync="dialogVisible" title="新建服务" width="30%" height="80%" round>
        <hr >
        <el-form :model="selForm" label-width="80px">
          <el-form-item label="服务名称">
            <el-input v-model="selForm.name" class="searchClass" round/>
          </el-form-item>
          <el-form-item label="命名空间">
            <el-input v-model="selForm.namespace" class="searchClass" round/>
          </el-form-item>
          <el-form-item label="Port">
            <el-input v-model="selForm.port" class="searchClass" round/>
          </el-form-item>
          <hr >
          <el-form-item>
            <el-button size="small" icon="el-icon-close" round @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" size="small" icon="el-icon-check" round @click="newService()">发布</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-row>
        <el-col :span="3">
          <el-button type="primary" icon="el-icon-plus" round @click="dialogVisible = true">&nbsp;&nbsp;新建&nbsp;&nbsp;</el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            :disabled="sels.length == 0"
            type="danger"
            icon="el-icon-delete"
            round
            @click="delService"
          >&nbsp;&nbsp;删除&nbsp;&nbsp;</el-button>
        </el-col>
        <el-col :span="4" style="margin-left:550px">
          <el-select v-model="plc" size="small" placeholder="请选择" @change="selchangeFunc">
            <el-option
              v-for="item in options"
              :key="item.value1"
              :label="item.label"
              :value="item.value1"
            />
          </el-select>
        </el-col>
        <el-col :span="1" style="margin-left:10px">
          <el-button size="small" icon="el-icon-refresh" circle @click="rr"/>
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
        <el-table-column prop="spec.type" label="服务类型" sortable width="220">
          <template slot-scope="s">
            {{ rag(s.row.spec.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="spec.clusterIP" label="端点" sortable width="320"/>
        <el-table-column prop="metadata.namespace" label="命名空间" sortable width="258"/>
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
export default {
  data() {
    return {
      plc: null,
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
          }]
        }
      },
      options: [
        {
          value1: null,
          label: '所有项目'
        },
        {
          value1: 'default',
          label: 'default'
        },
        {
          value1: 'ingress-nginx',
          label: 'ingress-nginx'
        },
        {
          value1: 'kube-system',
          label: 'kube-system'
        }
      ],
      stripe: true,
      value: '',
      pageSize: 20,
      currentPage: 1,
      countPage: 0
    }
  },
  created() {
    this.getAllServices()
  },
  methods: {
    getAllServices: function() {
      // debugger
      const _this = this
      var data = {
        namespace: _this.plc
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
      var port = this.selForm.port
      addServices(name, namespace, port).then(response => {
        _this.$message({
          type: 'success',
          message: '新建成功!'
        })
        _this.dialogVisible = false
        _this.selForm.name = ''
        _this.selForm.namespace = ''
        _this.selForm.port = 0
        _this.getAllServices()
      })
    },
    delService: function() {
      debugger
      const _this = this
      var ts = _this.sels
      console.log(ts)
      ts.forEach((item) => {
        console.log(item)
        _this.SingleDelFunc(item.metadata.name, item.metadata.namespace)
      })
    },
    SingleDelFunc: function(name, namespace) {
      debugger
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
    selchangeFunc: function() {
      debugger
      this.getAllServices()
    },
    nameChange: function() {
      debugger
      console.log(this.name)
      this.getAllServices()
    },
    rr: function() {
      this.plc = null
      this.name = null
      this.getAllServices()
    },
    rag: function(data) {
      var result = data
      if (data === 'ClusterIP') {
        result = '集群IP'
      } else {
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
<style>
.searchClass{
  border: 1px solid #c5c5c5;
  border-radius: 20px;
  background: #f4f4f4;
}
.searchClass .el-input-group__prepend {
  border: none;
  background-color: transparent;
  padding: 0 10px 0 30px;
}
.searchClass .el-input-group__append {
  border: none;
  background-color: transparent;
}
.searchClass .el-input__inner {
  height: 36px;
  line-height: 36px;
  border: none;
  background-color: transparent;
}
.searchClass .el-icon-search{
  font-size: 16px;
}
.searchClass .centerClass {
  height: 100%;
  line-height: 100%;
  display: inline-block;
  vertical-align: middle;
  text-align: right;
}
.searchClass .line {
  width: 1px;
  height: 26px;
  background-color: #c5c5c5;
  margin-left: 14px;
}
.searchClass:hover{
  border: 1px solid #D5E3E8;
  background: #fff;
}
.searchClass:hover .line {
  background-color: #D5E3E8;
}
.searchClass:hover .el-icon-search{
  color: #409eff;
  font-size: 16px;
}
</style>
