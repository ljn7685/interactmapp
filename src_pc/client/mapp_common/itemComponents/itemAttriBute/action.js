import Taro from '@tarojs/taro';
import { isEmpty, consoleLogger } from "tradePolyfills";
import {taobaoItempropsGet,taobaoItemCatPropsGet} from 'tradePublic/itemTopApi/taobaoItemCat';
import { itemBeacon } from 'mapp_common/utils/beacon';
import {showModal, toast} from 'tradePublic/itemDetail/common';
import {updateInputStr} from 'tradePublic/itemTopApi/taobaoItemUpdate';
import {taobaoItemSellerGet} from 'tradePublic/itemTopApi/taobaoItemSellerGet';

/*
 * @Description 获取redux中的所有宝贝属性信息
*/
export const getState = () => {
    return Taro.getApp().store.getState().itemAttributeReducer;
};

/*
 * @Description 先清理再更新redux中的宝贝属性信息
*/
export const claer_after_update_dispatch = (data) => {
    let clearData = JSON.parse(JSON.stringify(data));
    Object.keys(clearData).forEach((key)=>{
        switch(typeof clearData[key]){
            case 'string':
                clearData[key] = '';
                break;
            case 'object':
                if(Array.isArray(clearData[key])){
                    clearData[key] = [];
                }else{
                    clearData[key] = {};
                }
                break;
            case 'number':
                clearData[key] = 0;
                break;
            case 'boolean':
                clearData[key] = false;
                break;
            default:
                break;
        }
    })
    consoleLogger.log('log~~~~', '开始清理宝贝属性页面的redux', clearData);
    Taro.getApp().store.dispatch({ type: "UPDATE_ITEM_ATTRIBUTE_DATA", data:clearData });
    dispatch(data);
}

/*
 * @Description 更新redux中的宝贝属性信息
*/
export const dispatch = (data) => {
    consoleLogger.log('log~~~~', '开始改变宝贝属性页面的redux', data);
    Taro.getApp().store.dispatch({ type: "UPDATE_ITEM_ATTRIBUTE_DATA", data });
};


export const initPageDefaultData = ()=>{
    dispatch({
        isUpdate:false, //是否进行过更新
        isSubmit:false, //是否进行了保存
        showListOrSearch:'list', //控制哪个页面(list|search)
        searchKey:'', //搜索的关键字
        searchIndex:0, //搜索的是哪个第几个属性下的数据
        selectedSearch:{}, //搜索选中的数据
        searchDataResult:[], //搜索列表数据
        searchPageType:'', //搜索页面的类型 multiCheck|singleCheck
        attriButeArray:[],//list中展示的数组
        isGetAllData:false,//是否获取到了全部的显示数据
    })
}

/**
 * 页面回调
 * @export
 */
export function pageCallback(){
    return new Promise((resolve, reject)=>{
        let {attriButeArray} = getState();
        let props = '';
        let propsName = '';
        attriButeArray.map((item)=>{
            if(!isEmpty(item.selected_vid)){
                if(item.show_type == 'multiCheck'){
                    let selectedVidArr = item.selected_vid.split(',');
                    let selectedVidNameArr = item.selected_vid_name.split(',');
                    for (const index in selectedVidArr) {
                        props += item.pid+':'+selectedVidArr[index]+';';
                        propsName += item.pid+':'+selectedVidArr[index]+':'+item.name+':'+selectedVidNameArr[index]+';'
                    }
                }else{
                    props += item.pid+':'+item.selected_vid+';';
                    propsName += item.pid+':'+item.selected_vid+':'+item.name+':'+item.selected_vid_name+';'
                }
            }
        })
        if(!isEmpty(props)){
            props = props.slice(0,-1);
        }
        if(!isEmpty(propsName)){
            propsName = propsName.slice(0,-1);
        }
        resolve({props:props,props_name:propsName});
    })
}

/**
 * 初始化宝贝属性数据
 * @param {*} dataSource
 */
export function initItemPropsData(dataSource){
    Promise.all([
        //获取宝贝信息
        new Promise((resolve, reject)=>{
            taobaoItemSellerGet({
                fields:'props_name,sku',
                num_iid:dataSource.num_iid,
                callback:(res)=>{
                    resolve(res);
                },
                errCallback:(error)=>{
                    consoleLogger.error('获取宝贝信息失败！'+JSON.stringify(error));
                    resolve(error);
                }
            })
        }),
        getItemCatProps(dataSource),
    ]).then((res)=>{
        consoleLogger.log('initItemPropsData-then',res);
        let result = res[0];
        let propsName = result.item.props_name.split(';');
        let propsPidJson = {}
        propsName.map((item)=>{
            let itemArr = item.split(':');
            let itemjson = {pid:itemArr[0],vid:itemArr[1],pid_name:itemArr[2],vid_name:itemArr[3]}
            if(isEmpty(propsPidJson[itemjson.pid])){
                propsPidJson[itemArr[0]] = [itemjson];
            }else{
                propsPidJson[itemArr[0]].push(itemjson);
            }
        })
        let data = JSON.parse(JSON.stringify(res[1]));
        let itemProp = data.item_props.item_prop;
        let attriButeArray = [];
        itemProp.map((item,index)=>{
            //默认带箭头，点击之后在确定是输入框还是换界面
            item.show_type = 'singleCheck';
            if(!isEmpty(propsPidJson[item.pid])){
                let selectedVidArr = [];
                let selectedVidNameArr = [];
                for (const iterator of propsPidJson[item.pid]) {
                    selectedVidArr.push(iterator.vid)
                    selectedVidNameArr.push(iterator.vid_name)
                }
                item.selected_vid = selectedVidArr.join(',');
                item.selected_vid_name = selectedVidNameArr.join(',');
            }
            attriButeArray.push(item);
        })
        claer_after_update_dispatch({
            attriButeArray,
            cid:dataSource.cid,
            numIid:dataSource.num_iid,
            itemCatProps:JSON.parse(JSON.stringify(res[1])),
            isGetAllData:true,
        })
    })
}

/**
 * 获取标准商品类目属性
 * @param {*} dataSource
 */
function getItemCatProps(dataSource){
    return new Promise((resolve, reject)=>{
        let {cid,itemCatProps} = getState();
        if(!isEmpty(cid) && cid == dataSource.cid){
            resolve(itemCatProps);
        }else{
            dispatch({
                itemCatProps:{},
            })
            taobaoItempropsGet({
                fields:'pid,parent_pid,parent_vid,name,is_key_prop,is_sale_prop,is_color_prop,is_enum_prop,is_item_prop,must,multi,status,sort_order,child_template,is_allow_alias,is_input_prop,features,taosir_do,is_material,material_do',
                cid:dataSource.cid,
                callback:(res)=>{
                    resolve(res);
                },
                errCallback:(error)=>{
                    consoleLogger.error('获取类目信息失败！'+JSON.stringify(error));
                    showModal({
                        content: '获取类目信息失败！'+JSON.stringify(error),
                        showCancel: false
                    })
                    resolve(error);
                }
            })
        }
    })
}

/**
 * 改变搜索关键字的值
 * @memberof ItemAttriBute
 */
export const changeSearchKey = (e) =>{
    dispatch({
        searchKey:e.target.value,
    })
}

/**
 * 点击搜索的逻辑
 * @memberof ItemAttriBute
 */
export const searchKeyResult = (pageNo=1) => {
    let {itemCatProps,attriButeArray,searchKey,searchIndex,propValuesPageSize} = getState();
    let searchDataResult = [];
    if(isEmpty(searchKey)){
        searchDataResult = attriButeArray[searchIndex].prop_values.prop_value;
    }else{
        attriButeArray[searchIndex].prop_values.page_no = pageNo;
        //最大的显示数量 和 当前页码有关系
        let maxLenght  = propValuesPageSize*attriButeArray[searchIndex].prop_values.page_no;
        //从全部的属性值中遍历
        for (const item of itemCatProps.item_props.item_prop[searchIndex].prop_values.prop_value) {
            //存在关键词
            if(item.name.indexOf(searchKey) != -1){
                //最大的显示数量
                if(searchDataResult.length <= maxLenght){
                    searchDataResult.push(item);
                }else{
                    break;
                }
            }
        }
    }
    claer_after_update_dispatch({
        searchDataResult:searchDataResult,
        attriButeArray:attriButeArray,
    })
}

/**
 * 改变list页面可输入类型的属性值
 * @memberof ItemAttriBute
 */
export const changeInputValue = (e,index) => {
    let {attriButeArray} = getState();
    attriButeArray[index].selected_vid_name = e.target.value;

    claer_after_update_dispatch({
        attriButeArray:attriButeArray,
        isUpdate:true,
    })
}

/** 
 * 获取单挑属性的值,获取过一次就会保存住结果
*/
const getSinglePropsValue = (index,item) => {
    return new Promise((resolve, reject)=>{
        let { cid, itemCatProps } = getState();
        if(isEmpty(itemCatProps.item_props.item_prop[index].prop_values)){
            Taro.showLoading({
                title: 'loading',
                mask:true,
            })
            taobaoItempropsGet({
                fields:'prop_values',
                cid:cid,
                pid:item.pid,
                callback:(res)=>{
                    Taro.hideLoading();
                    resolve(res.item_props.item_prop[0]);
                },
                errCallback:(error)=>{
                    Taro.hideLoading();
                    consoleLogger.error('获取单个属性的值失败！'+JSON.stringify(error));
                    showModal({
                        content: '获取单个属性的值失败！'+JSON.stringify(error),
                        showCancel: false
                    })
                }
            })
        }else{
            resolve(itemCatProps.item_props.item_prop[index]);
        }
    })
}

/**
 * 点击属性key去获取可选值 或者 改成输入框的方法
 * @param {*} index
 * @memberof ItemAttriBute
 */
export const clickSingleRow = async (index,item) => {
    let { itemCatProps, propValuesPageSize } = getState();
    let singleItemProp = await getSinglePropsValue(index,item);
    let searchDataResult = [];
    let searchPageType = '';
    let selectedSearch = {};
    //控制着显示着那个列表
    let showListOrSearch = 'list';
    if(isEmpty(singleItemProp.prop_values)){
        //直接输入
        if (!item.multi) {
            item.show_type = 'input';
        }
    }else{
        showListOrSearch = 'search';
        //多选
        if (item.multi) {
            item.show_type = 'multiCheck';
        //单选
        } else if (!item.multi) {
            item.show_type = 'singleCheck';
        }
        //将数据深复制到 reducer 的 itemCatProps、attriButeArray 中
        itemCatProps.item_props.item_prop[index].prop_values = JSON.parse(JSON.stringify(singleItemProp.prop_values));
        item.prop_values = JSON.parse(JSON.stringify(singleItemProp.prop_values));
        //处理一下 prop_values 属性，将数组进行分组
        item.prop_values.page_no = 1;
        let sliceArr = item.prop_values.prop_value.slice((item.prop_values.page_no-1)*propValuesPageSize,item.prop_values.page_no*propValuesPageSize);
        item.prop_values.prop_value = sliceArr;
        searchDataResult = item.prop_values.prop_value;
        searchPageType = item.show_type;
        if(searchPageType == 'multiCheck'){
            if(!isEmpty(item.selected_vid)){
                searchDataResult.map((vidItem)=>{
                    if(item.selected_vid.includes(vidItem.vid)){
                        selectedSearch[vidItem.vid] = vidItem;
                    }
                })
            }
        //单选
        }else{
            selectedSearch[0] = {vid:item.selected_vid,name:item.selected_vid_name}
        }
    }
    claer_after_update_dispatch({
        itemCatProps:itemCatProps,
        searchPageType:searchPageType,
        showListOrSearch:showListOrSearch,
        isSubmit:false,
        searchIndex:index,
        searchDataResult:searchDataResult,
        selectedSearch:selectedSearch,
    })
}

/**
 * 保存修改
 * @memberof SellerShopCat
 */
export const submit = (backPage) => {
    itemBeacon({func:'propertysave' , flag:false});
    let { numIid, attriButeArray, searchIndex, selectedSearch, showListOrSearch, searchPageType } = getState();
    if (showListOrSearch == 'list') {
        let props = '';
        let inputStr = '';
        let inputPids = '';
        for (const item of attriButeArray) {
            if(item.must && isEmpty(item.selected_vid)){
                toast('none','必填项不能为空！');
                return;
            }
            //填充的属性值
            let selectedVid = ' ';
            //填充的属性名字
            let selectedVidName = ' ';
            if(!isEmpty(item.selected_vid) && !isEmpty(item.selected_vid_name)){
                selectedVid = item.selected_vid;
                selectedVidName = item.selected_vid_name;
                switch(item.show_type){
                    //多选
                    case 'multiCheck':
                        let selectedVidArr = selectedVid.split(',');
                        for (const selectedVid of selectedVidArr) {
                            props += item.pid+":"+selectedVid+";"
                        }
                        break;
                    //单选
                    case 'singleCheck':
                        props += item.pid+":"+selectedVid+";"
                        break;
                    //自定义属性输入
                    case 'input':
                        inputPids += item.pid + ",";
                        inputStr +=  selectedVidName+ ",";
                        break;
                    default:
                        break;
                }
            }
        }
        if(!isEmpty(inputStr)){
            inputStr = inputStr.slice(0,-1);
        }
        if(!isEmpty(inputPids)){
            inputPids = inputPids.slice(0,-1);
        }
        updateInputStr({
            props: props,
            input_str: inputStr,
            input_pids: inputPids,
            num_iid: numIid,
            callback:(result)=>{
                toast('success','宝贝属性修改成功！');
                claer_after_update_dispatch({
                    isSubmit:true,
                })
                backPage();
            },
            errCallback:(error)=>{
                showModal({
                    content: '修改宝贝属性失败！'+JSON.stringify(error),
                    showCancel: false
                })
            }
        })
    }else{
        if(searchPageType == 'multiCheck'){
            //处理搜索页面的多选
            let selectedVidArr = [];
            let selectedVidNameArr = [];
            Object.keys(selectedSearch).forEach((key)=>{
                selectedVidArr.push(selectedSearch[key].vid);
                selectedVidNameArr.push(selectedSearch[key].name);
            })
            attriButeArray[searchIndex].selected_vid = selectedVidArr.join(',');
            attriButeArray[searchIndex].selected_vid_name = selectedVidNameArr.join(',');
        }else{
            //处理单选提交
            let item = selectedSearch[0];
            if(!isEmpty(item)){
                attriButeArray[searchIndex].selected_vid = String(item.vid);
                attriButeArray[searchIndex].selected_vid_name = item.name;
            }else{
                attriButeArray[searchIndex].selected_vid = '';
                attriButeArray[searchIndex].selected_vid_name = '';
            }
        }
        claer_after_update_dispatch({
            showListOrSearch:'list',
            searchKey:'',
            selectedSearch:{},
            isUpdate:true,
            attriButeArray:attriButeArray,
        })
    }
}

/**
 * 选中属性值 (单选)
 * @memberof ItemAttriBute
 */
export const selectSinglePropsValue = (item) => {
    let {selectedSearch} = getState();
    if(isEmpty(selectedSearch[0]) || selectedSearch[0].vid!=item.vid){
        selectedSearch[0] = item;
    }else{
        delete selectedSearch[0];
    }
    claer_after_update_dispatch({
        selectedSearch:selectedSearch,
    })
}

/**
 * 选中属性值 (多选)
 * @memberof ItemAttriBute
 */
export const selectMultiPropsValue = (item) => {
    let {selectedSearch} = getState();
    if(isEmpty(selectedSearch[item.vid])){
        selectedSearch[item.vid] = item;
    }else{
        delete selectedSearch[item.vid];
    }
    claer_after_update_dispatch({
        selectedSearch,
    })
}

/**
 * 改变当前属性的选项值
 * @memberof ItemAttriBute
 */
export const changeNowPropsData = (pageNo) => {
    let { attriButeArray,searchIndex,searchDataResult,propValuesPageSize,itemCatProps } = getState();
    //深复制一波防止改变数据源中的值
    let res = JSON.parse(JSON.stringify(itemCatProps));
    let nowAttriButeItem = attriButeArray[searchIndex];
    let sliceArr = res.item_props.item_prop[searchIndex].prop_values.prop_value.slice((pageNo-1)*propValuesPageSize,pageNo*propValuesPageSize);
    //第一页之后赋值就好了，上面👆已经将数组截取出来了
    if(pageNo == 1){
        nowAttriButeItem.prop_values.prop_value = sliceArr;
        searchDataResult = nowAttriButeItem.prop_values.prop_value;
    //除了第一页之后的数据，拼接到原来的数组中就好了
    }else if(sliceArr.length > 0){
        nowAttriButeItem.prop_values.prop_value = nowAttriButeItem.prop_values.prop_value.concat(sliceArr);
        searchDataResult = nowAttriButeItem.prop_values.prop_value;
    //走到这里说明没有本页没有数据了，将页码回退一个
    }else{
        pageNo--;
    }
    nowAttriButeItem.prop_values.page_no = pageNo;
    Taro.hideLoading();
    claer_after_update_dispatch({
        attriButeArray,
        searchDataResult,
    })
}

/**
 * 上拉刷新
 * @memberof ItemAttriBute
 */
export const onScrollToUpper = () =>{
    Taro.showLoading({
        title: 'loading',
        mask:true,
    })
    consoleLogger.log('上拉刷新');
    let { searchKey } = getState();
    //这里需要判断一个逻辑 是否有搜索的词,如果有搜索的词需要走搜索下拉刷新逻辑
    if(isEmpty(searchKey)){
        changeNowPropsData(1);
    }else{
        searchKeyResult(1);
    }
}

/**
 * 下拉加载
 * @memberof ItemAttriBute
 */
export const onScrollToLower = () =>{
    Taro.showLoading({
        title: 'loading',
        mask:true,
    })
    let { attriButeArray,searchIndex,searchKey } = getState();
    consoleLogger.log('下拉加载');
    let pageNo = attriButeArray[searchIndex].prop_values.page_no;
    pageNo++;
    //这里需要判断一个逻辑 是否有搜索的词,如果有搜索的词需要走搜索下拉刷新逻辑
    if(isEmpty(searchKey)){
        changeNowPropsData(pageNo);
    }else{
        searchKeyResult(pageNo);
    }
}
