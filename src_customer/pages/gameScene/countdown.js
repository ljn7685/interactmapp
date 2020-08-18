import TWEEN from "@tweenjs/tween.js";

const { Tween } = TWEEN;

const update_interval = 80;
/**
 * 倒计时
 */
class CountDown {
    constructor (properties) {
        this.game = properties.game;
        this.maxTime = (properties.time * 1000) / update_interval;
        this.time = this.maxTime;
        this.setText();
    }
    label = null;
    time = 0;
    startTip = false;
    delta = 0;
    scale = 1;
    value = '00:00'
    /**
     * 设置文字
     */
    setText () {
        this.value = ((this.time * update_interval) / 1000)
            .toFixed(2)
            .toString();
        this.game.emit('countdown', {
            value:this.value,
            scale: this.scale,
        });
    }
    /**
     * 重新开始倒计时
     */
    restart () {
        this.time = this.maxTime;
        this.start();
    }
    /**
     * 开始倒计时
     */
    start () {
        this.tick();
    }
    /**
     * 停止倒计时
     */
    stop () {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
    /**
     * 添加最后3秒的提示动画
     */
    onTip () {
        let times = 6;
        let anim = () => {
            let obj = { value: 0 };
            let origon = this.scale;
            let target = this.scale === 1 ? 1.5 : 1;
            new Tween(obj)
                .to(
                    { value: 1 },
                    500
                )
                .onUpdate((object, elapsed) => {
                    this.scale = origon + (target - origon) * elapsed;
                    this.game.emit('countdown', {
                        value:this.value,
                        scale: this.scale,
                    });
                })
                .onComplete(() => {
                    times--;
                    if (times > 0) {
                        anim();
                    }
                })
                .start();
        };
        anim();
    }
    /**
     * 每一帧的回调，更新倒计时时间，显示最后几秒的提示动画
     */
    tick () {
        this.timer = setTimeout(() => {
            this.time--;
            this.setText();
            if (this.time * update_interval <= 3000 && !this.startTip) {
                this.startTip = true;
                this.onTip();
            }
            if (this.time === 0) {
                this.game.gameOver();
            } else {
                this.tick();
            }
        }, update_interval);
    }
    assets = null;
}
export default CountDown;
