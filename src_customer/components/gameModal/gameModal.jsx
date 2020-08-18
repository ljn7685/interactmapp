import React, { Component } from "react";
import { View, Image, Text } from "@tarojs/components";
import classNames from "classnames";
import Modal from "../modal/modal";
import styles from "./gameModal.module.scss";

const close_btn_img = "http://q.aiyongbao.com/interact/close_btn.png";
class GameModal extends Component {
    constructor (props) {
        super(props);
    }
    render () {
        const { onClose, containerStyle, headerStyle, title, showClose = true, showTitle = true, titleStyle } = this.props;
        const header = showTitle && (
            <View className={styles["header-wrapper"]}>
                <View
                    className={styles["heart-left"]}
                    mode='widthFix'
                ></View>
                <Text className={classNames(styles.text, { [titleStyle]:titleStyle })} >{title}</Text>
                <View
                    className={styles["heart-right"]}
                ></View>
            </View>
        );
        const closeBtn = showClose && (
            <Image
                src={close_btn_img}
                className={styles["close-btn"]}
                mode='widthFix'
                onClick={onClose}
            ></Image>
        );
        return (
            <Modal
                header={header}
                visible
                closeBtn={closeBtn}
                {...this.props}
                containerStyle={classNames({
                    [styles.container]: styles.container,
                    [containerStyle]: containerStyle,
                })}
                headerStyle={classNames({
                    [styles.header]: styles.header,
                    [headerStyle]: headerStyle,
                })}
            ></Modal>
        );
    }
}

export default GameModal;
