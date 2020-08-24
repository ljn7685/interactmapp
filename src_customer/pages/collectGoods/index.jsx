import React, { Component } from 'react';
import Taro from "@tarojs/taro";
import classNames from 'classnames';
import GameModal from '../../components/gameModal/gameModal';
import styles from "./index.module.scss";
import { connect } from 'react-redux';
import { View, Image, Text } from '@tarojs/components';
import { collectGoodAction, collectGoodItem } from '../../actions/game';
import { checkCollectedStatus } from '../../../public/cPromiseApi';

const GoodItem = (props) => {
    const { isCollect, data, onCollect } = props;
    return (<View className={styles['good-item']} onClick={isCollect ? () => {} : onCollect}>
        <Image className={styles['pic']} src={data.pic_url}></Image>
        <View className={styles['desc']}>
            <Text className={classNames(
                {
                    [styles['heart']]:isCollect,
                    [styles['empty-heart']]:!isCollect,
                },
                "iconfont")}
            ></Text>
            {isCollect ? '收藏成功' : '点击收藏'}
        </View>
    </View>);
};
 
@connect(({ game }) => {
    return { userinfo: game.userinfo };
}, { collectGoodAction, collectGoodItem })
class CollectGoods extends Component {
    constructor (props) {
        super(props);
        this.state = { check_collected:[] };
    }
    componentDidMount () {
        const { userinfo: { game_config:{ goods } } } = this.props;
        goods && goods.forEach(item => {
            this.checkCollected(item);
        });
    }
    /**
     *  检查收藏状态
     * @param {*} item 
     */
    async checkCollected (item) {
        const { userinfo: { collect_goods } } = this.props;
        const isCollect = Array.isArray(collect_goods) ? collect_goods.filter(good => good.num_iid === item.num_iid).length > 0 : false ;
        if(!isCollect) {
            const res = await  checkCollectedStatus(item.num_iid);
            console.log('检查收藏状态', res);
            if(res.isCollect) {
                this.setState({ check_collected:this.state.check_collected.concat(item.num_iid) });
            }
        }
    }
    render () { 
        const { onClose,  userinfo: { game_config, collect_goods }, collectGoodAction } = this.props;
        const { check_collected } = this.state;
        const collect_total = game_config.maxCollectNum;
        const goods = game_config.goods;
        const title = `每收藏1个产品，获得1次游戏机会最多${collect_total}次`;
        const collect_ids = Array.isArray(collect_goods) ? collect_goods : [];
        const onCollect =  (item) => {
            if(collect_ids.length < collect_total) {
                collectGoodAction(item, game_config);
            } else {
                Taro.showToast({ title:"已达到最大收藏次数" });
            }
        };
        return (<GameModal visible title={title} onClose={onClose} contentStyle={styles['content']} headerStyle={styles['header']} titleStyle={styles['title']} containerStyle={styles['container']}>
            {goods && goods.map(item => {
                const isCollect = collect_ids.filter(good => Number(good) === item.num_iid).length > 0 || check_collected.filter(good => Number(good) === item.num_iid).length > 0;
                return (
                    <GoodItem key={item.num_iid} data={item} isCollect={isCollect} onCollect={onCollect.bind(this, item)} />
                );})}
        </GameModal>);
    }
}
 
export default CollectGoods;