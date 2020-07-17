import React, { Component } from "react";
import { connect } from "react-redux";

import Modal from "../../components/Modal/Modal";
import styles from "./GameRule.module.scss";
import { View, Text, Image } from "@tarojs/components";
import heart_img from "../../assets/images/rule_heart.png";
import close_btn_img from "../../assets/images/close_btn.png";
class GameRule extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { onClose, game_rule } = this.props;
        const header = (
            <View className={styles["header-wrapper"]}>
                <Image
                    src={heart_img}
                    className={styles["heart-left"]}
                    mode="widthFix"
                ></Image>
                <Text className={styles.text}>游戏规则</Text>
                <Image
                    src={heart_img}
                    className={styles["heart-right"]}
                    mode="widthFix"
                ></Image>
            </View>
        );
        const closeBtn = (
            <Image
                src={close_btn_img}
                className={styles["close-btn"]}
                mode="widthFix"
                onClick={onClose}
            ></Image>
        );
        return (
            <Modal
                containerStyle={styles["container"]}
                headerStyle={styles["header"]}
                contentStyle={styles["content"]}
                header={header}
                visible={true}
                closeBtn={closeBtn}
            >
                <View className={styles["activity-time"]}>
                    活动时间：{game_rule.start_date}——{game_rule.end_date}
                </View>
                {game_rule.rules.map((item) => (
                    <Text className={styles["activity-rule"]}>
                        <Text className={styles["title"]}>{item.title}</Text>
                        <Text className={styles["desc"]}>{item.desc}</Text>
                    </Text>
                ))}
            </Modal>
        );
    }
}
const mapStateToProps = ({ game }) => {
    return {
        game_rule: game.game_rule,
    };
};
const wrapper = connect(mapStateToProps, null)(GameRule);
export default wrapper;
