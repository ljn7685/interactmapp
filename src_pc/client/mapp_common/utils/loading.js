import Taro from "@tarojs/taro";
import Loading from "mapp_common/components/loading";
import {isObject} from "mapp_common/utils/index";
import {events} from "mapp_common/utils/eventManager";
import {ENV} from "@/constants/env";
/**
 * 显示菊花
 *     (这个函数其实是pc遗留下来的弊病 不应该用type来区分是show 还是hide
 * @param type
 * @param title
 */
export const loading = (type, title = '加载中...') => {
    if (type == 'show') {
        if (ENV.device == 'pc') {
            events.loading.emit({isShow: true,title:title});
            return;
        }
        showLoading(title);
    }
    if (type == 'hide') {
        if (ENV.device == 'pc') {
            events.loading.emit({isShow: false,title:title});
            return;
        }
        hideLoading();
    }
};

export function showLoading (title = '加载中...') {
    if (ENV.device == 'pc') {
        events.loading.emit({isShow: true,title:title});
        return;
    }
    Taro.showLoading({ title: title });
}
export function hideLoading () {
    if (ENV.device == 'pc') {
        events.loading.emit({isShow: false});
        return;
    }
    Taro.hideLoading();
}
