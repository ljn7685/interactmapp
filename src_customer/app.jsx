import React, { Component } from "react";
import { Provider } from "react-redux";

import configStore from "./store";

import "./app.scss";
import { setActivityEnded,
    setUserInfo as setUserInfoAction,
    addGametimes, } from "./actions/game";
import { userInfoInit } from "../public/util/userinfo";
import { getUserInfo, setUserInfo } from "../public/util/userInfoChanger";
import { showConfirmModal } from "../public/util";
import Taro from "@tarojs/taro";

const store = configStore();

class App extends Component {
    componentDidMount () {
        this.init();
    }
    /**
     * 初始化获取用户信息
     */
    async init () {
        await this.getLaunchParams();
        userInfoInit(() => {
            const userinfo = getUserInfo();
            if (
                (userinfo.code === 500 && userinfo.msg === "活动已经结束") ||
                userinfo.active_status === 2
            ) {
                store.dispatch(setActivityEnded(true));
            } else {
                if (userinfo.active_status === 3) {
                    showConfirmModal({
                        title: "提示",
                        content: "活动未开始！",
                        showCancel: false,
                        onConfirm: () => {
                            my.exit();
                        },
                    });
                    return;
                }
                store.dispatch(setActivityEnded(false));
            }
            store.dispatch(setUserInfoAction(userinfo));
            if (userinfo.is_follow && !userinfo.is_join) {
                store.dispatch(addGametimes());
            }
            console.log(store.getState().game.activity_ended);
        });
    }
    /**
     * 获取启动参数
     */
    getLaunchParams () {
        return new Promise((resolve) => {
            let options = Taro.getLaunchOptionsSync();
            options = { query:{ activeID:241 } };
            if (!(options && options.query && options.query.activeID)) {
                console.log("options", options);
                setUserInfo({ active_id: 182 });
                showConfirmModal({
                    title: "提示",
                    content: "商家活动暂未开启，进入试玩模式吧~",
                    showCancel: false,
                    onConfirm: () => {},
                });
                resolve();
            } else {
                setUserInfo({ active_id: options.query.activeID });
                resolve();
            }
        });
    }

    componentDidShow () {}

    componentDidHide () {}

    componentDidCatchError () {}

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render () {
        return <Provider store={store}>{this.props.children}</Provider>;
    }
}

export default App;
