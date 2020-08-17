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
