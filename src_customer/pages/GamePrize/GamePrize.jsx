import React, { Component } from "react";
import { connect } from "react-redux";
import GameModal from "../../components/gameModal/gameModal";
import styles from "./gamePrize.module.scss";
import coupon_img from "../../assets/images/coupon.png";
import { View, Text, Image } from "@tarojs/components";
class GamePrize extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { onClose, prizes } = this.props;
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
                ) : prizes instanceof Array ? (
                    prizes.map((item) => (
                        <View className={styles["prize-item"]}>
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
                ) : (
                    <Text className={styles["prize-msg"]}>{prizes.msg}</Text>
                )}
            </GameModal>
        );
    }
}
const mapStateToProps = ({ game }) => {
    return {
        prizes: game.prizes,
    };
};
const wrapper = connect(mapStateToProps, null)(GamePrize);
export default wrapper;
