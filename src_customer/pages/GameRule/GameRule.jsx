import React, { Component } from "react";
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
        const { onClose } = this.props;
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
                    活动时间：X月Y日——W月Z日
                </View>
                <Text className={styles["activity-rule"]}>
                    <Text className={styles["title"]}>
                        1.在此期间，通过以下方式可获得 游戏机会：
                    </Text>
                    <Text className={styles["desc"]}>
                        {`*首次参与活动，游戏机会*1（该游戏机会不会重复享有）
                        *关注店铺，游戏机会*1（该游戏机会不会重复享有）
                        *每日收藏1款产品，游戏机会*1（每日限获1次）
                        *分享1款产品给好友，仅有当好友打开分享链接后，游戏机会*1（机会可叠加，奖励次数到账或有系统延迟，视为正常现象）
                        `}
                    </Text>
                </Text>
                <Text className={styles["activity-rule"]}>
                    <Text className={styles["title"]}>2.奖品明细</Text>
                    <Text className={styles["desc"]}>
                        {`一等奖：大于12只口红 
                        二等奖：9-11只口红
                        三等奖：7-8只口红
                        幸运奖：5-6只口红
                        `}
                    </Text>
                </Text>
                <Text className={styles["activity-rule"]}>
                    <Text className={styles["title"]}>3.活动说明</Text>
                    <Text className={styles["desc"]}>
                        将底部的口红向上滑动即可插入转盘，规定时间内若碰到其他口红则挑战失败。
                    </Text>
                </Text>
            </Modal>
        );
    }
}

export default GameRule;
