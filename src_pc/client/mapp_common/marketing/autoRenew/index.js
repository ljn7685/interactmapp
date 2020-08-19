import Taro, { Component } from '@tarojs/taro';
import { Image, Text, View} from '@tarojs/components';
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { showConfirmModal, isEmpty, navigateBack } from "mapp_common/utils/index";
import './index.scss';
import { ENV } from "@/constants/env";
import { api } from "mapp_common/utils/api";
import { getSystemInfo } from "mapp_common/utils/systemInfo";
import { goClick } from "mapp_common/marketing/utils/biz";
import { AD_TYPE, MARKETING_TYPE } from "tradePublic/marketing/constants";
/**
 * 自动续费获取用户支付宝信息页面
 */
class getAlipayDataPage extends Component {
    config = { navigationBarTitleText: '爱用特惠季' };

    /**
    * 提交支付宝表单数据
    * @param {*} event
    */
    onSubmit (event) {
        const inputValue = isEmpty(event.detail) ? event[0].detail.value : event.detail.value;
        const { alipayName, alipayUser } = inputValue;
        if(isEmpty(alipayName) || isEmpty(alipayUser)){
            showConfirmModal({ content: '用户名或支付宝账号不能为空.', showCancel:false });
            return;
        }
        showConfirmModal({
            title: '温馨提示',
            content: `支付宝信息提交后不可修改！请确认支付宝实名为${alipayName}，充值账号为${alipayUser}`,
            onConfirm: () => {
                this.saveAliPayData(alipayName, alipayUser);
            },
        });
    }

    /*
     * @Description 存储用户的支付宝信息
    */
    saveAliPayData = (userInputName, userInputAccount) => {
        api({
            apiName: 'aiyong.trade.user.renew.pay.save',
            domain: ENV.hosts.trade,
            method: '/iytrade2/saveUserAlipayAccount',
            args:{
                userInputName,
                userInputAccount,
                userSource: ENV.app,
                platform: getSystemInfo().platform, // 添加登记信息的平台
            },
            callback: (rsp) => {
                if (rsp.result == 'success') {
                    // 成功了返回并去跳转支付页面
                    const { url, ad, subParams, sign} = this.$router.params;
                    const adData = Object.assign({}, ad, { pid:MARKETING_TYPE.modalVip, modalVipPid: ad.pid });
                    navigateBack();
                    goClick({
                        customType: AD_TYPE.FUWU_ORDER,
                        adData,
                        customUrl: `${url}&subParams=${subParams}&sign=${sign}`,
                    });
                }else{
                    showConfirmModal({ content: '用户名或支付宝账号存储失败，请重试.', showCancel:false });
                }
            },
        });
    }

    render () {
        const { app } = ENV;
        return (
            <View className='alipay-page'>
                <View className='header-bg'>
                    <Image className='header-img' src={'//q.aiyongtech.com/item/web/images/orders/autoVipBg.png'}></Image>
                    <View className='header-text-notice'>*付款时不开启自动续费，视为默认放弃活动*</View>
                    <View className='introduct-text'>开启自动续费示例如下：</View>
                </View>
                <Image className='notice-gif' src={app == 'item' ? '//q.aiyongtech.com/item/web/images/orders/sp.gif' : '//q.aiyongtech.com/item/web/images/orders/jy.gif'}></Image>
                <View className='introduct-text'>用户须知：</View>
                <Text className='introduct-text'>由于服务市场付费金额限制，需先填写以下支付宝及实</Text>
                <View>
                    <Text className='introduct-text'>名信息，支付52元，次日即可自动</Text>
                    <Text className='introduct-text introduct-margin'>返现20元</Text>
                    <Text className='introduct-text introduct-margin'>至您输入的</Text>
                </View>
                <Text className='introduct-text'>支付宝账户中。每个商户仅限一次！</Text>
                <AtForm
                    className='form-content'
                    onSubmit={this.onSubmit.bind(this)}
                >
                    <AtInput
                        className='form-input'
                        name='alipayName'
                        title='支付宝实名:'
                        type='text'
                    />
                    <AtInput
                        className='form-input form-bottom'
                        name='alipayUser'
                        title='支付宝账号:'
                        type='text'
                    />
                    <Text className='introduct-from'>*返款信息务必填写正确，以免返款失败。</Text>
                    <AtButton className='alipay-button' formType='submit'>确认</AtButton>
                </AtForm>
            </View>
        );
    }
}
export default getAlipayDataPage;
