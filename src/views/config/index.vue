<template>
  <div>
    <el-main>
      <el-row>
        <el-col :span="7">
          <el-input v-model="name" size="mini" clearable placeholder="请输入名称" class="input-with-select">
            <el-select slot="prepend" v-model="namespace2" size="mini" placeholder="请选择" @change="getAllConfigs()">
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
          <el-button size="mini" icon="el-icon-refresh" circle @click="rr()"/>
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
        <el-table-column prop="" label="名称" sortable/>
        <el-table-column prop="" label="类型"/>
        <el-table-column prop="" label="命名空间" sortable/>
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
import { getConfigs } from '@/api/config'
import { getAllNamespace } from '@/api/namespace'
export default {
  data() {
    return {
      options4: [],
      name: '',
      namespace2: 'default',
      tableData: [],
      selection: true,
      stripe: true,
      pageSize: 20,
      currentPage: 1,
      countPage: 0
    }
  },
  created() {
    this.getAllConfigs()
    this.selNameSpace()
  },
  methods: {
    getAllConfigs: function() {
      // debugger
      const _this = this
      var data = {
        namespace: _this.namespace2
      }
      getConfigs(data).then(response => {
        console.log(response)
        _this.tableData = response.data.items
        _this.countPage = response.data.items.length
      })
    },
    nameChange: function() {
      this.getAllConfigs()
    },
    selNameSpace: function() {
      // debugger
      getAllNamespace().then(response => {
        // debugger
        this.options4 = response.data.items
      })
    },
    rr: function() {
      this.namespace2 = null
      this.name = null
      this.getAllConfigs()
    },
    handleSelectionChange: function(val) {
      if (val != null) {
        this.sels = val
        console.log(this.sels)
      }
    },
    handlePageChange: function(page) {
      this.currentPage = page
      this.getAllConfigs()
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
