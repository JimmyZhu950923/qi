import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // getToken from cookie
import config from '@/config/config'
import ranNum from '@/utils/ranNum'
import token from '@/utils/token'
NProgress.configure({ showSpinner: false })// NProgress configuration

router.beforeEach((to, from, next) => {
  NProgress.start()
  debugger
  if (localStorage.getItem('access_token')) {
    next()
  } else {
    const params = location.search.substr(1).split('&') // 获取query参数，存储在一个数组中
    // const code = param.substr(1).split('=')[1]
    var code = null
    for (var i = 0; i < params.length; i++) {
      var values = params[i].split('=')
      if (values[0] === 'code') {
        code = values[1]
      }
    }
    if (code == null) {
      config.code = ranNum(4)
      var querystring = require('querystring')
      var authorUrl = config.userAuthorizationUri
      authorUrl = authorUrl + ('?' + querystring.stringify({
        client_id: config.clientId,
        response_type: config.response_type,
        scope: config.scope,
        state: config.state,
        redirect_uri: 'http://localhost:9528' + to.path
      }))
      window.location.href = authorUrl
    } else {
      token.getTokenFromService(this, code, (response) => {
        debugger
        localStorage.setItem('access_token', response.data.access_token)
        next({ path: to.path })
      }, function(error) {
        alert(error)
      })
    }
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
