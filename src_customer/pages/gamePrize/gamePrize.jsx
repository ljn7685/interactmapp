import React, { Component } from "react";
import { connect } from "react-redux";
import GameModal from "../../components/gameModal/gameModal";
import styles from "./gamePrize.module.scss";
import { View, Text, Image } from "@tarojs/components";
const coupon_img = "http://q.aiyongbao.com/interact/coupon.png";
class GamePrize extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {
            onClose,
            userinfo: {
                is_receive_rewards,
                active_rewards: { datas },
            },
        } = this.props;
        const prizes =
            is_receive_rewards && datas && datas.length > 0 ? [datas[0]] : [];
        return (
            <GameModal
                visible={true}
                onClose={onClose}
                containerStyle={styles.container}
                headerStyle={styles.header}
                contentStyle={styles.content}
                title="我的奖品"
            >
                {prizes.length === 0 ? (
                    <Text className={styles["prize-msg"]}>暂无中奖</Text>
                ) : (
                    prizes.map((item, index) => (
                        <View className={styles["prize-item"]} key={index}>
                            <Text className={styles["prize-desc"]}>
                                {`${item.amount / 100}元优惠券`}
                            </Text>
                            <View className={styles["prize-content"]}>
                                <Text
                                    className={`${styles["prize-amount"]} ${
                                        item.amount.toString().length < 3
                                            ? styles["two"]
                                            : styles["three"]
                                    }`}
                                >
                                    {item.amount / 100}
                                </Text>
                                <Image
                                    className={styles["prize-img"]}
                                    src={coupon_img}
                                    mode="widthFix"
                                ></Image>
                            </View>
                        </View>
                    ))
                )}
            </GameModal>
        );
    }
}
const mapStateToProps = ({ game }) => {
    return {
        userinfo: game.userinfo,
    };
};
const wrapper = connect(mapStateToProps, null)(GamePrize);
export default wrapper;
