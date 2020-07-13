import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { events } from "mapp_common/utils/eventManager";
import { Logger } from "mapp_common/utils/logger";
import './index.scss';

// eslint-disable-next-line import/no-mutable-exports
class Loading extends Component {

    constructor (props) {
        super(props);
        this.state = {
            _isShow: false
        };
        events.loading.subscribeOnce(({isShow,title}) => {
            this.setState({
                _isShow: isShow,
            });

        });
    }


    componentWillReceiveProps (nextProps) {
        Logger.log(this.props, nextProps);

    }


    render () {
        let {_isShow} = this.state

        return <View className='loading'>
            {
                _isShow &&
                <View className='mask'>
                    <View className="circleProgress_wrapper">
                        <View className="wrapper right">
                            <View className="circleProgress rightcircle"></View>
                        </View>
                        <View className="wrapper left">
                            <View className="circleProgress leftcircle"></View>
                        </View>
                    </View>
                </View>

            }
        </View>;
    }
}

export default Loading;
