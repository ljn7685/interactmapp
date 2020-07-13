import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss';

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rightCircleAnimationData: [],//左边动画
            leftCircleAnimationData: [],//右边动画
            showDynamic: true,
            scoreNum: ''
        };
    }
    componentWillMount() {
        this.initAnimation();
    }
    componentWillReceiveProps(nextProps) {
        const { score } = this.props;
        if (score != nextProps.score) {
            this.setState({
                showDynamic: nextProps.showDynamic
            }, () => {
                this.showScoreAnimation(nextProps)
            })
        }
    }
    initAnimation = () => {
        // 初始化分数圆圈位置
        const initAnimation = my.createAnimation({
            duration: 0,
            timingFunction: 'ease',
        });
        initAnimation.rotate(-135).step();
        const initAnimationData = initAnimation.export();
        this.setState({
            rightCircleAnimationData: initAnimationData,
            leftCircleAnimationData: initAnimationData,
        });
    }
    showScoreAnimation = (props) => {
        const { score } = props;
        if (score > 50) {
            const animation1 = my.createAnimation({
                duration: 300,
                timingFunction: 'ease',
            });
            animation1.rotate(-135 + 180).step();
            this.setState({ rightCircleAnimationData: animation1.export() });

            const animation2 = my.createAnimation({
                duration: 300,
                timingFunction: 'ease',
            });
            const leftAngle = Math.floor((score - 50) / 50 * 180);
            animation2.rotate(-135 + leftAngle).step({ delay: 300 });
            this.setState({ leftCircleAnimationData: animation2.export() });
        } else {
            const animation = my.createAnimation({
                duration: 500,
                timingFunction: 'ease',
            });
            const rightAngle = Math.floor(score / 50 * 180);
            animation.rotate(-135 + rightAngle).step();
            this.setState({ rightCircleAnimationData: animation.export() });
        }
        setTimeout(() => {
            this.setState({
                scoreNum: score + '%'
            })
        }, 500)
    }
    render() {
        const { leftCircleAnimationData, rightCircleAnimationData, showDynamic, scoreNum } = this.state;
        return (
            <View className='load-container'>
                {/* 动态圈圈 */}
                {
                    showDynamic && (
                        <View className='dynamic-box'>
                            <View className='spinner'>
                                <View className='circle'></View>
                            </View>
                        </View>
                    )
                }
                <View className={`circle-box ${showDynamic ? 'none' : ''}`}>
                    <View className='circle-out'>
                        <View className='loading-box'>
                            <View className='score-circle' style={{ opacity: showDynamic ? 0 : 1 }}>
                                <View className='score-circle-left'>
                                    <View className='left-circle' animation={leftCircleAnimationData}></View>
                                </View>
                                <View className='score-circle-right'>
                                    <View className='right-circle' animation={rightCircleAnimationData}></View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className={`num ${showDynamic ? 'none' : ''}`}>{scoreNum}</View>
            </View>
        )
    }
}

export default Loading;