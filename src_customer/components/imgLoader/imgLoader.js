/**
 * 图片预加载组件
 *
 * @author HuiminLiu
 */

class ImgLoader {
    /**
   * 初始化方法，在页面的 onLoad 方法中调用，传入 Page 对象及图片加载完成的默认回调
   */
    constructor (pageContext, defaultCallback) {
        this.page = pageContext;
        this.defaultCallback = defaultCallback || function () {};
        this.callbacks = {};
        this.imgInfo = {};

        this.page.state.imgLoadList = []; // 下载队列
        this.page._imgOnLoad = this._imgOnLoad.bind(this);
        this.page._imgOnLoadError = this._imgOnLoadError.bind(this);
    }

    /**
   * 加载图片
   *
   * @param  {String}   src      图片地址
   * @param  {Function} callback 加载完成后的回调（可选），第一个参数个错误信息，第二个为图片信息
   */
    load (src, callback) {
        if (!src) return;

        let list = this.page.state.imgLoadList,
            imgInfo = this.imgInfo[src];

        if (callback) this.callbacks[src] = callback;

        // 已经加载成功过的，直接回调
        if (imgInfo) {
            this._runCallback(null, {
                src: src,
                width: imgInfo.width,
                height: imgInfo.height,
            });

            // 新的未在下载队列中的
        } else if (list.indexOf(src) === -1) {
            list.push(src);
            this.page.setState({ imgLoadList: list });
        }
    }
    /**
     * 单个image加载回调
     * @param {*} ev 
     */
    _imgOnLoad (ev) {
        let src = process.env.TARO_ENV === 'h5' ? ev.currentTarget.src : ev.currentTarget.dataset.src;
        let  width = ev.detail && ev.detail.width;
        let  height = ev.detail && ev.detail.height;

        // 记录已下载图片的尺寸信息
        this.imgInfo[src] = { width, height };
        this._removeFromLoadList(src);

        this._runCallback(null, { src, width, height });
    }
    /**
     * 单个image加载错误回调
     * @param {*} ev 
     */
    _imgOnLoadError (ev) {
        let src = ev.currentTarget.dataset.src;
        this._removeFromLoadList(src);
        this._runCallback('Loading failed', { src });
    }

    /**
     * 将图片从下载队列中移除
     * @param {*} src 
     */
    _removeFromLoadList (src) {
        let list = this.page.state.imgLoadList;
        list.splice(list.indexOf(src), 1);
        this.page.setState({ imgLoadList: list });
    }

    /**
     * 执行回调
     * @param {*} err 
     * @param {*} data 
     */
    _runCallback (err, data) {
        let callback = this.callbacks[data.src] || this.defaultCallback;
        callback(err, data);
        delete this.callbacks[data.src];
    }
}

module.exports = ImgLoader;
