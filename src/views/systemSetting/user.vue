<template>
  <div class="User">
    <el-contaner>
      <el-header>用户管理</el-header>
      <el-main>
        <el-row>
          <el-col>
            <el-button type="primary" round size="mini" @click="addUser = true">新建</el-button>
            <el-dialog
              :visible.sync="addUser"
              :modal="false"
              title="新建用户"
              width="35%"
              center>
              <span>
                <el-form ref="form" :model="form" label-width="80px">
                  <el-form-item label="用户名">
                    <el-input v-model="form.username"/>
                  </el-form-item>
                  <el-form-item label="用户角色">
                    <el-select v-model="value1" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="可用集群">
                    <el-radio-group v-model="form.available">
                      <el-radio label="default"/>
                      <el-radio label="cluster_1"/>
                      <el-radio label="cluster_2"/>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="form.email"/>
                  </el-form-item>
                  <el-form-item label="手机号">
                    <el-input v-model="form.phone"/>
                  </el-form-item>
                  <el-form-item label="初始密码">
                    <el-radio-group v-model="form.password">
                      <el-radio label="发送至手机"/>
                      <el-radio label="发送至邮箱"/>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="addUser = false">取 消</el-button>
                <el-button type="primary" @click="addUser = false">确 定</el-button>
              </span>
            </el-dialog>
          </el-col>
        </el-row>
        <el-table
          ref="multipleTable"
          :fit="true"
          :data="tableData"
          stripe
          height="430px"
          tooltip-effect="dark"
          style="width: 100%">>
          <el-table-column
            fixed
            prop="username"
            label="用户名"/>
          <el-table-column
            prop="role"
            label="用户角色"/>
          <el-table-column
            prop="available"
            label="可用集群"/>
          <el-table-column
            prop="email"
            label="邮箱"/>
          <el-table-column
            prop="phone"
            label="手机号"/>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button :disabled="tableData[scope.$index].role== '集群管理员'" type="text" size="small" @click="handleClick(scope.row)">删除</el-button>
              <el-button type="text" size="small" @click="updateUser = true;change(scope.row)">修改</el-button>
              <el-dialog
                :visible.sync="updateUser"
                :modal="false"
                title="修改用户"
                width="35%"
                center>
                <span>
                  <el-form ref="form" :model="updateForm" label-width="80px">
                    <el-form-item label="用户名">
                      <el-input v-model="updateForm.username"/>
                    </el-form-item>
                    <el-form-item label="用户角色">
                      <el-select v-model="value2" placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="可用集群">
                      <el-radio-group v-model="updateForm.available">
                        <el-radio label="default"/>
                        <el-radio label="cluster_1"/>
                        <el-radio label="cluster_2"/>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="邮箱">
                      <el-input v-model="updateForm.email"/>
                    </el-form-item>
                    <el-form-item label="手机号">
                      <el-input v-model="updateForm.phone"/>
                    </el-form-item>
                    <el-form-item label="初始密码">
                      <el-radio-group v-model="updateForm.password">
                        <el-radio label="发送至手机"/>
                        <el-radio label="发送至邮箱"/>
                      </el-radio-group>
                    </el-form-item>
                  </el-form>
                </span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="updateUser = false">取 消</el-button>
                  <el-button type="primary" @click="updateUser = false">确 定</el-button>
                </span>
              </el-dialog>
              <el-button type="text" size="small" @click="open">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-contaner>
  </div>
</template>
<script>
export default {
  name: 'User',
  data() {
    return {
      form: {
        username: 'ng_service',
        role: '集群管理员',
        available: 'default',
        email: 'cj.zhao@venusource.com',
        phone: '13708456550',
        password: '发送至手机'
      },
      updateForm: {
        username: '',
        role: '',
        available: '',
        email: '',
        phone: '',
        password: ''
      },
      tableData: [
        { username: 'admin',
          role: '集群管理员',
          available: 'default',
          email: 'cj.zhao@venusource.com',
          phone: '13708456550',
          password: '发送至手机'
        },
        { username: 'test1',
          role: '普通用户',
          available: 'cluster_1',
          email: 'dz.tian@qq.com',
          phone: '13800138001',
          password: '发送至邮箱'
        }
      ],
      options: [{
        value: '选项1',
        label: '集群管理员'
      }, {
        value: '选项2',
        label: '普通用户'
      }],
      value1: '集群管理员',
      value2: '',
      addUser: false,
      updateUser: false
    }
  },
  methods: {
    handleClick(row) {
      console.log(row)
    },
    change(row) {
      this.updateForm = row
      this.value2 = row.role
    },
    open() {
      this.$alert('新密码已发送至您的邮箱！', '重置密码', {
        confirmButtonText: '确定'
      })
    }

  }
}
</script>
<style>
.el-header {
    color: #333;
    line-height: 60px;
  }
    .el-main {
    color: #333;
  }
.el-dialog__body{
    height: 50vh;
    overflow: auto;
}
</style>
