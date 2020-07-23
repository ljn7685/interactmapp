import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Button } from '@tarojs/components'

import { add, minus, asyncAdd } from '../../actions/counter'
import { api } from "../../public/util/api";
import { getUserInfo  } from "../../public/util/userInfoChanger";
import { getCloud } from '../../public/mapp_common/utils/cloud'
import { userInfoInit } from '../../public/util/userInfo';

import './index.scss'


@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))
class Index extends Component {
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { 
  }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
      <Button className='add_btn' onClick={()=>{
        console.log(getUserInfo());  
        api({
          apiName:'aiyong.interactb.user.data.set',
          method:'/interactive/setInertActBUserData',
          args: {
    
          },
          callback:res => {
             console.log('~~~~~~~~~~~~~~~~~~~~',res)
          },
          errCallback: err => {
            console.log(err)
          }
        });
      }}>+</Button>
        互动游戏mb端
      </View>
    )
  }
}

export default Index

