/* eslint-disable react/jsx-key */
import React, { Component } from "react";
import classNames from "classnames";
import Modal from "../../../public/components/modal/modal.jsx";
import styles from "./index.module.scss";
import { Text, View, Input, Image } from "@tarojs/components";
import { getSaleGoodsApi } from "../../../../public/bPromiseApi/index.js";
import Taro from "@tarojs/taro";

const pageSize = 2;
class SelectGoods extends Component {
    constructor (props) {
        super(props);
        this.state = {
            pageNum: 1,
            total: 0,
            query: "",
            pageData: [],
            selectGoods: this.props.goods || [],
            searchInput: "",
            showType: "onsale",
        };
    }
    componentDidMount () {
        this.getSaleGoods();
    }
    componentDidUpdate (prevProps, prevState) {
        const { pageNum, query, showType } = this.state;
        if (showType === "onsale") {
            if (
                prevState.showType !== showType ||
                prevState.pageNum !== pageNum ||
                prevState.query !== query
            ) {
                this.getSaleGoods();
            }
        }
    }
    /**
     * 页码改变回调
     * @param {string} type 翻页类型(prev上一页，next下一页)
     */
    onChangePageNum (type) {
        const { pageNum, total } = this.state;
        if (type === "prev") {
            if (pageNum > 1) {
                this.setState({ pageNum: pageNum - 1 });
            } else {
                Taro.showToast({ title: "已经是第一页了" });
            }
        } else if (type === "next") {
            if (pageNum < total) {
                this.setState({ pageNum: pageNum + 1 });
            } else {
                Taro.showToast({ title: "已经是最后一页了" });
            }
        }
    }
    /**
     * 商品点击回调
     * @param {*} item 商品信息
     */
    onClickGood (item) {
        const { selectGoods } = this.state;
        const selected =
            selectGoods.filter((good) => good.num_iid === item.num_iid).length >
            0;
        if (!selected) {
            if (selectGoods.length >= this.props.goodsLimit) {
                Taro.showToast({ title: "已经选择足够多的商品了" });
                return;
            }
            this.setState({ selectGoods: [...selectGoods, { ...item }] });
        } else {
            this.setState({
                selectGoods: selectGoods.filter(
                    (good) => good.num_iid !== item.num_iid
                ),
            });
        }
    }
    onClickSearch = () => {
        const { searchInput } = this.state;
        this.setState({
            query: searchInput,
            pageNum: 1,
            showType: "onsale",
        });
    };
    /**
     * 请求在售商品信息
     */
    async getSaleGoods () {
        const { pageNum, query, total } = this.state;
        const args = {
            fields: "num_iid,title,price,pic_url",
            page_no: pageNum,
            page_size: pageSize,
        };
        if (query) {
            args.q = query;
        }
        try {
            const goods = await getSaleGoodsApi(args);
            const pageData = goods && goods.items ? goods.items : [];
            const newTotal =
                goods && goods.total_results
                    ? Math.ceil(goods.total_results / pageSize)
                    : total;
            this.setState({
                pageData,
                total: newTotal,
            });
            console.log("goods", goods);
        } catch (err) {
            Taro.showToast({ title: "查询商品失败！" });
        }
    }
    /**
     * 获取商品列表内容
     */
    getPageContent () {
        const { pageData, selectGoods, showType } = this.state;
        const data = showType === "onsale" ? pageData : selectGoods;
        if (!data || data.length === 0) {
            return (
                <View className={styles["no-goods"]}>
                    <Text className={classNames("iconfont", styles["sad"])}>
                        &#xe703;
                    </Text>
                    <Text>抱歉，没有找到符合条件的商品</Text>
                </View>
            );
        } else {
            return (
                <View className={styles["scroll"]}>
                    <View className={styles["scroll-content"]}>
                        {data.map((item) => {
                            const selected =
                                selectGoods.filter(
                                    (good) => good.num_iid === item.num_iid
                                ).length > 0;
                            return (
                                <View
                                    className={classNames(styles["good-item"], { [styles["select"]]: selected })}
                                    onClick={this.onClickGood.bind(this, item)}
                                >
                                    {selected && (
                                        <View className={styles["flag"]}>
                                            <Text
                                                className={classNames(
                                                    styles["flag-text"],
                                                    styles["iconfont"]
                                                )}
                                            >
                                                &#xe615;
                                            </Text>
                                        </View>
                                    )}
                                    <Image
                                        className={styles["pic"]}
                                        src={item.pic_url}
                                    ></Image>
                                    <Text className={styles["title"]}>
                                        {item.title}
                                    </Text>
                                    <Text className={styles["price"]}>
                                        ¥{item.price}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            );
        }
    }
    onConfirm = () => {
        const { selectGoods } = this.state;
        this.props.onSetGoods(selectGoods);
        this.props.onClose();
    };
    render () {
        const { selectGoods, pageNum, total, showType } = this.state;
        const { onClose, goodsLimit } = this.props;
        const header = [
            <Text>选择商品</Text>,
            <Text
                className={classNames(
                    styles["iconfont"],
                    styles["close"],
                    styles["pointer"]
                )}
                onClick={onClose}
            >
                &#xe624;
            </Text>,
        ];
        console.log("state", this.state);
        return (
            <Modal
                visible
                header={header}
                headerStyle={styles.header}
                containerStyle={styles.container}
                contentStyle={styles.content}
            >
                <View className={styles["content-top"]}>
                    <View
                        className={classNames(styles["top-bar"], { [styles["select"]]: showType === "onsale" })}
                        onClick={() => {
                            this.setState({ showType: "onsale" });
                        }}
                    >
                        出售中
                    </View>
                    <View
                        className={classNames(styles["top-bar"], { [styles["select"]]: showType === "select" })}
                        onClick={() => {
                            this.setState({
                                showType: "select",
                                pageNum: 1,
                                total: 1,
                            });
                        }}
                    >
                        已选择{selectGoods.length}/{goodsLimit}
                    </View>
                    {showType === "onsale" && (
                        <View className={styles["top-search"]}>
                            <Input
                                placeholder='请输入关键字搜索'
                                className={styles["search-input"]}
                                onInput={(e) => {
                                    this.setState({ searchInput: e.target.value });
                                }}
                            />
                            <View
                                className={classNames(
                                    styles["search-btn"],
                                    styles["pointer"]
                                )}
                                onClick={this.onClickSearch}
                            >
                                <Text
                                    className={classNames(
                                        styles["search-text"],
                                        styles["iconfont"]
                                    )}
                                >
                                    &#xe60e;
                                </Text>
                                搜索
                            </View>
                        </View>
                    )}
                </View>
                <View className={styles["content-middle"]}>
                    {this.getPageContent()}
                </View>
                <View className={styles["content-bottom"]}>
                    <View className={styles["page"]}>
                        <View
                            className={classNames(
                                styles["iconfont"],
                                styles["page-btn"]
                            )}
                            onClick={this.onChangePageNum.bind(this, "prev")}
                        >
                            &#xe63c;
                        </View>
                        <Text className={styles["page-num"]}>
                            {pageNum}/{total}
                        </Text>
                        <View
                            className={classNames(
                                styles["iconfont"],
                                styles["page-btn"]
                            )}
                            onClick={this.onChangePageNum.bind(this, "next")}
                        >
                            &#xe620;
                        </View>
                    </View>
                    <View
                        className={classNames(
                            styles["confirm"],
                            styles["pointer"]
                        )}
                        onClick={this.onConfirm}
                    >
                        确认
                    </View>
                    <View
                        className={classNames(
                            styles["cancel"],
                            styles["pointer"]
                        )}
                        onClick={onClose}
                    >
                        取消
                    </View>
                </View>
            </Modal>
        );
    }
}

export default SelectGoods;
