<template>
  <div>
    <el-main>
      <el-dialog :visible.sync="dialogVisible" title="新建存储" width="35%" height="80%">
        <el-form :model="selForm" label-width="80px">
          <el-form-item label="存储名称">
            <el-input class="searchClass"/>
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
          <el-button type="primary">创建</el-button>
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
          >&nbsp;&nbsp;删除&nbsp;&nbsp;</el-button>
        </el-col>
        <el-col :span="7">
          <el-input v-model="name" size="mini" placeholder="请输入名称" class="input-with-select">
            <el-select slot="prepend" size="mini" placeholder="请选择" @change="getAllServices">
              <el-option
                v-for="item in options4"
                :key="item.metadata.name"
                :label="item.metadata.name"
                :value="item.metadata.name"
              />
            </el-select>
            <el-button slot="append" size="mini" icon="el-icon-search" @click="nameChange"/>
          </el-input>
        </el-col>
        <el-col :span="1" style="margin-left:10px">
          <el-button size="small" icon="el-icon-refresh" circle @click="rr"/>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange"
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
      // this.getAllServices()
    }
  }
}
</script>
