<template>
  <el-form>
    <el-header style="margin-top: 25px;">
      <el-dialog :visible.sync="dialogVisible" title="查询tag" width="30%" height="80%" center>
        <el-form :model="selForm" label-width="80px">
          <el-form-item label="标签">
            <el-input v-model="selForm.name" placeholder="请输入标签名"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-check" @click="cliSelectFunc">确定</el-button>
            <el-button size="small" icon="el-icon-close" @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-row>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="dialogVisible = true">查询tag</el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            :disabled="sels.length == 0"
            type="danger"
            icon="el-icon-delete"
            @click="SingleDelFunc"
          >删除</el-button>
        </el-col>
        <el-col :span="3">
          <el-button icon="el-icon-refresh" type="success" @click="selectFunc">刷新</el-button>
        </el-col>
        <el-col :span="5" style="margin-left:80px">
          <el-dropdown @command="addAndRemove">
            <el-button :disabled="sels.length != 1" type="primary" @mousedown="labelsFunc">
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
        </el-col>
      </el-row>
    </el-header>
    <el-main>
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
        <el-table-column prop="created" label="创建时间" sortable width="155">
          <template slot-scope="t">{{ time(t.row.created) }}</template>
        </el-table-column>
        <el-table-column prop="docker_version" label="Docker版本" width="138" />
        <el-table-column :show-overflow-tooltip="true" prop="labels" label="标签" width="270">
          <template v-if="scope.row.labels.length!=0" slot-scope="scope">
            <el-tag :color="scope.row.labels[0].color" size="small" style="border-radius:20px;">
              <i class="el-icon-share"/>
              {{ scope.row.labels[0].name }}
            </el-tag>
            <el-popover placement="bottom" width="150px" trigger="click">
              <span v-for="label in scope.row.labels" :key="label">
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
      <el-pagination
        :current-page="currentPage"
        :total="countPage"
        :page-size="pageSize"
        layout="total,prev,pager,next"
        @current-change="handlePageChange"
      />
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
      value5: [],
      stripe: true,
      pageSize: 5,
      currentPage: 1,
      countPage: 0
    }
  },
  created() {
    this.labelsFunc()
  },
  methods: {
    labelsFunc: function() {
      const _this = this
      findLabels(this.listQuery).then(response => {
        _this.options = response.result
      })
    },
    selectFunc: function() {
      const _this = this
      var data = {
        current_page: _this.countPage,
        page_size: _this.pageSize,
        page: _this.currentPage
      }
      all(data).then(response => {
        _this.tableData = response.result
        console.log(_this.tableData)
        _this.countPage = response.result.length
      })
    },
    cliSelectFunc: function() {
      this.currentPage = 1
      this.selectFunc()
      this.dialogVisible = false
    },
    handleSelectionChange: function(val) {
      if (val != null) {
        this.sels = val
        console.log(this.sels)
        this.value5 = val[0].labels
      }
    },
    deleteFunc: function() {
      const _this = this
      var ts = _this.sels
      console.log(ts)
      ts.forEach((item) => {
        console.log(this.name)
        _this.SingleDelFunc(this.name)
      })
    },
    SingleDelFunc: function(name) {
      const _this = this
      var data = _this.sels
      remove(data).then(response => {
        _this.selectFunc()
      })
    },
    handlePageChange: function(page) {
      this.currentPage = page
      this.selectFunc()
    },
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
      const _this = this
      minus(label_id, tag_name).then(response => {
        _this.selectFunc()
      })
    },
    add: function(label_id, tag_name) {
      debugger
      const _this = this
      add(label_id, tag_name).then(response => {
        _this.selectFunc()
      })
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

