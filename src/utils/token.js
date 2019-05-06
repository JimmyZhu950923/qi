import axios from 'axios'
import config from '@/config/config'
var token = {
  getTokenFromService: function(vue, code, callback, error) {
    axios.post(config.accessTokenUri, {
      client_id: config.clientId,
      client_secret: config.client_secret,
      code: code,
      redirect_uri: config.redirect_uri,
      grant_type: config.grant_type
    }, {
      headers: { 'Accept': 'application/json' }
    })
      .then(callback)
      .catch(error)
  }
}

export default token
