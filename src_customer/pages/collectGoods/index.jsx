import React, { Component } from 'react';
import classNames from 'classnames';
import GameModal from '../../components/gameModal/gameModal';
import styles from "./index.module.scss";
import { connect } from 'react-redux';
import { View, Image, Text } from '@tarojs/components';
import { isEmpty } from '../../../public/util';

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
})
class CollectGoods extends Component {
    constructor (props) {
        super(props);
        this.state = {  };
    }
    render () { 
        const { onClose,  userinfo: { game_config, collect_goods } } = this.props;
        const collect_total = game_config.maxCollectNum;
        const goods = game_config.goods;
        const title = `每收藏1个产品，获得1次游戏机会最多${collect_total}次`;
        return (<GameModal visible title={title} onClose={onClose} contentStyle={styles['content']} headerStyle={styles['header']} titleStyle={styles['title']} containerStyle={styles['container']}>
            {goods && goods.map(item => {
                const isCollect = isEmpty(collect_goods) ? false : collect_goods.filter(good => good.num_iid === item.num_iid).length > 0;
                return (
                    <GoodItem key={item.num_iid} data={item} isCollect={isCollect} />
                );})}
        </GameModal>);
    }
}
 
export default CollectGoods;