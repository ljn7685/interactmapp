import React, { Component } from "react";
import { connect } from "react-redux";
import * as moment from 'moment';

import GameModal from "../../components/gameModal/gameModal";
import styles from "./gameRule.module.scss";
import { View, Text } from "@tarojs/components";

class GameRule extends Component {
    constructor (props) {
        super(props);
    }
    render () {
        const { onClose, game_rule } = this.props;
        const start_date = moment(game_rule.start_date).format('YYYY年MM月DD日');
        const end_date = moment(game_rule.end_date).format('YYYY年MM月DD日');
        const date = `${start_date}——${end_date}`;
        return (
            <GameModal
                contentStyle={styles["content"]}
                visible
                title='游戏规则'
                onClose={onClose}
            >
                <View className={styles["activity-time"]}>
                    活动时间：{date}
                </View>
                {game_rule.rules.map((item, index) => (
                    <Text className={styles["activity-rule"]} key={index}>
                        <Text className={styles["title"]}>{item.title}</Text>
                        <Text className={styles["desc"]}>{item.desc}</Text>
                    </Text>
                ))}
            </GameModal>
        );
    }
}
const mapStateToProps = ({ game }) => {
    return { game_rule: game.game_rule };
};
const wrapper = connect(mapStateToProps, null)(GameRule);
export default wrapper;
