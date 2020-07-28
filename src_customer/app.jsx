import React, { Component } from 'react'
import { Provider } from 'react-redux'

import configStore from './store'


import './app.scss'
import { setActivityEnded, setUserInfo } from './actions/game'
import { userInfoInit } from "../public/util/userinfo";

const store = configStore()

class App extends Component {
  componentDidMount () {
    const state = store.getState()
    if (!state.userinfo) {
      userInfoInit((userinfo) => {
          console.log(userinfo, "33");
          if (userinfo.code === 500 && userinfo.msg === "活动已经结束") {
            store.dispatch(setActivityEnded(true));
          } else {
            store.dispatch(setActivityEnded(false));
          }
          store.dispatch(setUserInfo(userinfo))
          console.log(store.getState().game.activity_ended);
      });
    }
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
