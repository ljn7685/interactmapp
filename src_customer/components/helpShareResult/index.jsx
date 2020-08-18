import React, { Component } from "react";
import classNames from 'classnames';
import GameModal from "../gameModal/gameModal";
import styles from "./index.module.scss";
import { Text } from "@tarojs/components";
import GameButton from "../gameButton";

class HelpShareResult extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    render () {
        const { onClose, isSuccess } = this.props;
        return (
            <GameModal
                visible
                containerStyle={styles.container}
                contentStyle={styles.content}
                headerStyle={styles.header}
                onClose={onClose}
            >
                <Text className={classNames(styles.desc, { [styles.fail]:!isSuccess })}>
                    {isSuccess
                        ? `好友助力成功了～
                    快来一起参与游戏拿优惠券吧`
                        : `你已达到活动期间总助力次数上限啦
                    赶紧和好友一起参与游戏吧～`}
                </Text>
                <GameButton className={styles.btn} onClick={this.onClose}>
                    立即参与
                </GameButton>
            </GameModal>
        );
    }
}

export default HelpShareResult;
