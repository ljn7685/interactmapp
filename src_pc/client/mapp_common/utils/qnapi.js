import { NOOP } from "./index";
import { getCloud } from "mapp_common/utils/cloud";
import { authDeferred } from "mapp_common/utils/userInfo";
import { api as Api } from "mapp_common/utils/api";
import { currentShopStatus } from "mapp_common/utils/shopStatus";
import { getProxyDeferred,
    getQNProxyEnabled,
    invokeTopProxy } from "mapp_common/utils/qnProxy";

/**
 * top请求调用 从小程序云
 * @param api
 * @param params
 * @param callback
 * @param errCallback
 */
let invokeTop = ({ api, params, callback, errCallback }) => {
    let successFlag = 0;
    params = JSON.parse(JSON.stringify(params));
    Object.keys(params).map(key => {
        if (Array.isArray(params[key])) {
            params[key] = params[key].join(',');
        }
    });
    //多店的时候调用这个接口，进行操作
    if (currentShopStatus().isOtherShop && api.indexOf('cainiao') == -1) {
        Api({
            apiName: 'aiyong.gateway.topapi',
            method: '/gateway/topapi' ,
            args: {
                apiName: api,
                targetStoreId: 'TAO',
                params: JSON.stringify(params),
                targetNick: currentShopStatus().currentShopName
            },
            callback: (res) => {
                if (res.code == 200 && res.body) {
                    callback(JSON.parse(res.body));
                } else {
                    // 网关api失败了
                    errCallback(JSON.parse(res.message));
                }
            },
            errCallback: (err) => {
                console.error('gateway api error!', err);
            }
        });
    } else {
        authDeferred.then(() => {
            getCloud().topApi.invoke({
                api: api,
                data: params,
            }).then((res) => {
                successFlag = 1;
                callback(res);
            }).catch((err) => {
                if (successFlag) {
                    return;
                }
                errCallback(err);
            });
        });
    }
};
/**
 * qnapi
 *  其中如果QNProxy打开后走QNProxy
 * @param api
 * @param params
 * @param callback
 * @param errCallback
 */
export function qnapi (
    {
        api,
        params = {},
        callback = NOOP, errCallback = NOOP,
    }) {
    if (getQNProxyEnabled()) {
        getProxyDeferred().then(() => {
            invokeTopProxy({
                api,
                params,
                callback,
                errCallback,
            });
        });
    } else {
        invokeTop({
            api,
            params,
            callback,
            errCallback,
        });
    }

};
