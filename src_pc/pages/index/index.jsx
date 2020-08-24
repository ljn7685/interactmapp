import React, { Component } from 'react';
import {  View } from '@tarojs/components';
import Layout from '../../components/layout/index';
import './index.scss';
import HotActivity from '../../components/hotActivity/index';


class Index extends Component {
    constructor (props) {
        super(props);
    }
    componentDidMount () {

    }
    render () {
        return (
            <View className='interactmapp'>
                <Layout />
                <HotActivity />
            </View>
        );
    }
}

export default Index;

