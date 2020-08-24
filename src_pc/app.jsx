import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { userInfoInit } from '../public/util/userInfo';
import configStore from './store';

import './app.scss';
import './assets/iconfont/iconfont.scss';

const store = configStore();

class App extends Component {

    componentDidMount () {
        userInfoInit();
    }

    componentDidShow () { }

    componentDidHide () { }

    componentDidCatchError () { }

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render () {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        );
    }
}

export default App;
