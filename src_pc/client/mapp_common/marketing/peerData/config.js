import { operateBeacon } from "mapp_common/utils/beacon";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { ENV } from "@/constants/env";
import { goLink } from "mapp_common/marketing/utils/biz";
import { getSystemInfo } from "mapp_common/utils/systemInfo";


/**
 * 
 * @param {*} type 埋点动作
 */
export const showBeacon = (type) => {
    const { vipRemain } = getUserInfo();
    if (vipRemain <= 90) {
        operateBeacon(type, '618-3mouths');
    } else if (vipRemain <= 270) {
        operateBeacon(type, '618-9mouths');
    } else if (vipRemain > 270) {
        operateBeacon(type, '618-up9mouths');
    }
}
/**
 * 图片定义
 */
export const imgUrl = '//q.aiyongtech.com/2020618/img/';
//商品数据
const itemList = [
    [{ src: `${imgUrl}watermark.png`, title: '主图水印', content: '提升大促期间宝贝点击率', srced: `${imgUrl}watermark_grey.png`, type: 'watermark' },
    { src: `${imgUrl}sales.png`, title: '关联销售', content: '智能推荐 轻松打造爆款宝贝', srced: `${imgUrl}sales_grey.png`, type: 'relate' },
    { src: `${imgUrl}video.png`, title: '主图视频', content: '提升访客停留时间 多维度提升转化率', srced: `${imgUrl}video_grey.png`, type: 'shortvideo' },
    { src: `${imgUrl}activity.png`, title: '活动页装修', content: '丰富营销手段 多渠道推广', srced: `${imgUrl}activity_grey.png`, type: 'activepage' }],
    [{ src: `${imgUrl}title.png`, title: '标题优化', content: '提升展现排名 增加点击流量', srced: `${imgUrl}title_grey.png`, type: 'titleopt' },
    { src: `${imgUrl}mobile.png`, title: '手机详情', content: '智能推荐 无法报名大促活动 错失流量红利', srced: `${imgUrl}mobile_grey.png`, type: 'mdetail' },
    { src: `${imgUrl}auto.png`, title: '自动上下架', content: '一键引爆高峰流量', srced: `${imgUrl}auto_grey.png`, type: 'autoadjust' },
    { src: `${imgUrl}time.png`, title: '定时上下架', content: '智能分布 搜索权重增加30%', srced: `${imgUrl}time_grey.png`, type: 'doitemupdown' }],
    [{ src: `${imgUrl}discount.png`, title: '促销打折', content: '提升展现排名 增加点击流量', srced: `${imgUrl}discount_grey.png`, type: 'share' },
    { src: `${imgUrl}full.png`, title: '满减优惠', content: '无法报名大促活动 错失流量红利', srced: `${imgUrl}full_grey.png`, type: 'prom' },
    { src: `${imgUrl}share.png`, title: '分享宝贝', content: '一键引爆高峰流量', srced: `${imgUrl}share_grey.png`, type: 'full' }]
]
//交易数据
const tradeList = [
    [{ src: `${imgUrl}contract.png`, used: false, title: '自动合单', content: '同买家订单自动合单，平均可节省20%单号。' },
    { src: `${imgUrl}urge.png`, used: false, title: '催付管理', content: '待付款适时提醒买家付款，提高30%成交率。' },
    { src: `${imgUrl}message.png`, used: false, title: '短信营销', content: '营销活动直接触达老用户，提升35%+复购率。' }],
    [{ src: `${imgUrl}auto_review.png`, used: false, title: '自动评价', content: '多种方式评价，抓紧大促机会提升店铺DSR。' },
    { src: `${imgUrl}review.png`, used: false, title: '差评拦截', content: '19种拦截规则，可自定义设置拦截方式。' },
    { src: `${imgUrl}appraise.png`, used: false, title: '批量评价', content: '支持批量评价，可查看店铺信誉，动态评分。' },
    { src: `${imgUrl}negative_review.png`, used: false, title: '中差评管理', content: '收到中差评立即通知，方便第一时间联系挽回。' }],
    [{ src: `${imgUrl}order.png`, used: false, title: '订单管理', content: '订单处理及时响应，批量操作提升工作效率。' },
    { src: `${imgUrl}search.png`, used: false, title: '高级搜索', content: '多种方式精准筛选，手机端还可通过扫码搜索。' },
    { src: `${imgUrl}code.png`, used: false, title: '扫码发货', content: '手机蓝牙连接打印机，随时享受打单的便捷。' },
    { src: `${imgUrl}delivery.png`, used: false, title: '批量发货', content: '一键发货，自动填充运单号稳定靠谱不漏单。' }]
]
export const mapList = ENV.app == 'item' ? itemList : tradeList;

const goToUrl = {
    'hight': {
        'trade': {
            'Android': {
                'timeTo3mouths': 'https://fuwu.taobao.com/ser/confirmOrder1.htm?commonParams=activityCode%3AACT_877021141_200515115959%3BagentId%3Afuwu.taobao.com%7Cmarketing-Order-0%3BmarketKey%3AFWSPP_MARKETING_URL%3BpromIds%3A%5B1005587752%5D&subParams=cycleNum%3A12%2CcycleUnit%3A2%2CitemCode%3AFW_GOODS-1827490-v2&sign=671642DD6BD2F636576A16F20A5DCD1A&spm=a313p.266.ei5lud.1135641263556&short_name=Y4.bkhIP&app=chrome',
                'timeTo9mouths': 'https://fuwu.taobao.com/ser/confirmOrder1.htm?commonParams=activityCode%3AACT_877021141_200515115959%3BagentId%3Afuwu.taobao.com%7Cmarketing-Order-0%3BmarketKey%3AFWSPP_MARKETING_URL%3BpromIds%3A%5B1005587752%5D&subParams=cycleNum%3A6%2CcycleUnit%3A2%2CitemCode%3AFW_GOODS-1827490-v2&sign=781A0C3EB176C4B4320B63A28AC2E550&spm=a313p.266.ei5lud.1136311957584&short_name=Y4.b6Pq5&app=chrome',
                'timeUp9mouths': 'https://fuwu.taobao.com/ser/confirmOrder1.htm?commonParams=activityCode%3AACT_877021141_200515115959%3BagentId%3Afuwu.taobao.com%7Cmarketing-Order-0%3BmarketKey%3AFWSPP_MARKETING_URL%3BpromIds%3A%5B1005587752%5D&subParams=cycleNum%3A3%2CcycleUnit%3A2%2CitemCode%3AFW_GOODS-1827490-v2&sign=C5AC1555A6E1D32848B351F6FEFF454F&spm=a313p.266.ei5lud.1134941851094&short_name=Y4.b7AL5&app=chrome'
            },
            'iOS': {
                'timeTo3mouths': 'https://c.tb.cn/Y4.bRZS7',
                'timeTo9mouths': 'https://c.tb.cn/Y4.bTC5d',
                'timeUp9mouths': 'https://c.tb.cn/Y4.bj6k5'
            }
        },
        'item': {
            'Android': {
                'timeTo3mouths': 'https://fuwu.taobao.com/ser/confirmOrder1.htm?commonParams=activityCode%3AACT_877021141_200515115845%3BagentId%3Afuwu.taobao.com%7Cmarketing-Order-0%3BmarketKey%3AFWSPP_MARKETING_URL%3BpromIds%3A%5B1005589323%5D&subParams=cycleNum%3A12%2CcycleUnit%3A2%2CitemCode%3AFW_GOODS-1828810-v2&sign=C0D9F07C4C5B24511C73DE11D2B6DB14&spm=a313p.266.ei5lud.1134940456877&short_name=Y4.bgWbH&app=chrome',
                'timeTo9mouths': 'https://fuwu.taobao.com/ser/confirmOrder1.htm?commonParams=activityCode%3AACT_877021141_200515115845%3BagentId%3Afuwu.taobao.com%7Cmarketing-Order-0%3BmarketKey%3AFWSPP_MARKETING_URL%3BpromIds%3A%5B1005589323%5D&subParams=cycleNum%3A6%2CcycleUnit%3A2%2CitemCode%3AFW_GOODS-1828810-v2&sign=4282460E6DB43F85A9C307DF292C0F8A&spm=a313p.266.ei5lud.1136312670220&short_name=Y4.bSkaD&app=chrome',
                'timeUp9mouths': 'https://fuwu.taobao.com/ser/confirmOrder1.htm?commonParams=activityCode%3AACT_877021141_200515115845%3BagentId%3Afuwu.taobao.com%7Cmarketing-Order-0%3BmarketKey%3AFWSPP_MARKETING_URL%3BpromIds%3A%5B1005589323%5D&subParams=cycleNum%3A3%2CcycleUnit%3A2%2CitemCode%3AFW_GOODS-1828810-v2&sign=E631FA26631726E481DF270CDFCEB4EC&spm=a313p.266.ei5lud.1135640663943&short_name=Y4.b61J3&app=chrome'
            },
            'iOS': {
                'timeTo3mouths': 'https://c.tb.cn/Y4.b8JS7',
                'timeTo9mouths': 'https://c.tb.cn/Y4.bRab6',
                'timeUp9mouths': 'https://c.tb.cn/Y4.b7hiZ'
            }
        }
    },
    'free': {
        'trade': {
            'Android': 'https://fuwu.taobao.com/ser/confirmOrder1.htm?commonParams=activityCode%3AACT_877021141_200520171227%3BagentId%3Afuwu.taobao.com%7Cmarketing-Order-0%3BmarketKey%3AFWSPP_MARKETING_URL%3BpromIds%3A%5B1005608568%5D&subParams=cycleNum%3A6%2CcycleUnit%3A2%2CitemCode%3AFW_GOODS-1827490-v2&sign=80AB473AB321D772161B8D3FF77EEB22&spm=a313p.266.ei5lud.1137964559511&short_name=Y4.bl0PO&app=chrome',
            'iOS': 'https://c.tb.cn/Y4.bm65y'
        },
        'item': {
            'Android': 'https://fuwu.taobao.com/ser/confirmOrder1.htm?commonParams=activityCode%3AACT_877021141_200520170001%3BagentId%3Afuwu.taobao.com%7Cmarketing-Order-0%3BmarketKey%3AFWSPP_MARKETING_URL%3BpromIds%3A%5B1005609276%5D&subParams=cycleNum%3A6%2CcycleUnit%3A2%2CitemCode%3AFW_GOODS-1828810-v2&sign=F6044DD74D3F5D95647D571351503417&spm=a313p.266.ei5lud.1137286464244&short_name=Y4.bOLS7&app=chrome',
            'iOS': 'https://c.tb.cn/Y4.bmB6m'
        }
    }
}
//跳转事件
export const goToBuy = () => {
    let { vipRemain, vipFlag } = getUserInfo();
    let app = ENV.app;
    let level = vipFlag ? 'hight' : 'free';
    let platform = getSystemInfo().platform;
    let link = goToUrl[level][app][platform];
    if (vipFlag) {
        if (vipRemain <= 90) {
            link = link['timeTo3mouths'];
        } else if (vipRemain <= 270) {
            link = link['timeTo9mouths'];
        } else if (vipRemain > 270) {
            link = link['timeUp9mouths'];
        }
    }
    goLink(link);
}
/**
 * 控制入口是否展现的pid
 */
const pidsPeer = {
    'hight': {
        'item': {
            'pid3mouths': '4188',
            'pid9mouths': '4189'
        },
        'trade': {
            'pid3mouths': '4185',
            'pid9mouths': '4186',
        }
    },
    'free': {
        'item': '4187',
        'trade': '4184'
    }
}
/**
 * 取出pids
 */
export const getPeerPid =()=>{
    let { vipRemain, vipFlag } = getUserInfo();
    let app = ENV.app;
    let level = vipFlag ? 'hight' : 'free';
    let pid = pidsPeer[level][app];
    if(vipFlag){
        if(vipRemain <= 90){
            pid = pid['pid3mouths'];
        }else if(vipRemain <= 270){
            pid = pid['pid9mouths'];
        }else if(vipRemain > 270){
            return;
        }
    }
    return pid;
}