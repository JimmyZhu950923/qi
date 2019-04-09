import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Home',
    // hidden: true,
    children: [{
      path: 'home',
      meta: { title: '首页', icon: 'home' },
      component: () => import('@/views/home/index')
    }]
  },
  {
    path: '/node',
    component: Layout,
    // hidden: true,
    children: [
      {
        path: 'node',
        name: 'Node',
        component: () => import('@/views/node/index'),
        meta: { title: '集群', icon: 'cluster' }
      },
      {
        path: 'showNode/:nodeName',
        name: 'ShowNode',
        hidden: true,
        meta: { title: '主机详情' },
        component: () => import('@/views/node/showNode')
      }

    ]
  },
  {
    path: '/deploy',
    component: Layout,
    meta: { title: '工作负载', icon: 'deployment' },
    children: [
      {
        path: 'deployment',
        name: 'deployment',
        component: () => import('@/views/deployment/index'),
        meta: { title: '部署' }
      },
      {
        path: 'daemonset',
        name: 'daemonset',
        component: () => import('@/views/daemonset/index'),
        meta: { title: '守护进程集' }
      }
    ]
  },
  {
    path: '/service',
    component: Layout,
    children: [
      {
        path: 'service',
        name: 'Service',
        component: () => import('@/views/service/index1'),
        meta: { title: '服务', icon: 'server' }
      },
      {
        path: 'service2/:name/:namespace',
        name: 'Service2',
        hidden: true,
        component: () => import('@/views/service/index2'),
        meta: { title: '服务', icon: 'server' }
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    children: [
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/config/index1'),
        meta: { title: '配置', icon: 'config' }
      },
      {
        path: 'config2/:name/:namespace',
        name: 'Config2',
        hidden: true,
        component: () => import('@/views/config/index2'),
        meta: { title: '配置', icon: 'config' }
      }
    ]
  },
  {
    path: '/storage',
    component: Layout,
    children: [
      {
        path: 'storage',
        name: 'Storage',
        component: () => import('@/views/storage/index'),
        meta: { title: '存储', icon: 'storage' }
      }
    ]
  },
  {
    path: '/pod',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index1/:name/:namespace',
        name: 'Pod1',
        component: () => import('@/views/pod/index1'),
        meta: { title: '容器', icon: 'pods' }
      },
      {
        path: 'index2/:name/:namespace',
        name: 'Pod2',
        component: () => import('@/views/pod/index2'),
        meta: { title: '容器', icon: 'pods' }
      }
    ]
  },
  {
    path: '/center',
    component: Layout,
    children: [
      {
        path: 'project',
        name: 'project',
        component: () => import('@/views/project/project'),
        meta: { title: '镜像中心', icon: 'respository' }
      }
    ]
  },
  {
    path: '/tag',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'tag/:projectId/:repoName',
        name: 'Tag',
        component: () => import('@/views/tag/index'),
        meta: { title: 'Tag', icon: 'tag' }
      }
    ]
  },
  {
    path: '/Repo',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'repositories/:projectId',
        name: 'Repositories',
        component: () => import('@/views/repositories/repositories'),
        meta: { title: '镜像仓库', icon: 'repositories' }
        // hidden: true
      }

    ]
  },
  {
    path: '/systemSetting',
    component: Layout,
    // hidden: true,
    meta: { title: '系统管理', icon: 'setting' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/systemSetting/user'),
        meta: { title: '用户管理' }
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/systemSetting/setting'),
        meta: { title: '系统设置' }
      }

    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

