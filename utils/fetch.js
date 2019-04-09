/*
 * @Author: czy0729
 * @Date: 2019-03-14 05:08:45
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-04-09 16:58:45
 */
import { Toast } from '@ant-design/react-native'
import { APP_ID } from '@constants'
import { getStorage, urlStringify, sleep, getTimestamp } from './index'
import { log } from './dev'

const ERR_RETRY_COUNT = 3 // GET请求失败重试次数
// const STATUS_SUCCESS = 200
// const STATUS_ACCEPTED = 202
// const STATUS_NOT_MODIFIED = 304
// const STATUS_BAD_REQUEST = 400
// const STATUS_UNAUTHORIZED = 401
// const STATUS_NOT_FOUND = 404
// const STATUS_METHOD_NOT_ALLOWED = 405

/**
 * 统一请求方法
 * 若GET请求异常, 500ms后重试retryCb, 直到成功
 * @version 190303 1.2
 * @param {*} param
 */
const retryCount = {}
export default async function _fetch({
  url,
  data = {},
  method = 'GET',
  retryCb,
  info = ''
} = {}) {
  // 避免userStore循环引用
  const userStore = require('../stores/user').default
  const { userInfo = {} } = userStore
  const _config = {
    headers: {
      Authorization: `${userInfo.token_type || 'Bearer'} ${
        userInfo.access_token
      }`
    }
  }
  const isGet = method === 'GET'
  const body = {
    app_id: APP_ID,
    ...data
  }

  let _url = url
  if (!isGet) {
    _config.method = 'POST'
    _config.headers['content-type'] = 'application/x-www-form-urlencoded'
    _config.body = urlStringify(body)
  } else {
    body.state = getTimestamp() // 随机数防止接口CDN缓存
    _url = `${url}?${urlStringify(body)}`
  }

  return fetch(_url, _config)
    .then(response => response.json())
    .then(res => {
      // 成功后清除失败计数
      if (isGet) {
        const key = `${url}|${urlStringify(data)}`
        if (retryCount[key]) {
          retryCount[key] = 0
        }
      } else {
        log(method, 'success', url, data, info, res)
      }

      // @issue 由于Bangumi提供的API没有统一返回数据
      // 正常情况没有code, 错误情况例如空的时候, 返回{code: 400, err: '...'}
      if (res && res.error) {
        if (res.error === 'invalid_token') {
          Toast.info('登录过期')
          userStore.logout()
        }
        return Promise.resolve({})
      }

      // 接口某些字段为空返回null, 影响到解构的正常使用, 统一处理成空字符串
      return Promise.resolve(safe(res))
    })
    .catch(async err => {
      // @issue Bangumi提供的API的代理经常报错, 我也就只能一直请求到成功为止了hhh
      if (isGet && typeof retryCb === 'function') {
        await sleep(1000)

        const key = `${url}|${urlStringify(data)}`
        retryCount[key] = (retryCount[key] || 0) + 1

        if (retryCount[key] < ERR_RETRY_COUNT) {
          log('re-fetch', `fail ${retryCount[key]} time`, url, info, err)
          return retryCb()
        }
      }
      Toast.info(`${info}请求失败`)
      return Promise.reject(err)
    })
}

/**
 * 请求获取HTML
 * @version 190323 1.0
 * @param {*} param
 */
export async function fetchHTML({ url } = {}) {
  return fetch(url).then(res => Promise.resolve(res._bodyInit))
}

/**
 * @todo
 * 接口防并发请求问题严重, 暂时延迟一下, 2个请求一组
 * @param {*} fetchs
 */
export async function queue(fetchs = []) {
  const [
    f1 = Function.prototype,
    f2 = Function.prototype,
    f3 = Function.prototype,
    f4 = Function.prototype
  ] = fetchs
  await Promise.all([f1(), f2()])
  return Promise.all([f3(), f4()])
}

function safe(res) {
  return JSON.parse(JSON.stringify(res).replace(/:null/g, ':""'))
}
