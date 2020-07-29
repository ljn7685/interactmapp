import React, { Component } from "react";
import { Provider } from "react-redux";

import configStore from "./store";

import "./app.scss";
import {
    setActivityEnded,
    setUserInfo as setUserInfoAction,
} from "./actions/game";
import { userInfoInit } from "../public/util/userinfo";
import { getUserInfo, setUserInfo } from "../public/util/userInfoChanger";
import { showConfirmModal } from "../public/util";
import Taro from "@tarojs/taro";

const store = configStore();

class App extends Component {
    componentDidMount() {
        if (!this.getLaunchParams()) return;
        const state = store.getState();
        if (!state.userinfo) {
            userInfoInit(() => {
                const userinfo = getUserInfo();
                if (
                    (userinfo.code === 500 &&
                        userinfo.msg === "活动已经结束") ||
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
                console.log(store.getState().game.activity_ended);
            });
        }
    }
    getLaunchParams() {
        const options = Taro.getLaunchOptionsSync();
        if (!(options && options.query && options.query.activeID)) {
            console.log("options", options);
            showConfirmModal({
                title: "提示",
                content: "啊哦～活动走丢了！",
                showCancel: false,
                onConfirm: () => {
                    my.exit();
                },
            });
            return false;
        } else {
            setUserInfo({ active_id: options.query.activeID });
            return true;
        }
    }

    componentDidShow() {}

    componentDidHide() {}

    componentDidCatchError() {}

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render() {
        return <Provider store={store}>{this.props.children}</Provider>;
    }
}

export default App;
