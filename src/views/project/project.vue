<template>
  <div v-loading="loading" style="padding:20px">
    <el-dialog :visible.sync="dialogVisible1" width="450px" @close="close">
      <el-header>新建项目</el-header>
      <el-form ref="form" :model="form" label-width="80px" status-icon @submit.native.prevent>
        <el-form-item
          :rules="[
            { required: true, validator: validateName, trigger: 'blur' }
          ]"
          label="项目名称"
          prop="name"
          autocomplete="off">
          <el-input v-model="form.name" @keydown.enter.native="enterFunc"/>
        </el-form-item>
        <el-form-item label="访问级别">
          <el-checkbox-group v-model="form.public">
            <el-checkbox label="公开"/>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button :disabled="form.name.length < 2" type="primary" @click="addFunc('form')">确 定</el-button>
      </span>
    </el-dialog>
    <el-row>
      <el-col :span="13">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          round
          @click="dialogVisible1 = true"
        >新建项目</el-button>
        <el-button
          :disabled="multipleSelection.length == 0"
          size="mini"
          icon="el-icon-delete"
          type="danger"
          round
          @click="deleteFunc"
        >删除</el-button>
      </el-col>
      <el-col :span="4">
        <el-select v-model="plc" size="mini" placeholder="请选择" @change="selchangeFunc">
          <el-option
            v-for="item in options"
            :key="item.value1"
            :label="item.label"
            :value="item.value1"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="name"
          clearable
          size="mini"
          placeholder="过滤项目"
          prefix-icon="el-icon-search"
          @keyup.native="nameChange"
          @clear="selectFunc"
        />
      </el-col>
      <el-col :span="1" style="margin-left:10px">
        <el-button size="mini" icon="el-icon-refresh" circle @click="rr"/>
      </el-col>
    </el-row>

    <el-table
      :data="tableData"
      height="501px"
      style="width:100%"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" sortable type="selection" width="52"/>
      <el-table-column sortable prop="name" label="项目名称" width="130">
        <template slot-scope="scope">
          <a @click="goRouter(scope.row.project_id)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column sortable prop="metadata.public" label="访问级别" width="140">
        <template slot-scope="scope">{{ cg(scope.row.metadata.public) }}</template>
      </el-table-column>
      <el-table-column sortable prop="owner_name" label="角色" width="140">
        <template slot-scope="scope">{{ scope.row.owner_name=="" ? "项目管理员":scope.row.owner_name }}</template>
      </el-table-column>
      <el-table-column sortable prop="repo_count" label="镜像仓库数" width="140"/>
      <el-table-column sortable prop="chart_count" label="Helm Chart 数目" width="160"/>
      <el-table-column sortable prop="creation_time" label="创建时间">
        <template slot-scope="scope">{{ time(scope.row.creation_time) }}</template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            type="warning"
            size="small"
            @click="handleCurrentChange(scope.row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="countPage"
      :page-size="page_size"
      :current-page="currentPage"
      layout="total,prev,pager,next"
      small
      @current-change="handlePageChange"
    />
    <el-dialog :visible.sync="dialogVisible" title="更改访问级别" width="30%">
      <span>
        <el-form :model="form2" label-width="80px">
          <el-form-item label="访问级别">
            <el-checkbox-group v-model="form2.public">
              <el-checkbox label="公开"/>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          :disabled="form2.public == (currentRow.metadata.public=='true'?true:false)"
          type="primary"
          @click="changeFunc"
        >保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getProjects, addProject, deleteProject, changeProject } from '@/api/project'
export default {
  data() {
    return {
      loading: true,
      plc: null,
      name: '',
      tableData: [],
      selection: true,
      multipleSelection: [],
      page_size: 15,
      currentPage: 1,
      form: {
        name: '',
        public: ''
      },
      form2: {
        pid: '',
        public: ''
      },
      dialogVisible: false,
      currentRow: {
        metadata: {
          public: false
        }
      },
      dialogVisible1: false,
      countPage: 0,
      options: [
        {
          value1: null,
          label: '所有项目'
        },
        {
          value1: '0',
          label: '私有项目'
        },
        {
          value1: '1',
          label: '公共项目'
        }
      ],
      flag: 0

    }
  },
  created() {
    this.selectFunc()
  },
  methods: {
    selectFunc: function() {
      debugger
      const _this = this
      var data = {
        name: _this.name,
        public: _this.plc,
        page_size: _this.page_size,
        page: _this.currentPage
      }
      getProjects(data).then(response => {
        // console.log(response)
        _this.tableData = response.data
        _this.countPage = response.total
        _this.loading = false
      })
    },
    selchangeFunc: function() {
      this.selectFunc()
    },
    handleSelectionChange: function(val) {
      debugger
      this.multipleSelection = val
    },
    deleteFunc: function() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _this = this
          var ps = _this.multipleSelection

          ps.forEach((item) => {
            // console.log(item.project_id)
            _this.SingleDelFunc(item.project_id)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    SingleDelFunc: function(project_id) {
      const _this = this
      deleteProject({ id: project_id }).then(response => {
        _this.flag++
        if (_this.flag === this.multipleSelection.length) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }
        _this.selectFunc()
      })
    },
    addFunc: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          debugger
          const _this = this
          var data = this.form
          // console.log(data)
          addProject(data).then(response => {
            _this.$message({
              type: 'success',
              message: '新建成功!'
            })
            _this.dialogVisible1 = false
            _this.form.name = ''
            _this.selectFunc()
            _this.$refs[formName].resetFields()
          })
        } else {
          return false
        }
      })
    },
    handleCurrentChange: function(val) {
      this.currentRow = val
      this.form2.pid = val.project_id
      if (val.metadata.public === 'true') {
        this.form2.public = true
      } else {
        this.form2.public = false
      }
      this.dialogVisible = true
    },
    changeFunc: function() {
      this.$confirm('此操作将修改权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _this = this
        var data = _this.form2
        // console.log(data)
        changeProject(data).then(response => {
          _this.dialogVisible = false
          _this.selectFunc()
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
    cg: function(bool) {
      if (bool === 'true') {
        return '公开'
      } else {
        return '私有'
      }
    },
    time: function(tm) {
      var data = new Date(tm)
      var str =
        data.getFullYear() +
        '/' +
        (data.getMonth() + 1) +
        '/' +
        data.getDate() +
        ' '
      if (data.getHours() < 12) {
        str += '上午' + data.getHours() + ':'
      } else {
        str += '下午' + (data.getHours() - 12) + ':'
      }
      if (data.getSeconds().toString().length === 1) {
        str += '0' + data.getSeconds()
      } else {
        str += data.getSeconds()
      }
      return str
    },
    handlePageChange: function(page) {
      this.currentPage = page
      this.selectFunc()
    },
    rr: function() {
      this.plc = null
      this.name = null
      this.selectFunc()
    },
    nameChange: function() {
      this.selectFunc()
    },
    enterFunc: function(event) {
      if (this.form.name.length < 2) {
        alert('请输入至少两个字符')
      } else {
        this.addFunc()
      }
    },
    goRouter: function(project_id) {
      // console.log
      this.$router.push({ name: 'Repositories', params: { projectId: project_id }})
    },
    validateName: function(rule, value, callback) {
      if (!value) {
        return callback(new Error('项目名称不能为空'))
      }
      var data = {
        name: value
      }
      // setTimeout(() => {
      getProjects(data).then(response => {
        if (response.total === 0) {
          return callback()
        } else {
          for (var project in response.data) {
            if (response.data[project].name === value) {
              return callback(new Error('项目名重复'))
            } else {
              return callback()
            }
          }
        }
      })
      // }, 1000)
    },
    close: function() {
      debugger
      this.name = ''
      this.$refs['form'].resetFields()
    }

  }
}
</script>
