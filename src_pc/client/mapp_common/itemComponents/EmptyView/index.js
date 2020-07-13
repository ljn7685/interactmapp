import { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss';

class EmptyView extends Component {
    render(){
        let {data} = this.props;
        return (
            <View className='empty-img-body' style={data.bodyStyle}>
                <Image className='empty-img' style={data.imageStyle} src={data.url}/>
                <View className='text' style={data.txtStyle}>{data.txt}</View>
            </View>
        )
    }
}

EmptyView.defaultProps = {
    data:{
        url:'',
        txt:'',
        bodyStyle:{},
        imageStyle:{},
        txtStyle:{},
    }
}

export default EmptyView;