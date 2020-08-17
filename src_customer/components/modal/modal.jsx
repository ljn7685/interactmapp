import React, { PureComponent } from "react";

import styles from "./modal.module.scss";
import classnames from "classnames";
import { View } from "@tarojs/components";
/**
 * 模态窗
 *      支持属性
 *          visible    控制蒙层的展现
 *          closeBtn   关闭按钮
 *          header     头部元素
 *          footer     尾部元素
 *          children   内容元素
 *          containerStyle     弹窗样式
 *          headerStyle        头部样式
 *          contentStyle       内容样式
 * @class Modal
 * @extends {PureComponent}
 */
class Modal extends PureComponent {
    constructor (props) {
        super(props);
        const { visible } = this.props;
        const rootStyle = classnames({
            [styles.overlay]: true,
            [styles.visible]: visible,
        });
        this.state = { rootStyle };
    }
    componentDidMount () {
        this.checkIfVisible();
    }
    componentDidUpdate (prevProps) {
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
        this.setState({ rootStyle });
    };
    render () {
        const {
            visible,
            closeBtn,
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
                onTouchStart={(event) => event.stopPropagation()}
            >
                <View
                    className={classnames({
                        [styles.container]: styles.container,
                        [containerStyle]: containerStyle,
                    })}
                >
                    <View
                        className={classnames({
                            [styles.header]: styles.header,
                            [headerStyle]: headerStyle,
                        })}
                    >
                        {header}
                        {closeBtn ? closeBtn : null}
                    </View>
                    <View className={classnames({
                        [styles.content]: styles.content,
                        [contentStyle]: contentStyle,
                    })}
                    >
                        {children}
                    </View>
                    {footer}
                </View>
            </View>
        );
    }
}
export default Modal;
