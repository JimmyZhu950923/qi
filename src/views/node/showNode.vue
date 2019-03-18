<template>
  <div>
    <pre>{{ node }}</pre>
  </div>
</template>
<script>
import { getNodeByName } from '@/api/node'
export default {
  data() {
    return {
      node: null
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
      })
    }
  }
}
</script>
