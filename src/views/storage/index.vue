<template>
  <el-form>
    <el-header style="margin-top: 25px;">
      <el-dialog :visible.sync="dialogVisible" title="新建存储" width="30%" height="80%" round>
        <hr >
        <el-form :model="selForm" label-width="80px">
          <el-form-item label="存储名称">
            <el-input class="searchClass" round/>
          </el-form-item>
          <el-form-item label="存储类型">
            <el-input class="searchClass" round/>
          </el-form-item>
          <el-form-item label="存储大小">
            <el-input class="searchClass" round>
              <template slot="append">GB</template>
            </el-input>
          </el-form-item>
          <hr >
          <el-form-item>
            <el-button size="small" icon="el-icon-close" round @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" size="small" icon="el-icon-check" round>创建</el-button>
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
        <el-table-column prop="" label="名称" sortable width="185"/>
        <el-table-column prop="" label="命名空间" sortable width="220"/>
        <el-table-column prop="" label="卷" sortable width="320"/>
        <el-table-column prop="" label="存储类别" sortable width="210"/>
        <el-table-column prop="" label="命名空间" sortable width="220"/>
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
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      sels: [],
      input: '',
      selForm: {
      },
      stripe: true,
      value: '',
      pageSize: 20,
      currentPage: 1,
      countPage: 0
    }
  },
  created() {
  },
  methods: {
    rr: function() {
      this.plc = null
      this.name = null
      // this.getAllServices()
    },
    handleSelectionChange: function(val) {
      if (val != null) {
        this.sels = val
        console.log(this.sels)
      }
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
