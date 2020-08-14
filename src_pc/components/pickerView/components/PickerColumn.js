/**
 * Created by Aus on 2017/5/25.
 */
import React from "react";
import propTypes from "prop-types";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import "../style/picker-column.scss";
import { View, ScrollView } from "@tarojs/components";

// picker-view 中的列
class PickerColumn extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    /**
     * 获取所有lie
     */
    getCols () {
        // 根据value 和 index 获取到对应的data
        const { data, value, index, prefixCls, onValueChange } = this.props;
        return data.map((item, i) => (
            <View
                key={index + "-" + i}
                id={`picker-column-${index + "-" + i}`}
                onClick={() => onValueChange(item.value, index)}
                className={classNames([
                    `${prefixCls}-col`,
                    { selected: item.value === value },
                ])}
            >
                {item.label}
            </View>
        ));
    }
    render () {
        const { prefixCls, data, value, index } = this.props;
        const cols = this.getCols();
        const selectIndex = data.findIndex(item => item.value === value);
        return (
            <View className={prefixCls}>
                <ScrollView
                    className={`${prefixCls}-list`}
                    scrollIntoView={`picker-column-${index + "-" + selectIndex}`}
                    scrollY
                >
                    <View className={`${prefixCls}-content`}>{cols}</View>
                </ScrollView>
            </View>
        );
    }
}
/**
 * 空函数
 */
function empty () {}

PickerColumn.propTypes = {
    prefixCls: propTypes.string, // 前缀class
    index: propTypes.number.isRequired,
    data: propTypes.array.isRequired,
    value: propTypes.string,
    onValueChange: propTypes.func,
};

PickerColumn.defaultProps = {
    prefixCls: "zby-picker-column",
    value: "",
    onValueChange: empty,
};

export default PickerColumn;
