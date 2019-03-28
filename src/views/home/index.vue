<template>
  <div>
    <el-header>
      <h1>栖 巢 容 器 云 平 台</h1>
    </el-header>
    <el-main>
      <div id="test" style="width: 600px;height:400px;"/>
    </el-main>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      option: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
    }
  },
  mounted() {
    var test = echarts.init(document.getElementById('test'))
    test.setOption(this.option)
  }
}
</script>
