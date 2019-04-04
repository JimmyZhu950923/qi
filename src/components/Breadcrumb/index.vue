<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      debugger
      let matched = this.$route.matched.filter(item => item.name)

      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        if (first && first.name === 'Repositories') {
          matched = [
            { path: '/home', meta: { title: '首页' }},
            { path: '/center/project', meta: { title: '镜像中心' }}
          ].concat(matched)
        } else if (first && first.name === 'Tag') {
          matched = [
            { path: '/home', meta: { title: '首页' }},
            { path: '/center/project', meta: { title: '镜像中心' }},
            { path: '/Repo/repositories/' + this.$route.params.projectId, meta: { title: '镜像仓库' }}
          ].concat(matched)
        } else if (first && first.name === 'ShowNode') {
          matched = [
            { path: '/home', meta: { title: '首页' }},
            { path: '/cluster/cluster', meta: { title: '集群' }},
            { path: '/cluster/node/' + this.$route.params.name, meta: { title: 'Node' }}
          ].concat(matched)
        } else if (first && first.name === 'Node') {
          matched = [
            { path: '/home', meta: { title: '首页' }},
            { path: '/cluster/cluster', meta: { title: '集群' }}
          ].concat(matched)
        } else if (first && first.name === 'Pod1') {
          matched = [
            { path: '/home', meta: { title: '首页' }},
            { path: '/deploy/deployment', meta: { title: '部署' }}
          ].concat(matched)
        } else if (first && first.name === 'Pod2') {
          matched = [
            { path: '/home', meta: { title: '首页' }},
            { path: '/deploy/daemonset', meta: { title: '守护进程集' }}
          ].concat(matched)
        } else if (first && first.name === 'Service2') {
          matched = [
            { path: '/home', meta: { title: '首页' }},
            { path: '/service/service', meta: { title: '服务' }}
          ].concat(matched)
        } else {
          matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched)
        }
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
