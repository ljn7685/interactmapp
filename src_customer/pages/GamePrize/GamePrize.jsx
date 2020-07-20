import React, { Component } from "react";
import GameModal from "../../components/GameModal/GameModal";
import styles from "./GamePrize.module.scss";
class GamePrize extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { onClose } = this.props;
        return (
            <GameModal
                visible={true}
                onClose={onClose}
                containerStyle={styles.container}
                headerStyle={styles.header}
                title='我的奖品'
            ></GameModal>
        );
    }
}

export default GamePrize;
