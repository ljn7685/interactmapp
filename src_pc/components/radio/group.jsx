import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import AdRadio from "./index";
import "./index.scss";


export default (props) => {
    const { className, disabled = false, groupList = [], checkedKey = '', onChange, itemClassName } = props;
    const [list, setList] = useState([]);

    const handleClk = (e) => {
        onChange && onChange(e);
    };

    useEffect(() => {
        if(list.length < 1) {
            setList(groupList);
        }
    }, [groupList, list.length]);

    return (
        <View className={`ad--radio-group ${className}`}>
            {list.map((item) => {
                return (
                    <View className={`ad--group-item ${itemClassName}`} key={item.key}>
                        <AdRadio checked={item.key === checkedKey} disabled={disabled} text={item.text} onClick={() => handleClk(item.key)} />
                    </View>
                );
            })}
        </View>
    );
};
