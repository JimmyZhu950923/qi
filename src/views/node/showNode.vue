<template>
  <div class="Show">
    <el-container v-loading="loading">
      <el-main>
        <span style="font-size:20px">详情</span><hr>
        <el-row>
          <el-col :span="4">名称:</el-col>
          <el-col :span="20">{{ name }}</el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">标签:</el-col>
          <el-col :span="20">
            <el-tag v-for="(label,value) in labels" :key="label.c">{{ value }}:{{ label }}</el-tag>
          </el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">注释:</el-col>
          <el-col :span="20">
            <el-tag v-for="(value,key) in annotations" :key="key.b">{{ key }}:{{ value }}</el-tag>
          </el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">创建时间:</el-col>
          <el-col :span="20">{{ timeFunc(creationTimestamp) }}</el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">地址:</el-col>
          <el-col :span="20">
            <el-tag v-for="adress in addresses" :key="adress.type">{{ adress.type }}:{{ adress.address }}</el-tag>
          </el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">容器组 CIDR:</el-col>
          <el-col :span="20">{{ podCIDR }}</el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">无法调度:</el-col>
          <el-col :span="20">{{ getSchedule(taints) }}</el-col>
        </el-row><br>

        <span style="font-size:18px">系统信息</span><br><br>

        <el-row>
          <el-col :span="4">机器ID:</el-col>
          <el-col :span="20">{{ nodeInfo.machineID }}</el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">系统UUID:</el-col>
          <el-col :span="20">{{ nodeInfo.systemUUID }}</el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">启动ID:</el-col>
          <el-col :span="20">{{ nodeInfo.bootID }}</el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">内核版本:</el-col>
          <el-col :span="20">{{ nodeInfo.kernelVersion }}</el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">操作系统镜像:</el-col>
          <el-col :span="20">{{ nodeInfo.osImage }}</el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">容器运行时版本:</el-col>
          <el-col :span="20">{{ nodeInfo.containerRuntimeVersion }}</el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">Kubelet 版本:</el-col>
          <el-col :span="20">{{ nodeInfo.kubeletVersion }}</el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">kube-Proxy 版本:</el-col>
          <el-col :span="20">{{ nodeInfo.kubeProxyVersion }}</el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">操作系统:</el-col>
          <el-col :span="20">{{ nodeInfo.operatingSystem }}</el-col>
        </el-row><br>
        <el-row>
          <el-col :span="4">架构:</el-col>
          <el-col :span="20">{{ nodeInfo.architecture }}</el-col>
        </el-row><br>
      </el-main>
    </el-container>
    <el-container>
      <el-main>
        <span style="font-size:20px">已分配资源</span><hr>
        <el-row>
          <el-col :span="8">
            <div id="Cpu" style="width:90%;height:300px;"/>
            <span/>
          </el-col>
          <el-col :span="8">
            <div id="Memory" style="width:90%;height:300px;"/>
          </el-col>
          <el-col :span="8">
            <div id="Pod" style="width:90%;height:300px;"/>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-container>
      <el-main>
        <span style="font-size:20px">现状</span><hr>
        <el-table
          :data="nodeData"
          style="width:100%"
          stripe>
          <el-table-column prop="type" label="类型" width="150px"/>
          <el-table-column prop="status" label="状态"/>
          <el-table-column prop="lastHeartbeatTime" label="最近修改" width="200px"><template slot-scope="scope">{{ timeFunc(scope.row.lastHeartbeatTime) }}</template></el-table-column>
          <el-table-column label="最近更改"><template slot-scope="scope"> {{ time(scope.row.lastTransitionTime) }}</template></el-table-column>
          <el-table-column prop="reason" label="原因" width="220px"/>
          <el-table-column prop="message" label="消息" width="300px"/>
        </el-table>
      </el-main>
    </el-container>
    <el-container>
      <el-main>
        <span style="font-size:20px">容器组</span><hr>
        <el-table
          :data="podData"
          style="width:100%"
          stripe
        >
          <el-table-column sortable prop="metadata.name" label="实例名称" width="300"/>
          <el-table-column sortable prop="status.phase" label="状态" width="130">
            <template slot-scope="scope">
              <font :color="checkStatusFunc(scope.row.status.phase)">{{ scope.row.status.phase }}</font>
            </template>
          </el-table-column>
          <el-table-column sortable prop="metadata.creationTimestamp" label="已创建">
            <template slot-scope="scope">{{ time(scope.row.metadata.creationTimestamp) }}</template>
          </el-table-column>
          <el-table-column sortable prop="status.containerStatuses[0].restartCount" label="重启次数"/>
          <el-table-column label="操作" width="218px">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="success"
              >
                日志
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="getSinglePod(scope.row.metadata)">
                查看
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="delFunc(scope.row.metadata)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          :visible.sync="dialogVisible"
          title="修改容器组"
          width="50%">
          <el-input
            :rows="15"
            v-model="pods"
            type="textarea"
            placeholder="请输入内容"/>
          <span slot="footer" class="dialog-footer">
            <el-button type="text" @click="dialogVisible = false">取 消</el-button>
            <el-button type="text" @click="dialogVisible = false">复 制</el-button>
            <el-button type="text" @click="updatePod()">更 新</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
    <el-container>
      <el-main>
        <span style="font-size:20px">事件</span><hr>
        <div class="text">
          <br>
          <span style="font-size:24px;color:#888888">无内容</span><br>
          <span style="color:#AAAAAA">可能所有事件已过期</span>
        </div>
      </el-main>
    </el-container>
    <el-footer/>
  </div>
</template>
<script>
import { getNodeByName, getPod } from '@/api/node'
import { delPod, update } from '@/api/pod'
import echarts from 'echarts'

export default {
  name: 'Show',
  data() {
    return {
      node: '',
      name: '',
      labels: '',
      annotations: '',
      creationTimestamp: '',
      addresses: '',
      taints: '',
      podCIDR: '',
      nodeInfo: '',
      loading: true,
      podData: [],
      nodeData: [],
      dialogVisible: false,
      pods: '',
      allocatedResources: ''

    }
  },
  created() {
    this.select()
  },

  methods: {
    select() {
      const _this = this
      var params = this.$route.params.nodeName
      // 获取node详情
      getNodeByName(params).then(response => {
        // node
        _this.node = response.data
        // cpu内存的请求限制值
        _this.allocatedResources = response.allocatedResources
        // pod
        _this.podData = response.pod.items
        _this.nodeData = response.data.status.conditions
        _this.name = _this.node.metadata.name
        _this.labels = _this.node.metadata.labels
        _this.annotations = _this.node.metadata.annotations
        _this.creationTimestamp = _this.node.metadata.creationTimestamp
        _this.addresses = _this.node.status.addresses
        _this.taints = _this.node.spec.taints
        _this.podCIDR = _this.node.spec.podCIDR
        _this.nodeInfo = _this.node.status.nodeInfo
        _this.loading = false

        _this.getCpu()
        _this.getMemory()
        _this.getP()
      })
      // 获取node下所有的pod
    },
    getSchedule(obj) {
      if (obj === undefined) {
        return true
      } else {
        return false
      }
    },
    time: function(tm) {
      var createTime = new Date(tm).getTime()
      var now = new Date().getTime()
      var age = Math.floor((now - createTime) / 1000)
      if (age < 60) {
        return Math.floor(age) + '秒'
      } else if (age / 60 < 60) {
        return Math.floor(age / 60) + '分'
      } else if (age / 60 / 60 < 24) {
        return Math.floor(age / 60 / 60) + '时'
      } else {
        return Math.floor(age / 60 / 60 / 24) + '天'
      }
    },
    checkStatusFunc: function(phase) {
      if (phase === 'Running') {
        return '#46AF60'
      } else {
        return '#F56C6C'
      }
    },
    handleCommand(command) {

    },
    delFunc: function(metadata) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPod({ name: metadata.name, namespace: metadata.namespace }).then(response => {
          this.selectFunc()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          setTimeout(() => {
            this.selectFunc()
          }, 4000)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    getSinglePod(metadata) {
      const _this = this
      var params = { podName: metadata.name, namespace: metadata.namespace }
      console.log(params)
      getPod(params).then(response => {
        _this.dialogVisible = true
        _this.pods = JSON.stringify(response.data, null, 4)
      })
    },
    updatePod() {
      const _this = this
      var name = _this.pods
      var nameSpace = JSON.parse(_this.pods).metadata.namespace
      this.$confirm('此操作将作出修改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        update(name, nameSpace).then(response => {
          _this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
      }).catch(() => {
        _this.dialogVisible = false
        this.$message({
          type: 'info',
          message: '取消修改'
        })
      })
    },
    timeFunc: function(tm) {
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
    getCpu() {
      echarts.init(document.getElementById('Cpu')).setOption({
        title: {
          text: 'CPU allocation (cores)'
        },
        color: [
          '#67C23A',
          '#e1e1e1',
          '#409EFF'
        ],
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: function(series) {
            return series.name + ':' + series.data.value / 1000 + '\t' + '(' + series.percent + '%)'
          },
          position: 'right'
        },
        legend: {
          type: 'scroll',
          bottom: 0
        },
        series: [{
          name: 'CPU请求值1',
          hoverAnimation: false,
          type: 'pie',
          radius: ['60%', '80%'],
          label: {
            show: false,
            position: 'inner'
          },
          data: [
            { value: this.getCpuRequests(), name: 'CPU请求值' },
            { value: this.getCapacityCpu(), name: 'CPU总量' }
          ]
        },
        {
          name: 'CPU限制值1',
          hoverAnimation: false,
          type: 'pie',
          radius: ['38%', '58%'],
          label: {
            show: false,
            position: 'inner'
          },
          data: [
            { value: this.getCpuLimits(), name: 'CPU限制值' },
            { value: this.getCapacityCpu(), name: 'CPU总量' }
          ]
        }]
      })
    },
    getMemory() {
      echarts.init(document.getElementById('Memory')).setOption({
        title: { text: 'Memory allocation (bytes)' },
        legend: {
          type: 'scroll',
          bottom: 0
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: function(series) {
            if (series.name === '内存总量') {
              var memory = series.data.value / 1000000000
              memory = memory.toFixed(2) + ' Gi'
              return series.name + ':' + memory + '\t' + '(' + series.percent + '%)'
            } else {
              var val = series.data.value / 1000000 + ' Mi'
              return series.name + ':' + val + '\t' + '(' + series.percent + '%)'
            }
          }
        },
        color: [
          '#67C23A',
          '#e1e1e1',
          '#409EFF'
        ],
        series: [{
          name: '内存请求值1',
          hoverAnimation: false,
          type: 'pie',
          radius: ['60%', '80%'],
          label: {
            show: false,
            position: 'inner'
          },
          data: [
            { value: this.getMemoryRequests(), name: '内存请求值' },
            { value: this.getCapacityMemory(), name: '内存总量' }
          ]
        },
        {
          name: '内存限制值1',
          hoverAnimation: false,
          type: 'pie',
          radius: ['38%', '58%'],
          label: {
            show: false,
            position: 'inner'
          },
          data: [
            { value: this.getMemoryLimits(), name: '内存限制值' },
            { value: this.getCapacityMemory(), name: '内存总量' }
          ]
        }]
      })
    },
    getP() {
      echarts.init(document.getElementById('Pod')).setOption({
        title: { text: 'Pods allocation' },
        color: [
          '#67C23A',
          '#e1e1e1'
        ],
        legend: {
          type: 'scroll',
          bottom: 0
        },
        tooltip: {
          show: true,
          formatter: function(series) {
            return series.name + ':' + series.data.value + '\t' + '(' + series.percent + '%)'
          },
          trigger: 'item'
        },
        series: [{
          hoverAnimation: false,
          type: 'pie',
          radius: ['60%', '80%'],
          label: {
            show: false,
            position: 'inner'
          },
          data: [
            { value: this.allocatedResources.PodNum, name: '已有pod' },
            { value: 110 - this.allocatedResources.PodNum, name: '剩余pod' }
          ]
        }]
      })
    },
    getCpuRequests() {
      var cpuRequest = this.allocatedResources.CpuRequests
      return cpuRequest
    },
    getCpuLimits() {
      var cpuLimits = this.allocatedResources.CpuLimits
      return cpuLimits
    },
    getCapacityCpu() {
      var cpu = this.node.status.capacity.cpu * 1000
      return cpu
    },
    getMemoryRequests() {
      var memoryRequest = this.allocatedResources.MemoryRequests * 1000000
      return memoryRequest
    },
    getMemoryLimits() {
      var memoryLimits = this.allocatedResources.MemoryLimits * 1000000
      return memoryLimits
    },
    getCapacityMemory() {
      var memory = this.node.status.capacity.memory.split('Ki')[0] * 1000
      return memory
    }
  }
}
</script>
<style>
.Show .el-tag{
  font-size:15px;
  border-radius: 20px;
  margin-right: 15px;
  margin-bottom: 10px;
}
.Show{
font-size:15px;
}
.el-main{
  padding-bottom: 0%;

}
.text{
  text-align: center
}
</style>
