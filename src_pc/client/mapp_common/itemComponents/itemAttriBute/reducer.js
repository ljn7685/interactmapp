const INITIAL_STATE = {
    isGetAllData:false,
    itemCatProps:{},//接口宝贝属性返回的数据
    propValuesPageSize:20,//props_value数组的分页长度
    cid:'',
    numIid:'',
    isUpdate:false, //是否进行过更新
    isSubmit:false, //是否进行了保存
    attriButeArray:[], //list页面展现的数据
    showListOrSearch:'list', //控制哪个页面(list|search)
    searchKey:'', //搜索的关键字
    searchIndex:0, //搜索的是哪个第几个属性下的数据
    selectedSearch:{}, //搜索选中的数据
    searchDataResult:[], //搜索列表数据
    searchPageType:'', //搜索页面的类型 multiCheck|singleCheck
};

export default function updateItemAttributeData(state = INITIAL_STATE, action){
    const { type, data } = action;
    switch (type) {
        case 'UPDATE_ITEM_ATTRIBUTE_DATA':
            console.log('UPDATE_ITEM_ATTRIBUTE_DATA',action);
            return Object.assign({}, state, data);
        default:
            return state;
    }
};
