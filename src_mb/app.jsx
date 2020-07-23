import React, { Component } from 'react'
import { Provider } from 'react-redux'

import configStore from './store'
import { getCloud } from "../public/mapp_common/utils/cloud";
import moment from "../public/mapp_common/utils/moment";
import './app.scss'
// import { entry } from "../public/util/api";
import { userInfoInit } from '../public/util/userInfo';
import { invokeTop, api } from "../public/util/api";
import { getUserInfo  } from "../public/util/userInfoChanger";

const store = configStore()

class App extends Component {
  componentDidMount () {
    userInfoInit();
    console.log(12333)
    // console.log(getUserInfo())
  //   invokeTop({
  //     api: 'taobao.appstore.subscribe.get',
  //     params: {
  //       nick: 'sinpo0'
  //     },
  //     callback: (rsp) => {
  //        console.log(rsp)
  //     },
  //     errCallback: (error) => {
  //       console.log(error)
  //     },
  // });
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
