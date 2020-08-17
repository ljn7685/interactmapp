import React, { Component } from "react";

import { View } from "@tarojs/components";
import "./toast.scss";

class ToastBox extends Component {
    constructor () {
        super();
        this.transitionTime = 300;
        this.state = { notices: [] };
        this.removeNotice = this.removeNotice.bind(this);
    }
    /**
     * 获得唯一的key
     */
    getNoticeKey () {
        const { notices } = this.state;
        return `notice-${new Date().getTime()}-${notices.length}`;
    }
    /**
     * 添加新的notice
     * @param {*} notice 
     */
    addNotice (notice) {
        const { notices } = this.state;
        notice.key = this.getNoticeKey();

        // notices.push(notice);//展示所有的提示
        notices[0] = notice; // 仅展示最后一个提示

        this.setState({ notices });
        if (notice.duration > 0) {
            setTimeout(() => {
                this.removeNotice(notice.key);
            }, notice.duration);
        }
        return () => {
            this.removeNotice(notice.key);
        };
    }
    /**
     * info notice
     * @param {*} content 
     * @param {*} duration 
     * @param {*} onClose 
     */
    info (content, duration, onClose) {
        return this.notice("info", content, duration, onClose);
    }
    /**
     * success notice
     * @param {*} content 
     * @param {*} duration 
     * @param {*} onClose 
     */
    success (content = "操作成功", duration, onClose) {
        return this.notice("success", content, duration, onClose);
    }
    /**
     * error notice
     * @param {*} content 
     * @param {*} duration 
     * @param {*} onClose 
     */
    error (content, duration, onClose) {
        return this.notice("error", content, duration, onClose);
    }
    /**
     * loading notice
     * @param {*} content 
     * @param {*} duration 
     * @param {*} onClose 
     */
    loading (content = "加载中...", duration = 0, onClose) {
        return this.notice("loading", content, duration, onClose);
    }
    /**
     * notice
     * @param {*} type 
     * @param {*} content 
     * @param {*} duration 
     * @param {*} onClose 
     */
    notice (type, content, duration = 2000, onClose) {
        this.addNotice({ type, content, duration, onClose });
    }
    /**
     * 移除notice
     * @param {*} key 
     */
    removeNotice (key) {
        const { notices } = this.state;
        this.setState({
            notices: notices.filter((notice) => {
                if (notice.key === key) {
                    if (notice.onClose) setTimeout(notice.onClose, this.transitionTime);
                    return false;
                }
                return true;
            }),
        });
    }

    render () {
        const { notices } = this.state;
        // const icons = {
        //     info: 'toast_info',
        //     success: 'toast_success',
        //     error: 'toast_error',
        //     loading: 'toast_loading'
        // }
        return (
            <View className='toast'>
                {notices.map((notice) => (
                    <View className='toast_bg' key={notice.key}>
                        <View className='toast_box'>
                            {/* <View className={`toast_icon ${icons[notice.type]}`}></View> */}
                            <View className='toast_text'>{notice.content}</View>
                        </View>
                    </View>
                ))}
            </View>
        );
    }
}
export default ToastBox;
