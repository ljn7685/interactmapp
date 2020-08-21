export const checkCollectedStatus = (id) => {
    return new Promise((resolve, reject) => {
        my.tb.checkGoodsCollectedStatus({
            id,
            success: (res) => {
                resolve(res);
            },
            fail: (res) => {
                reject(res);
            },
        });
    });
   
};
/**
 * 检查店铺关注状态
 * @param {*} id 
 */
export function checkShopFavoredStatus (id) {
    return new Promise((resolve, reject) => {
        my.tb.checkShopFavoredStatus({
            id,
            success: (res) => {
                resolve(res);
            },
            fail: (res) => {
                reject(res);
            },
        });
    });
}