<template>
  <div class="Show">
    <el-container v-loading="loading">
      <pre>{{ node }}</pre>
    </el-container>
  </div>
</template>
<script>
import { getNodeByName } from '@/api/node'
export default {
  name: 'Show',
  data() {
    return {
      node: null,
      loading: true
    }
  },
  created() {
    this.select()
  },
  methods: {
    select() {
      const _this = this
      var params = this.$route.params.nodeName
      getNodeByName(params).then(response => {
        _this.node = JSON.stringify(response, null, 4)
        _this.loading = false
      })
    }
  }
}
</script>
