<template>
  <el-form>
    <!-- <el-header style="margin-top: 25px;"> -->
    <el-main>
      <el-row>
        <el-col :span="18">
          <el-dropdown @command="addAndRemove">
            <el-button :disabled="sels.length != 1" type="primary" size="mini" round @mousedown="labelsFunc">
              添加标签
              <i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in options"
                :key="item.value"
                :value="item.id"
                :command="item.id"
              >
                <el-tag
                  :color="item.color"
                  size="mini"
                  style="border-radius:20px;">
                  <i class="el-icon-share"/>
                  {{ item.name }}
                </el-tag>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            :disabled="sels.length == 0"
            type="danger"
            size="mini"
            round
            icon="el-icon-delete"
            @click="deleteFunc"
          >&nbsp;&nbsp;删除&nbsp;&nbsp;</el-button>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="name"
            :clearable="true"
            disabled
            size="mini"
            placeholder="过滤项目"
            prefix-icon="el-icon-search"
            @keyup.native="nameChange"
            @clear="select"
          />
        </el-col>
        <el-col :span="1" style="margin-left:10px">
          <el-button size="mini" icon="el-icon-refresh" circle @click="rr"/>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"/>
        <el-table-column prop="name" label="标签" sortable width="100"/>
        <el-table-column prop="size" label="大小" sortable width="100">
          <template slot-scope="s">{{ rag(s.row.size) }}MB</template>
        </el-table-column>
        <el-table-column prop="digest" label="Pull命令" width="200" show-overflow-tooltip/>
        <el-table-column prop="author" label="作者" sortable width="200" show-overflow-tooltip/>
        <el-table-column :default-sort = "{prop: 'created', order: 'descending'}" prop="created" label="创建时间" sortable width="155">
          <template slot-scope="t">{{ time(t.row.created) }}</template>
        </el-table-column>
        <el-table-column prop="docker_version" label="Docker版本"/>
        <el-table-column :show-overflow-tooltip="true" prop="labels" label="标签">
          <template v-if="scope.row.labels.length!=0" slot-scope="scope">
            <el-tag :color="scope.row.labels[0].color" size="small" style="border-radius:20px;">
              <i class="el-icon-share"/>
              {{ scope.row.labels[0].name }}
            </el-tag>
            <el-popover placement="bottom" width="150px" trigger="click">
              <span v-for="label in scope.row.labels" :key="label.repoName">
                <el-tag :color="label.color" size="small" style="border-radius:20px;">
                  <i class="el-icon-share"/>
                  {{ label.name }}
                </el-tag>
              </span>
              <el-button slot="reference">...</el-button>
            </el-popover>
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
    <!-- </el-header> -->
    </el-main>
  </el-form>
</template>

<script>
import { findLabels } from '@/api/tag'
import { all } from '@/api/tag'
import { remove } from '@/api/tag'
import { minus } from '@/api/tag'
import { add } from '@/api/tag'
export default {
  data() {
    return {
      dialogVisible: false,
      selection: true,
      tableData: [],
      sels: [],
      input: '',
      name: '',
      selForm: {
        author: '',
        created: '',
        digest: '',
        docker_verison: '',
        labels: [],
        name: '',
        size: 0
      },
      options: [],
      // value5: [],
      stripe: true,
      // pageSize: 5,
      // currentPage: 1,
      countPage: 0,
      repoName: ''
    }
  },
  created() {
    this.selectFunc()
    this.labelsFunc()
  },
  methods: {
    labelsFunc: function() {
      const _this = this
      var projectId = this.$route.params.projectId
      this.projectId = projectId
      findLabels(this.projectId).then(response => {
        _this.options = response.result
      })
    },
    selectFunc: function() {
      // debugger
      const _this = this
      var repoName = this.$route.params.repoName
      this.repoName = repoName
      all(this.repoName).then(response => {
        _this.tableData = response.result
        console.log(_this.tableData)
        _this.countPage = response.result.length
      })
    },
    nameChange: function() {
      this.select()
    },
    handleSelectionChange: function(val) {
      // debugger
      if (val != null) {
        this.sels = val
        console.log(this.sels)
      }
    },
    deleteFunc: function() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          debugger
          const _this = this
          var ts = _this.sels
          console.log(ts)
          ts.forEach((item) => {
            console.log(item)
            _this.SingleDelFunc(item.name)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    SingleDelFunc: function(name) {
      debugger
      const _this = this
      var repoName = this.$route.params.repoName
      this.repoName = repoName
      remove(this.repoName, name).then(response => {
        _this.selectFunc()
      })
    },
    // handlePageChange: function(page) {
    //   this.currentPage = page
    //   this.selectFunc()
    // },
    rag: function(data) {
      var sum = data / 1024 / 1024
      return sum.toFixed(2)
    },
    time: function(data) {
      var d = new Date(data)
      var h = d.getHours()
      var am = '上午'
      var pm = '下午'
      var times
      if (h > 12) {
        times =
          d.getFullYear() +
          '/' +
          (d.getMonth() + 1) +
          '/' +
          d.getDate() +
          ' ' +
          am +
          h +
          ':' +
          d.getMinutes()
      } else {
        times =
          d.getFullYear() +
          '/' +
          (d.getMonth() + 1) +
          '/' +
          d.getDate() +
          ' ' +
          pm +
          h +
          ':' +
          d.getMinutes()
      }
      return times
    },
    remove: function(label_id, tag_name) {
      debugger
      const _this = this
      var repoName = this.$route.params.repoName
      this.repoName = repoName
      minus(label_id, tag_name, this.repoName).then(response => {
        _this.selectFunc()
      })
    },
    add: function(label_id, tag_name) {
      debugger
      const _this = this
      var repoName = this.$route.params.repoName
      this.repoName = repoName
      add(label_id, tag_name, this.repoName).then(response => {
        _this.selectFunc()
      })
    },
    rr: function() {
      this.name = null
      this.selectFunc()
    },
    addAndRemove: function(selectedId) {
      const _this = this
      var arr = this.sels[0].labels
      var len = arr.length
      var flag = true
      for (var i = 0; i < len; i++) {
        if (selectedId === arr[i].id) {
          flag = false
          this.remove(selectedId, _this.sels[0].name)
          return
        }
      }
      if (flag) {
        this.add(selectedId, _this.sels[0].name)
      }
    }
  }
}
</script>
<style>
.el-dropdown {
  vertical-align: down;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>

