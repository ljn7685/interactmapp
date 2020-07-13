import { api } from "./api";
import { ENV } from "@/constants/env";
import { Logger } from "mapp_common/utils/logger";
import { NOOP } from "mapp_common/utils/index";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";

/**
 * 打开旺旺聊天
 * @param nick 聊天的对象的nick
 * @param text 携带的文本
 */
export const openChat = ({ nick, text, success = NOOP, fail = NOOP }) => {
    Logger.log('打开旺旺', {
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
        Logger.error('openChat', e);
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
        apiName: ENV.app == 'trade' ? 'aiyong.trade.crm.random.kfnick.get' : 'aiyong.crm.random.kfnick.get',
        host: ENV.app == 'trade' ? ENV.hosts.mtrade : ENV.hosts.mitem,
        method: '/tc/qgetkfnick',
        args: {
            sellernick: getUserInfo().sub_nick ? getUserInfo().sub_nick : getUserInfo().userNick,
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
