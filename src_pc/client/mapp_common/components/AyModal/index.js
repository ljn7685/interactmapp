import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.scss'

/**
 * 爱用模态框
 *      支持属性
 *          isOpened    控制蒙层的展现
 *          onClose     蒙层关闭时执行的回调
 *          className   蒙层容器的className
 *          style       蒙层容器的style
 * @class AyModal
 * @extends {Component}
 */
class AyModal extends Component {
    constructor(props) {
        super(...arguments);

        const { isOpened } = props;
        this.state = {
            _isOpened: isOpened
        };
    }

    componentWillReceiveProps(nextProps) {
        const { isOpened } = nextProps;
        if (isOpened !== this.state._isOpened) {
            this.setState({
                _isOpened: isOpened
            });
        }
    }

    /**
     * 点击到了蒙层，准备关闭
     * @memberof AyModal
     */
    handleClickOverlay = () => {
        this.setState({
            _isOpened: false
        }, this.handleClose);
    };

    /**
     * 执行 onClose 回调
     * @memberof AyModal
     */
    handleClose = () => {
        this.props.onClose();
    };

    render(){
        const { _isOpened } = this.state;
        const {
            hasTitle,
            hasButtom,
            scrollY,
            scrollX,
            scrollTop,
            scrollLeft,
            upperThreshold,
            lowerThreshold,
            scrollWithAnimation,
        } = this.props;
        const rootClass = classNames('at-modal', {
            'at-modal--active': _isOpened
        }, this.props.className);
        return (
            <View className={rootClass} style={this.props.style}>
                <View onClick={this.handleClickOverlay} className="at-modal__overlay" />
                <View className="ay-modal__container">
                    {
                        hasTitle && (
                            <View className='ay-modal-title-body'>
                                {this.props.renderTitle}
                            </View>
                        )
                    }
                    <View className='ay-modal-content-body layout-body'>
                        <ScrollView
                        scrollY={scrollY}
                        scrollX={scrollX}
                        scrollTop={scrollTop}
                        scrollLeft={scrollLeft}
                        upperThreshold={upperThreshold}
                        lowerThreshold={lowerThreshold}
                        scrollWithAnimation={scrollWithAnimation}
                        onScroll={this.props.onScroll}
                        onScrollToLower={this.props.onScrollToLower}
                        onScrollToUpper={this.props.onScrollToUpper}
                        className='layout-body__content'
                        >
                            {this.props.children}
                        </ScrollView>
                    </View>
                    {
                        hasButtom && (
                            <View className='ay-modal-bottom-body'>
                                {this.props.renderBottom}
                            </View>
                        )
                    }
                    
                </View>
            </View>
        )

    }
}

AyModal.defaultProps = {
    hasTitle:false,
    hasButtom:false,
    isOpened: false,
    scrollY: true,
    scrollX: false,
    scrollWithAnimation: false,
    style:"",
    className:"",
    onClose:()=>{},
    onScroll: () => {},
    onScrollToLower: () => {},
    onScrollToUpper: () => {}
}

AyModal.propTypes = {
    hasTitle: PropTypes.bool,
    hasButton: PropTypes.bool,
    isOpened: PropTypes.bool,
    scrollY: PropTypes.bool,
    scrollX: PropTypes.bool,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number,
    upperThreshold: PropTypes.number,
    lowerThreshold: PropTypes.number,
    scrollWithAnimation: PropTypes.bool,
    onClose: PropTypes.func,
    onScroll: PropTypes.func,
    onScrollToLower: PropTypes.func,
    onScrollToUpper: PropTypes.func,
    style:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    className:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    onClose:PropTypes.func,
}


export default AyModal;
