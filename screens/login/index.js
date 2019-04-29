/*
 * Oauth获取用户accessToken
 * 过程中捕获用户cookie
 * @Author: czy0729
 * @Date: 2019-03-31 11:21:32
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-04-26 13:50:41
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { WebView, Flex, Image, Button, Loading } from '@components'
import { StatusBarPlaceholder } from '@screens/_'
import { APP_ID, OAUTH_URL, OAUTH_REDIRECT_URL } from '@constants'
import { urlStringify } from '@utils'
import { userStore } from '@stores'
import _, { colorMain } from '@styles'

// 1. https://bgm.tv/login?chii_referer=%2Foauth%2Fauthorize%3Fclient_id%3Dbgm8885c4d524cd61fc%26response_type%3Dcode
// 2. https://bgm.tv/oauth/authorize?client_id=bgm8885c4d524cd61fc&response_type=code
// 3. https://bgm.tv/oauth/authorize?response_type=code&client_id=bgm8885c4d524cd61fc&redirect_uri=https%3A%2F%2Fbgm.tv
// 4. https://bgm.tv/?code=5c5423da2ba2d14b2a86de7adbf5f4a29d26d313

const uri = `${OAUTH_URL}?${urlStringify({
  response_type: 'code',
  client_id: APP_ID,
  redirect_uri: OAUTH_REDIRECT_URL
})}`
const injectedJavaScript = `(function(){
  var __isBridgeOk = false
  function waitForBridge() {
    if (!__isBridgeOk && window.postMessage.length !== 1) {
      setTimeout(waitForBridge, 200);
    } else {
      __isBridgeOk = true
      window.postMessage(JSON.stringify({
        type: 'onload',
        data: {
          href: document.location.href,
          userAgent: navigator.userAgent,
          cookie: document.cookie
        }
      }));
    }
  }
  setTimeout(() => { waitForBridge() }, 0);
}());`

export default class Login extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    clicked: false
  }

  onTour = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  onLogin = () => {
    this.setState({
      clicked: true
    })
  }

  onMessage = async event => {
    try {
      const { type, data } = JSON.parse(event.nativeEvent.data)
      switch (type) {
        case 'onload':
          if (data) {
            // @issue 首次登陆跳转后redirect_uri丢失了, 不清楚是什么问题
            if (
              data.href.indexOf('https://bgm.tv/oauth/authorize?') !== -1 &&
              data.href.indexOf('redirect_uri') === -1
            ) {
              // 这个时候刷新当前页面就回到正常的页面?
              console.log('Login -> goBack')
              this.ref.goBack()
            }

            // 得到code之后获取access_token
            if (data.href.indexOf('https://bgm.tv/?code=') !== -1) {
              this.doLogin(data)
            }
          }
          break
        default:
          break
      }
    } catch (ex) {
      // do nothing
    }
  }

  doLogin = async ({ href = '', userAgent, cookie } = {}) => {
    const { navigation } = this.props
    const code = href.replace('https://bgm.tv/?code=', '')
    userStore.updateUserCookie({
      userAgent,
      cookie
    })
    await userStore.fetchAccessToken(code)
    await userStore.fetchUserInfo()
    navigation.popToTop()
  }

  renderPreview() {
    return (
      <View style={[_.container.column, styles.gray]}>
        <Image
          style={styles.gray}
          width={160}
          height={128}
          src={require('@assets/screens/login/login.png')}
        />
        <View style={[styles.bottomContainer, _.mt.md]}>
          <Button type='main' shadow onPress={this.onLogin}>
            登录
          </Button>
          <Button style={_.mt.md} type='plain' shadow onPress={this.onTour}>
            游客访问
          </Button>
        </View>
      </View>
    )
  }

  renderLoading() {
    return (
      <View style={[_.container.column, styles.gray]}>
        <Image
          style={styles.gray}
          width={160}
          height={128}
          src={require('@assets/screens/login/login.png')}
        />
        <View style={[styles.bottomContainer, _.mt.md]}>
          <Flex style={styles.loading} justify='center'>
            <Loading.Raw color={colorMain} />
          </Flex>
        </View>
      </View>
    )
  }

  renderWebView() {
    return (
      <WebView
        ref={ref => (this.ref = ref)}
        uri={uri}
        javaScriptEnabled
        injectedJavaScript={injectedJavaScript}
        startInLoadingState
        renderLoading={() => this.renderLoading()}
        onMessage={this.onMessage}
      />
    )
  }

  render() {
    const { clicked } = this.state
    return (
      <View style={[_.container.flex, styles.gray]}>
        <StatusBarPlaceholder style={styles.gray} />
        <View style={_.container.flex}>
          {clicked ? this.renderWebView() : this.renderPreview()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bottomContainer: {
    width: 200,
    height: 200
  },
  loading: {
    width: 200,
    height: 64
  },
  gray: {
    backgroundColor: 'rgb(251, 251, 251)'
  }
})
