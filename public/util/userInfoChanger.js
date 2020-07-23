import { storage } from "mapp_common/utils/storage";

let _userInfo = {
    vipFlag: 0,
    userNick: 'sinpo0'
};

export const getUserInfo = () => {
    let newUserInfo = storage.getItemSync('userInfo');
    return newUserInfo || _userInfo; 
};

export const saveUserInfo = () => {
    storage.setItem('userInfo', _userInfo);
};

export const setUserInfo = (newUserInfo) => {
    console.log('setUserInfo',newUserInfo);
    _userInfo = { ..._userInfo, ...newUserInfo };
    saveUserInfo();
    return _userInfo;
};
