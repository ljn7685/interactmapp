import React, { Component } from "react";
import { Text } from "@tarojs/components";
import GameModal from "../gameModal/gameModal";
import GameButton from "../gameButton";
import styles from "./index.module.scss";
import { connect } from "react-redux";
import { helpShareUserAction } from "../../actions/game";

@connect(({ game }) => {
    return { userinfo: game.userinfo };
}, { helpShareUserAction })
class HelpShare extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    onClick=() => {
        const { userinfo:{ game_config }, helpShareUserAction, fromNick, openShareResult, onClose } = this.props;
        helpShareUserAction(fromNick, game_config, (res) => {
            onClose();
            openShareResult(res);
        });
    }
    render () {
        const { onClose, fromNick } = this.props;
        return (
            <GameModal
                visible
                containerStyle={styles.container}
                contentStyle={styles.content}
                headerStyle={styles.header}
                onClose={onClose}
            >
                <Text className={styles.title}>{fromNick}的助力邀请</Text>
                <Text className={styles.desc}>
                    {`快来和我一起参与游戏吧
                    游戏胜利后可获得店铺优惠券哦!`}
                </Text>
                <GameButton
                    className={styles.btn}
                    onClick={this.onClick}
                >
                    立即助力
                </GameButton>
            </GameModal>
        );
    }
}

export default HelpShare;
