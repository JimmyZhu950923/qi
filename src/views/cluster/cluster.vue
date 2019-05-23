<template>
  <div class="Cluster">
    <el-container>
      <el-main v-loading="loading">
        <el-row>
          <el-col :span="10">
            <el-button type="primary" round size="mini" icon="el-icon-plus" @click="addNew = true">新建</el-button>
            <el-button type="success" size="mini" round icon="el-icon-refresh" @click="getAllCluster">刷新</el-button>
          </el-col>
          <el-dialog
            :visible.sync="addNew"
            title="新建集群"
            width="40%"
          >
            <span>
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="集群名称">
                  <el-input v-model="form.name"/>
                </el-form-item>
                <el-form-item label="集群类型">
                  <el-radio-group v-model="form.resource">
                    <el-radio label="test8067"/>
                    <el-radio label="done02632"/>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addNew = false">取 消</el-button>
              <el-button type="primary" @click="addCluster()">确 定</el-button>
            </span>
          </el-dialog>
          <el-col :span="5" :offset="7">
            <el-input
              v-model="singleForm.name"
              :clearable="true"
              size="mini"
              placeholder="请输入Namespace"
              prefix-icon="el-icon-search"
              @clear="getAllCluster"
              @keyup.native="nameChange"
            />
          </el-col>
        </el-row>
        <el-table
          ref="multipleTable"
          :fit="true"
          :data="tableData"
          stripe
          height="430px"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column label="Name">
            <template slot-scope="scope">
              <font color="#2995d7"><a @click="goNode(scope.row.Name)">{{ scope.row.Name }}</a></font>
            </template>
          </el-table-column>
          <el-table-column prop="DisplayName" label="DisplayName" />
          <el-table-column prop="Namespace" label="Namespace"/>
          <el-table-column :default-sort = "{prop: 'CreateDate', order: 'descending'}" sortable prop="CreateDate" label="CreateDate">
            <template slot-scope="scope">{{ time(scope.row.CreateDate) }}</template>
          </el-table-column>
          <el-table-column prop="ApiService" label="ApiService"/>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="danger" @click="deleteCluster(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination :total="total" layout="total"/>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getAllClu, getClu, insertCluster, deleteClu } from '@/api/cluster'
export default {
  name: 'Cluster',
  data() {
    return {
      form: {
        name: '',
        resource: 'test8067'
      },
      addNew: false,
      tableData: [],
      singleForm: {
        name
      },
      cluster: '',
      loading: true,
      namespace: 'admin',
      total: 0
    }
  },
  created() {
    this.getAllCluster()
  },
  methods: {
    getAllCluster() {
      const _this = this
      getAllClu().then(response => {
        _this.tableData = response.data
        _this.total = response.row
        _this.cluster = JSON.stringify(response.data, null, 4)
        _this.loading = false
      })
    },
    // 根据namespace查询cluster
    getCluster() {
      const _this = this
      _this.tableData = []
      var params = _this.singleForm.name
      getClu(params).then(response => {
        _this.total = response.row
        _this.tableData = response.data
      })
    },
    addCluster() {
      const _this = this
      var params = { 'name': _this.form.name, 'namespace': _this.namespace }
      insertCluster(params).then(response => {
        _this.getAllCluster()
        _this.addNew = false
        if (response.message !== undefined) {
          this.$message({
            type: 'info',
            message: response.message
          })
        }
      })
    },
    deleteCluster(row) {
      debugger
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _this = this
        var params = row.Id
        deleteClu(params).then(response => {
          _this.getAllCluster()
        })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    goNode(name) {
      this.$router.push({ name: 'Node', params: { name: name }})
    },
    time: function(tm) {
      var data = new Date(tm)
      var str =
        data.getFullYear() +
        '-' +
        (data.getMonth() + 1) +
        '-' +
        data.getDate() +
        '    '
      if (data.getHours() < 12) {
        str += '上午' + data.getHours() + ':'
      } else {
        str += '下午' + (data.getHours() - 12) + ':'
      }
      if (data.getMinutes() < 10) {
        str += '0' + data.getMinutes()
      } else {
        str += data.getMinutes()
      }
      return str
    },
    nameChange() {
      console.log('>>>')
      this.getCluster()
    }
  }

}
</script>

