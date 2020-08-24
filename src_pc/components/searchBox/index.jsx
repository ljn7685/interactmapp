import React, { useState } from "react";
import { Text, View, Input } from "@tarojs/components";
import styles from "./index.module.scss";
import classNames from "classnames";
/**
 * 搜索框
 * @param {string} placeholder 占位字符
 * @param {function} onSearch 搜索按钮点击回调
 */
const SearchBox = (props) => {
    const { placeholder = "请输入关键字搜索", onSearch, className = '', value } = props;
    const [searchInput, setInput] = useState("");
    const handleClick = () => {
        onSearch && onSearch(searchInput);
    };
    return (
        <View
            className={`${styles["search-box"]} ${className}`}
        >
            <Input
                placeholder={placeholder}
                className={styles["search-input"]}
                value={value}
                onInput={(e) => {
                    setInput(e.target.value);
                }}
                onConfirm={handleClick}
            />
            <View className={styles["search-btn"]} onClick={handleClick}>
                <Text
                    className={classNames(styles["search-text"], "iconfont2")}
                >
                    &#xe60e;
                </Text>
                搜索
            </View>
        </View>
    );
};

export default SearchBox;
