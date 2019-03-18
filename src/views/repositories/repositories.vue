<template>
  <div class="Repositories">
    <el-container>
      <el-main>
        <el-tabs v-model="activeName">
          <el-tab-pane label="镜像仓库" name="first">
            <el-row>
              <el-col :span="14">
                <el-button type="primary" round size="mini" @click="selectFunc">查询</el-button>
                <el-button :disabled="sels1.length !=1" size="mini" type="danger" round @click="deleteFunc">删除</el-button>
              </el-col>
              <el-col :span="2" :offset="2">
                <el-popover
                  placement="bottom"
                  trigger="click">
                  <h3>推送镜像
                    <el-tooltip class="item" effect="dark" content="推送一个镜像到当前项目的参考命令。" placement="top-start">
                      <i class="el-icon-warning"/>
                    </el-tooltip>
                  </h3>
                  <div>在项目中标记镜像：</div>
                  <p><b>docker tag SOURCE_IMAGE[:TAG] kube.gwunion.cn/{{ proName }}/IMAGE[:TAG]</b></p>
                  <div>推送镜像到当前项目：</div>
                  <p><b>docker push kube.gwunion.cn/{{ proName }}/IMAGE[:TAG]</b></p>
                  <el-button slot="reference" size="mini" round>推送镜像</el-button>
                </el-popover>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="name1"
                  size="mini"
                  placeholder="过滤镜像仓库"
                  prefix-icon="el-icon-search"
                  @keyup.native="nameChange1"
                />
              </el-col>
            </el-row>
            <el-table
              ref="multipleTable"
              :fit="true"
              :data="tableData1"
              stripe
              height="430px"
              tooltip-effect="dark"
              style="width: 100%"

              @selection-change="selectionChange1"
            >
              <el-table-column type="selection" width="80"/>
              <el-table-column prop="name" label="名称" sortable>
                <template slot-scope="scope">
                  <a @click="goTag(project_id,scope.row.name)">{{ scope.row.name }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="tags_count" label="标签数" sortable/>
              <el-table-column prop="pull_count" label="下载数" sortable/>
            </el-table>
            <div class="block">
              <el-pagination
                :current-page.sync="currentPage1"
                :page-size="page_size"
                :total="total"
                layout="total, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="CurrentChange"
              />
            </div>
          </el-tab-pane>
          <!-- 标签页 -->
          <el-tab-pane label="标签" name="second">
            <el-row>
              <el-col :span="18">
                <el-button class="button" type="success" size="mini" round @click="single = true">编号查询</el-button>
                <el-button class="button" type="primary" size="mini" round @click="selectLabelFunc">查询</el-button>
                <el-button class="button" type="info" size="mini" round @click="dialogVisible=true">添加</el-button>
                <el-button
                  :disabled="sels2.length!=1"
                  class="button"
                  type="warning"
                  size="mini"
                  round
                  @click="update=true"
                >修改</el-button>
                <el-button
                  :disabled="sels2.length!=1"
                  class="button"
                  type="danger"
                  size="mini"
                  round
                  @click="deleteLabelFunc"
                >删除</el-button>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-model="name2"
                  size="mini"
                  placeholder="过滤标签"
                  prefix-icon="el-icon-search"
                  @keyup.native="nameChange2"
                />
              </el-col>
              <el-dialog :visible.sync="single" title="查询单个标签" width="30%" center>
                <el-form :label-position="labelPosition" :model="singleForm" label-width="80px">
                  <el-form-item label="标签编号">
                    <el-input v-model="singleForm.id"/>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="single = false">取 消</el-button>
                  <el-button type="primary" @click="FindSingle">确 定</el-button>
                </span>
              </el-dialog>
              <el-dialog :visible.sync="dialogVisible" title="添加标签" width="30%" center>
                <el-form :label-position="labelPosition" :model="formLabelAlign" label-width="80px">
                  <el-form-item label="标签名字">
                    <el-input v-model="formLabelAlign.name"/>
                  </el-form-item>
                  <el-form-item label="标签颜色">
                    <div class="block">
                      <el-color-picker v-model="formLabelAlign.color" :predefine="predefineColors"/>
                    </div>
                  </el-form-item>
                  <el-form-item label="标签描述">
                    <el-input v-model="formLabelAlign.description"/>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addLabel">确 定</el-button>
                </span>
              </el-dialog>
              <el-dialog :visible.sync="update" title="修改标签" width="30%" center>
                <el-form
                  :label-position="labelPosition"
                  :model="updateformLabelAlign"
                  label-width="80px"
                >
                  <el-form-item label="标签名字">
                    <el-input v-model="updateformLabelAlign.name"/>
                  </el-form-item>
                  <el-form-item label="标签颜色">
                    <div class="block">
                      <el-color-picker
                        v-model="updateformLabelAlign.color"
                        :predefine="predefineColors"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="标签描述">
                    <el-input v-model="updateformLabelAlign.description"/>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="update = false">取 消</el-button>
                  <el-button type="primary" @click="updateLabel">确 定</el-button>
                </span>
              </el-dialog>
              <el-table
                ref="multipleTable"
                :fit="true"
                :data="tableData2"
                stripe
                height="430px"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="selectionChange2"
              >
                <el-table-column type="selection" width="80"/>
                <el-table-column prop="id" label="编号" sortable/>
                <el-table-column prop="color" label="标签" sortable>
                  <template slot-scope="scope">
                    <el-tag
                      :color="scope.row.color"
                      size="mini"
                      style="font-weight:900;font-size:13px;color: white;border-radius: 20px;"
                    > {{ scope.row.name }} </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" sortable/>
                <el-table-column prop="creation_time" label="创建时间" sortable/>
              </el-table>
              <div class="block">
                <el-pagination :total="total_label" layout="total"/>
              </div>
          </el-row></el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { getRepositories, deleteRepositories, pageChange, getProject } from '@/api/repositories'
import { getLabels, getLabelById, insertLabel, updateLabel, deleteLabel } from '@/api/label'
export default {
  name: 'Repositories',
  data() {
    return {
      // 预定颜色
      predefineColors: [
        '#000000',
        '#61717D',
        '#737373',
        '#80746D',
        '#FFFFFF',
        '#A9B6BE',
        '#DDDDDD',
        '#BBB3A9',
        '#0065AB',
        '#343DAC',
        '#781DA0',
        '#9B0D54',
        '#0095D3',
        '#9DA3DB',
        '#BE90D6',
        '#F1428A',
        '#1D5100',
        '#006668',
        '#006690',
        '#004A70',
        '#48960C',
        '#00AB9A',
        '#00B7D6',
        '#0081A7',
        '#C92100',
        '#CD3517',
        '#C25400',
        '#D28F00',
        '#F52F52',
        '#FF5501',
        '#F57600',
        '#FFDC0B'
      ],
      labelPosition: 'right',
      // 新建表单
      formLabelAlign: {
        color: null,
        creation_time: null,
        deleted: false,
        description: null,
        id: null,
        name: null,
        project_id: null,
        scope: null,
        update_time: null
      },
      // 修改表单
      updateformLabelAlign: {
        color: null,
        creation_time: null,
        deleted: false,
        description: null,
        id: null,
        name: null,
        project_id: null,
        scope: null,
        update_time: null
      },
      // 单个查询表单
      singleForm: {
        color: null,
        creation_time: null,
        deleted: false,
        description: null,
        id: null,
        name: null,
        project_id: null,
        scope: null,
        update_time: null
      },
      dialogVisible: false,
      update: false,
      single: false,
      tableData1: [],
      tableData2: [],
      formLabelWidth: '120px', // 弹框样式
      sels1: [], // 选中的行
      sels2: [],
      name1: '',
      name2: '',
      activeName: 'first',
      restaurants: [],
      currentPage1: 1,
      page: 0,
      page_size: 15,
      total: 0,
      total_label: 0,
      project_id: 0,
      proName: ''
    }
  },
  created() {
    this.selectFunc()
    this.selectLabelFunc()
    this.getProjectName()
  },
  methods: {
    // id查询项目
    getProjectName() {
      debugger
      const _this = this
      var id = this.project_id
      getProject(id).then(response => {
        _this.proName = response.data.name
      })
    },
    // 查询所有
    selectLabelFunc() {
      const _this = this
      var projectId = this.$route.params.projectId
      this.project_id = projectId
      var params = { name: this.name2, project_id: projectId }
      getLabels(params).then(respones => {
        _this.tableData2 = respones.json
        for (var i = 0; i < _this.tableData2.length; i++) {
          var str = _this.tableData2[i].creation_time
          var date = _this.time(str)
          _this.tableData2[i].creation_time = date
        }
        _this.total_label = respones.total
      })
    },
    // 查询单个
    FindSingle() {
      const _this = this
      _this.single = false
      var params = { id: this.singleForm.id }
      getLabelById(params).then(response => {
        _this.tableData2 = []
        if (response.result == null) {
          // 没有查到数据
          _this.total_label = 0
        } else {
          // 查到数据
          _this.tableData2.push(response.result)
          for (var i = 0; i < _this.tableData2.length; i++) {
            var str = _this.tableData2[i].creation_time
            var date = _this.time(str)
            _this.tableData2[i].creation_time = date
          }
          _this.total_label = 1
        }
      })
    },

    addLabel() {
      const _this = this
      this.dialogVisible = false
      var params = this.formLabelAlign
      insertLabel(params).then(response => {
        _this.selectLabelFunc()
        this.formLabelAlign = {}
      })
    },
    updateLabel() {
      // debugger
      const _this = this

      this.update = false
      var data = this.updateformLabelAlign
      updateLabel(data).then(respones => {
        _this.sels2 = []
        _this.selectLabelFunc()
      })
    },
    deleteLabelFunc() {
      const _this = this
      var data = JSON.stringify(_this.sels2[0].id)
      deleteLabel(data).then(response => {
        _this.sels2 = []
        _this.selectLabelFunc()
      })
    },
    // 镜像仓库
    selectFunc() {
      const _this = this
      var projectId = this.$route.params.projectId
      this.currentPage1 = 1
      this.page = 1
      var params = { page: this.page, page_size: this.page_size, q: this.name1, project_id: projectId }
      getRepositories(params).then(response => {
        _this.tableData1 = response.result
        _this.total = response.total
      })
    },

    deleteFunc() {
      const _this = this
      var data = JSON.stringify(_this.sels1[0].name).split('"')[1].split('"')[0]
      deleteRepositories(data).then(response => {
        _this.CurrentChange(_this.page)
      })
    },
    CurrentChange(val) {
      this.page = val
      // console.log(`当前页: ${val}`)
      const _this = this
      var params = { page: this.page, page_size: this.page_size }
      pageChange(params).then(response => {
        _this.tableData1 = response.result
        _this.total = response.total
      })
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
    selectionChange1: function(val) {
      // 多选
      this.sels1 = val
    },
    selectionChange2: function(val) {
      // 多选
      // debugger
      if (val.length !== 0) {
        this.sels2 = val
        this.updateformLabelAlign = this.sels2[0]
      } else {
        this.sels2 = []
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    nameChange1: function() {
      // console.log(this.name1)
      this.selectFunc()
    },
    nameChange2: function() {
      // console.log(this.name2)
      this.selectLabelFunc()
    },
    goTag(projectId, repoName) {
      this.$router.push({ name: 'Tag', params: { pojrectId: projectId, repoName: repoName }})
    }

  }
}
</script>
<style>
.el-header > p {
  float: left;
  font-size: 15px;
}
.el-autocomplete {
  float: right;
}
.block {
  float: left;
}
</style>

