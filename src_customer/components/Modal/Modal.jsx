import React, { PureComponent } from "react";

import styles from "./Modal.module.scss";
import classnames from "classnames";
import { View } from "@tarojs/components";
class Modal extends PureComponent {
    constructor(props) {
        super(props);
        console.log("overlay style", styles.overlay);
        this.state = {
            rootStyle: classnames({ [styles.overlay]: true }),
        };
    }
    componentDidMount() {
        this.checkIfVisible();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.visible !== this.props.visible) {
            this.checkIfVisible();
        }
    }
    // 控制 overlay 的显示隐藏
    checkIfVisible = () => {
        const { visible } = this.props;
        const rootStyle = classnames({
            [styles.overlay]: true,
            [styles.visible]: visible,
        });
        this.setState({
            rootStyle,
        });
    };
    render() {
        const {
            visible,
            clostBtn,
            header,
            footer,
            children,
            containerStyle,
            headerStyle,
            contentStyle,
        } = this.props;
        const { rootStyle } = this.state;
        return (
            <View
                className={rootStyle}
                visible={visible}
                ref={(ref) => (this.root = ref)}
            >
                <View className={`${styles["container"]} ${containerStyle}`}>
                    <View className={`${styles["header"]} ${headerStyle}`}>
                        {header}
                        {clostBtn ? clostBtn : null}
                    </View>
                    <View className={`${styles["content"]} ${contentStyle}`}>
                        {children}
                    </View>
                    {footer}
                </View>
            </View>
        );
    }
}
export default Modal;
