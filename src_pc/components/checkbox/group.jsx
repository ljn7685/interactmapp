import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import AdCheckbox from "./index";
import "./index.scss";

export default (props) => {
    const {
        className,
        disabled = false,
        groupList = [],
        checkedArr = [],
        onChange,
        itemClassName,
    } = props;
    const [list, setList] = useState([]);

    const handleClk = (e) => {
        console.log("handleClik", checkedArr, e, checkedArr.includes(e));
        let newChecked = [];
        if (checkedArr.includes(e)) {
            // 如果原来是有的，则去掉
            newChecked = checkedArr.filter((item) => item !== e);
        } else {
            // 原来没有，加上去
            newChecked = [...checkedArr, e];
        }
        newChecked = Array.from(new Set(newChecked));
        console.log("newChecked", newChecked);
        onChange && onChange(newChecked);
    };

    useEffect(() => {
        if (list.length < 1) {
            console.log("xxx", checkedArr);
            setList(groupList);
        }
    }, [checkedArr, groupList, list.length]);

    return (
        <View className={`ad--checkbox-group ${className}`}>
            {list.map(item => {
                return (
                    <View className={`ad--group-item ${itemClassName}`} key={item.key}>
                        <AdCheckbox
                            checked={checkedArr.includes(item.key)}
                            disabled={disabled}
                            text={item.text}
                            onClick={() => handleClk(item.key)}
                        />
                    </View>
                );
            })}
        </View>
    );
};
