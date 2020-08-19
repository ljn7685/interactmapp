import React, { Component } from "react";
import { View, Image, Text } from "@tarojs/components";
import classnames from "classnames";
import Modal from "../modal/modal";
import styles from "./gameModal.module.scss";
const heart_img = "http://q.aiyongtech.com/interact/rule_heart.png"
const close_btn_img = "http://q.aiyongtech.com/interact/close_btn.png"
class GameModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { onClose, containerStyle, headerStyle, title, showClose = true } = this.props;
        const header = (
            <View className={styles["header-wrapper"]}>
                <View
                    className={styles["heart-left"]}
                ></View>
                <Text className={styles.text}>{title}</Text>
                <View
                    className={styles["heart-right"]}
                ></View>
            </View>
        );
        const closeBtn = showClose && (
            <Image
                src={close_btn_img}
                className={styles["close-btn"]}
                mode="widthFix"
                onClick={onClose}
            ></Image>
        );
        return (
            <Modal
                header={header}
                visible={true}
                closeBtn={closeBtn}
                {...this.props}
                containerStyle={classnames({
                    [styles.container]: styles.container,
                    [containerStyle]: containerStyle,
                })}
                headerStyle={classnames({
                    [styles.header]: styles.header,
                    [headerStyle]: headerStyle,
                })}
            ></Modal>
        );
    }
}

export default GameModal;
