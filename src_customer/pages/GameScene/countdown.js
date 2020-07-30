import { Container, Text, TextStyle } from "@tbminiapp/pixi-miniprogram-engine";
import TWEEN from "@tweenjs/tween.js";

const { Tween } = TWEEN;

const update_interval = 80;
/**
 * 倒计时
 */
class CountDown extends Container {
    constructor(properties) {
        super();
        this.game = properties.game;
        this.maxTime = (properties.time * 1000) / update_interval;
        this.time = this.maxTime;
        this.initText();
    }
    label = null;
    time = 0;
    startTip = false;
    delta = 0;
    initText() {
        let style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 48,
            fill: "white",
        });
        let strTime = ((this.time * update_interval) / 1000)
            .toFixed(2)
            .toString();
        this.label = new Text(`倒计时${strTime}`, style);
        this.label.pivot.x = this.label.width / 2;
        this.label.pivot.y = this.label.height / 2;
        this.addChild(this.label);
    }
    removeText() {
        if (this.label) {
            this.removeChild(this.label);
            this.label = null;
        }
    }
    setText() {
        this.removeText();
        this.initText();
    }
    restart() {
        this.time = this.maxTime;
        this.start();
    }
    start() {
        this.tick();
    }
    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
    /**
     * 添加最后3秒的提示动画
     */
    onTip() {
        let times = 6;
        let anim = () => {
            let obj = { value: 0 };
            let origon = this.label.scale.x;
            let target = origon === 1 ? 1.5 : 1;
            new Tween(obj)
                .to(
                    {
                        value: 1,
                    },
                    500
                )
                .onUpdate((object, elapsed) => {
                    this.label.scale.x = this.label.scale.y =
                        origon + (target - origon) * elapsed;
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
    tick() {
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
