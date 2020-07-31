import { api } from "./api";
import { ENV } from "@/constants/env";
import { getUserInfo } from "./userInfoChanger";
export const NOOP = () => {};

/**
 * 打开旺旺聊天
 * @param nick 聊天的对象的nick
 * @param text 携带的文本
 */
export const openChat = ({ nick, text, success = NOOP, fail = NOOP }) => {
    console.log('打开旺旺', {
        nick,
        text,
    });
    try {
        my.qn.openChat({
            nick: `cntaobao${nick}`,
            text: text,
            success: success,
            fail: fail,
        });
    } catch (e) {
        console.error('openChat', e);
    }

};


/**
 * 联系爱用客服
 * @param text 发送的话术
 * @param nick
 * @param type
 */
export const contactCustomerService = (text, nick, type = 'kf') => {
    if (nick) {
        openChat({ nick, text });
        return;
    }
    api({
        apiName:'aiyong.crm.random.kfnick.get',
        host: ENV.hosts.mitem,
        method: '/tc/qgetkfnick',
        args: {
            sellernick: getUserInfo().seller_nick,
            type,
        },
        callback: (res) => {
            let nick = res ? (res.result ? res.result : res) : '爱用科技';
            nick = nick.indexOf('cntaobao') > -1 ? nick.replace('cntaobao', '') : nick;
            openChat({ nick, text });
        },
        errCallback: () => {
            openChat({ nick: '爱用科技', text });
        },
    });
};
