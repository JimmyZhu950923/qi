<template>
  <div>
    <el-main>
      <el-dialog :visible.sync="dialogVisible" title="新建存储" width="35%" height="80%">
        <el-form :model="selForm" label-width="80px">
          <el-form-item label="存储名称">
            <el-input v-model="selForm.name" class="searchClass"/>
          </el-form-item>
          <el-form-item label="存储类型">
            <el-input class="searchClass"/>
          </el-form-item>
          <el-form-item label="存储大小">
            <el-input class="searchClass">
              <template slot="append">GB</template>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="newStorage()">创建</el-button>
        </span>
      </el-dialog>
      <el-row>
        <el-col :span="15">
          <el-button type="primary" size="mini" icon="el-icon-plus" round @click="dialogVisible = true">&nbsp;&nbsp;新建&nbsp;&nbsp;</el-button>
          <el-button
            :disabled="sels.length == 0"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            round
            @click="delStorage()"
          >&nbsp;&nbsp;删除&nbsp;&nbsp;</el-button>
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
        @selection-change="handleSelectionChange()"
      >
        <el-table-column type="selection" width="40"/>
        <el-table-column prop="" label="名称" sortable width="185"/>
        <el-table-column prop="" label="命名空间" sortable width=""/>
        <el-table-column prop="" label="卷" sortable width=""/>
        <el-table-column prop="" label="存储类别" sortable width=""/>
        <el-table-column prop="" label="命名空间" sortable width=""/>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :total="countPage"
        :page-size="pageSize"
        layout="total,prev,pager,next"
        @current-change="handlePageChange"
      />
    </el-main>
  </div>
</template>

<script>
import { getStorages, getSingle, addStorages, remove } from '@/api/storage'
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
      },
      options4: [],
      namespace: '',
      namespace1: '',
      value: '',
      stripe: true,
      pageSize: 20,
      currentPage: 1,
      countPage: 0
    }
  },
  created() {
    this.getAllStorages()
    this.selNameSapce()
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
      if (_this.namespace1 === '') {
        _this.$message({
          type: 'danger',
          message: '请先选择命名空间'
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
    delStorage: function() {
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
            _this.SingleDelFunc()
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
        _this.getAllStorages()
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
      this.plc = null
      this.name = null
      this.getAllStorages()
    },
    handleSelectionChange: function(val) {
      if (val != null) {
        this.sels = val
        console.log(this.sels)
      }
    },
    handlePageChange: function(page) {
      this.currentPage = page
      this.getAllStorages()
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
