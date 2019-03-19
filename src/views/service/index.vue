<template>
  <el-form>
    <el-header style="margin-top: 25px;">
      <el-dialog :visible.sync="dialogVisible" title="新建服务" width="30%" height="80%" round>
        <hr >
        <el-form :model="selForm" label-width="80px">
          <el-form-item label="服务名称">
            <el-input v-model="selForm.metadata.name" class="searchClass" round/>
          </el-form-item>
          <!-- <el-form-item label="部署组">
            <el-input v-model="selForm.deployGroup" class="searchClass" round/>
          </el-form-item>
          <el-form-item label="服务类型">
            <el-radio-group v-model="selForm.stype">
              <el-radio :label="1">内部服务</el-radio>
              <el-radio :label="2">外部服务</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <hr >
          <el-form-item>
            <el-button size="small" icon="el-icon-close" round @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" size="small" icon="el-icon-check" round @click="newService()">发布</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-row>
        <el-col :span="4">
          <el-button type="primary" round @click="dialogVisible = true">&nbsp;&nbsp;&nbsp;新建&nbsp;&nbsp;&nbsp;</el-button>
        </el-col>
        <el-col :span="3">
          <el-button icon="el-icon-refresh" type="success" round @click="getAllServices">刷新</el-button>
        </el-col>
        <el-col :span="100" style="margin-left: 600px">
          <el-button round @click="clearFilter">清除所有过滤器</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        style="width: 100%"
        highlight-current-row
      >
        <el-table-column prop="metadata.name" label="名称" sortable width="280"/>
        <el-table-column :filters="[{text: '集群IP', value: 'ClusterIP'}, {text: '节点端口', value: 'NodePort'}]" :filter-method="filterTag" prop="spec.type" label="服务类型" sortable width="220" column-key="spec.type">
          <template slot-scope="s">
            {{ rag(s.row.spec.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="spec.clusterIP" label="端点" sortable width="320"/>
        <el-table-column :filters="[{text: 'default', value: 'default'}, {text: 'ingress-nginx', value: 'ingress-nginx'}, {text: 'kube-system', value: 'kube-system'}]" :filter-method="filterHandler" prop="metadata.namespace" label="命名空间" sortable width="258" column-key="metadata.namespace" />
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
export default {
  data() {
    return {
      dialogVisible: false,
      // radio: 1,
      tableData: [],
      sels: [],
      input: '',
      selForm: {
        metadata: {
          name: ''
        }
      },
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
      const _this = this
      var data = {
        namespace: ''
      }
      getServices(data).then(response => {
        _this.tableData = response.data.items
        _this.countPage = response.data.items.length
      })
    },
    newService: function() {
      debugger
      const _this = this
      var data = this.selForm.metadata.name
      console.log(data)
      addServices(data).then(response => {
        _this.$message({
          type: 'success',
          message: '新建成功!'
        })
        _this.dialogVisible = false
        _this.selForm.metadata.name = ''
        _this.getAllServices()
      })
    },
    clearFilter: function() {
      this.$refs.filterTable.clearFilter()
    },
    filterTag: function(value, row) {
      return row.spec.type === value
    },
    filterHandler: function(value, row) {
      return row.metadata.namespace === value
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
