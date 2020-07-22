// import { NOOP } from "./index";
import { getCloud } from "mapp_common/utils/cloud";
import { authDeferred } from './userinfo';

/**
 * top请求调用 从小程序云
 * @param api
 * @param params
 * @param callback
 * @param errCallback
 */
export function invokeTop ({ api, params, callback, errCallback })  {
    let successFlag = 0;
    params = JSON.parse(JSON.stringify(params));
    Object.keys(params).map(key => {
        if (Array.isArray(params[key])) {
            params[key] = params[key].join(',');
        }
    });
    authDeferred.then(() => {
        getCloud().topApi.invoke({
            api: api,
            data: params,
        }).then((res) => {
            console.log('~~~~~~~~~', res)
            successFlag = 1;
            callback(res);
        }).catch((err) => {
            if (successFlag) {
                return;
            }
            errCallback(err);
        });
    });
};

// /**
//  * qnapi
//  *  其中如果QNProxy打开后走QNProxy
//  * @param api
//  * @param params
//  * @param callback
//  * @param errCallback
//  */
// export function qnapi (
//     {
//         api,
//         params = {},
//         callback = NOOP, errCallback = NOOP,
//     }) {
//         console.log(api)
//         invokeTop({
//             api,
//             params,
//             callback,
//             errCallback,
//         });
// };
