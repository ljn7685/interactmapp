import React, { Component } from "react";
import { View, Image } from "@tarojs/components";
// 引入图片预加载组件
import ImgLoader from "./imgLoader";
/**
 * 图片预加载高阶组件
 * @param {*} WrappedComponent 
 * @param {*} images 
 * @param {*} style 
 */
function useImgLoader (WrappedComponent, images, style = { height: "100vh" }) {
    return class extends Component {
        constructor (props) {
            super(props);
            this.state = {
                imgList: this.getImgList(images),
                imgLoadList: [],
            };
            // 初始化图片预加载组件，并指定统一的加载完成回调
            this.imgLoader = new ImgLoader(this, this.imageOnLoad.bind(this));
        }
        componentDidMount () {
            this.loadImages();
        }
        /**
         * 获得imgList状态对象
         * @param {*} images 
         */
        getImgList (images) {
            return images.map((item) => ({ url: item, loaded: false }));
        }
        loadImages = () => {
            // 同时发起全部图片的加载
            this.state.imgList.forEach((item) => {
                this.imgLoader.load(item.url);
            });
        };

        imageOnLoad = (err, data) => {
            console.log("图片加载完成", err, data.src);

            const imgList = this.state.imgList.map((item) => {
                if (item.url === data.src) item.loaded = true;
                return item;
            });
            if (typeof this.wrapped.onProgress === "function") {
                const loadedNum = imgList.filter((item) => item.loaded).length;
                const progress = loadedNum / imgList.length;
                this.wrapped.onProgress({ progress });
                if (
                    progress >= 1 &&
                    typeof this.wrapped.onComplete === "function"
                ) {
                    this.wrapped.onComplete();
                }
            }
            this.setState({ imgList });
        };
        render () {
            const { imgLoadList, imgList } = this.state;
            return (
                <View style={style ? style : {}}>
                    <WrappedComponent
                        {...this.props}
                        imgList={imgList}
                        ref={(ref) => (this.wrapped = ref)}
                    ></WrappedComponent>
                    {imgLoadList.map((item, index) => {
                        return (
                            <Image
                                key={index}
                                src={item}
                                data-src={item}
                                onLoad={this.imgLoader._imgOnLoad.bind(
                                    this.imgLoader
                                )}
                                onError={this.imgLoader._imgOnLoadError.bind(
                                    this.imgLoader
                                )}
                                style='width:0;height:0;opacity:0'
                            />
                        );
                    })}
                </View>
            );
        }
    };
}
export default useImgLoader;
