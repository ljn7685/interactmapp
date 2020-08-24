import React from 'react';
import classNames from 'classnames';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';

const Pagination = (props) => {
    const { pageNum, total, onChange, className = '' } = props;
    const onChangePage = (type) => {
        if (type === "prev" && pageNum <= 1) {
            Taro.showToast({ title: "已经是第一页了" });
        } else if (type === "next" && pageNum >= total) {
            Taro.showToast({ title: "已经是最后一页了" });
        } else {
            onChange && onChange(type);
        }
    };
    return (<View className={`${styles["page"]} ${className}`}>
        <View
            className={classNames(
                "iconfont",
                styles["page-btn"]
            )}
            onClick={onChangePage.bind(null, "prev")}
        >
        &#xe669;
        </View>
        <Text className={styles["page-text"]}>
            <Text className={styles["page-num"]}>{pageNum}</Text>/{total}
        </Text>
        <View
            className={classNames(
                "iconfont",
                styles["page-btn"],
                styles['next']
            )}
            onClick={onChangePage.bind(null, "next")}
        >
        &#xe669;
        </View>
    </View>);
};
 
export default Pagination;