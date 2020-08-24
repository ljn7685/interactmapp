import * as PIXI from "@tbminiapp/pixi-miniprogram-engine";
import EventEmitter from "eventemitter3";
import TWEEN from "@tweenjs/tween.js";
import TurnTable from "./turntable";
import Bow from "./bow";
import CountDown from "./countdown";
import { getAudioContext } from "../../../public/util";

// const arrow_flying_mp3 = 'http://download.taobaocdn.com/freedom/90053/media/Animal.mp3';
const arrow_flying_mp3 = "http://qniyong.oss-cn-hangzhou.aliyuncs.com/interact/arrow_flying.mp3";

const flying_duration = 200;
const {
    loader: { resources },
    Sprite,
} = PIXI;
const { Tween } = TWEEN;
class Game extends EventEmitter {
    width = 0;
    height = 0;

    stage = null;
    ticker = null;
    state = null;
    score = 0;

    arrow_count = 0;

    bg = null;
    app = null;

    pulling = false;
    pull_start = false;
    pull_pos = null;
    designHeight = 1624;
    state = 0;

    isFlying = false;
    /**
     * 初始化音频
     */
    initAudio () {
        this.audioContext = getAudioContext(arrow_flying_mp3);
        const audioContext = this.audioContext;
        audioContext.onEnded(() => {
            audioContext.destroy();
        });
    }
    /**
     *
     * @param {PIXI.Application} app
     * @param {*} assets
     * @param {*} config
     */
    init (app, config) {
        this.app = app;
        this.ticker = app.ticker;
        this.stage = app.stage;
        this.assets = {
            get: (name) => {
                return resources[name].texture;
            },
        };
        this.config = config;
        this.arrow_count = config.arrow_count;
        this.duration = config.game_duration;
        this.initStage();
    }
    /**
     * 根据屏幕大小，调整游戏场景
     */
    onSceneResize () {
        let bgImg = this.assets.get("loading_bg");
        const scaleX = this.width / bgImg.width;
        const scaleY = this.height / bgImg.height;
        this.bg.scale.x = scaleX;
        this.bg.scale.y = scaleY;

        let children = this.stage.children;
        let ratio = this.height / this.designHeight;
        for (let child of children) {
            if (child.origonY === undefined) {
                child.origonY = child.y;
            }
            child.y = child.origonY * ratio;
            if (child.origonscaleY === undefined) {
                child.origonscaleY = child.scale.y;
            }
            if (child !== this.bg) {
                child.scale.y = child.scale.x = child.origonscaleY * ratio;
            }
        }
    }
    /**
     * 获得垂直方向相比设计分辨率的缩放
     */
    getRatio () {
        return this.height / this.designHeight;
    }
    /**
     * 初始化舞台
     */
    initStage () {
        this.ticker.add(this.onUpdate.bind(this));

        // 初始化
        this.initBackground();
        this.initTurnTable();
        this.initBow();
        this.initArrowTotal();
        this.initCountdown();
        // //准备游戏
        this.onSceneResize();
    }
    /**
     * 初始化背景图
     */
    initBackground () {
        let bgImg = this.assets.get("loading_bg");
        const scaleX = this.width / bgImg.width;
        const scaleY = this.height / bgImg.height;
        this.bg = new Sprite(bgImg);
        this.bg.scale.x = scaleX;
        this.bg.scale.y = scaleY;
        this.stage.addChild(this.bg);
    }
    /**
     * 添加下一帧执行的函数
     * @param {*} fn 
     */
    nextTick (fn) {
        setTimeout(fn, 0);
    }
    /**
     * 添加每一帧执行的函数
     * @param {*} obj 
     */
    addTick (obj) {
        this.ticker.add(obj);
    }
    /**
     * 移除每一帧执行的函数
     * @param {*} obj 
     */
    removeTick (obj) {
        this.ticker.remove(obj);
    }
    /**
     * 初始化转盘
     */
    initTurnTable () {
        let turntable = (this.turntable = new TurnTable({
            assets: this.assets,
            game: this,
        }));
        // turntable.x = 39;
        turntable.y = 350;
        this.stage.addChild(turntable);
        this.setHorizontalCenter(turntable);
    }
    /**
     * 设置在屏幕中水平居中
     * @param {*} obj 
     */
    setHorizontalCenter (obj) {
        obj.pivot.x = obj.width / 2;
        obj.x = this.width / 2;
    }
    /**
     * 初始化弓箭
     */
    initBow () {
        let bow = (this.bow = new Bow({ assets: this.assets }));
        bow.x = 196;
        bow.y = 1253;
        this.stage.addChild(bow);
        this.setHorizontalCenter(bow);
    }
    /**
     * 初始化弓箭数量文本
     */
    initArrowTotal () {
        this.emit('arrow_count', this.arrow_count);
    }
    /**
     * 更新弓箭数量
     * @param {*} count 
     */
    setArrowCount (count) {
        if (count >= 0 && count <= this.config.arrow_count) {
            this.arrow_count = count;
            this.emit('arrow_count', this.arrow_count);
        }
    }
    /**
     * 移除弓箭数量文本
     */
    removeArrowTotal () {
        if (this.arrowTotal) {
            this.stage.removeChild(this.arrowTotal);
            this.arrowTotal = null;
        }
    }
    /**
     * 初始化倒计时
     */
    initCountdown () {
        this.countdown = new CountDown({
            game: this,
            time: this.duration / 1000,
        });
    }
    /**
     * 触摸开始
     * @param {*} e 
     */
    onPointStart = (e) => {
        if (this.isFlying) return;
        this.pull_start = true;
        this.pulling = false;
        this.pull_pos = [e.touches[0].clientX, e.touches[0].clientY];
        this.emit("pointstart");
    };
    /**
     * 触摸移动
     * @param {*} e 
     */
    onPointMove = (e) => {
        if (!this.pull_start) return;
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        let deltaY = y - this.pull_pos[1];
        if (!this.pulling) {
            if (deltaY >= 10) {
                this.pulling = true;
            }
        }
        if (this.pulling) {
            let newDistance = this.bow.pullDistance + deltaY;
            this.bow.setPullDistance(newDistance);
            this.pull_pos = [x, y];
        }
    };
    /**
     * 触摸结束
     */
    onPointEnd = () => {
        if (!this.pull_start) return;
        this.pull_start = false;
        if (this.pulling) {
            this.pulling = false;
            this.bow.setPullDistance(0);
            let arrow = this.bow.arrow;
            if (arrow) {
                this.arrowFlying(arrow);
            }
        }
    };
    /**
     * 箭头飞行动画
     * @param {Arrow} arrow 箭头对象
     */
    arrowFlying (arrow) {
        this.isFlying = true;
        this.initAudio();
        this.audioContext.play();
        let distance = this.bow.getArrowY() - this.turntable.getHitBottom();
        let tween = new Tween(arrow)
            .to(
                { y: this.bow.getFlyY(distance) },
                flying_duration
            )
            .onUpdate((object, elapsed) => {
                arrow.scale.x = 1 + (this.turntable.arrow_scale - 1) * elapsed;
                arrow.scale.y = 1 + (this.turntable.arrow_scale - 1) * elapsed;
                if (this.bow.getArrowY() <= this.turntable.getBottom()) {
                    // console.log("hit TurnTable");
                    if (this.turntable.isHitArrow(arrow)) {
                        // console.log("hit other arrow");
                        tween.stop();
                        TWEEN.remove(tween);
                        this.isFlying = false;
                        this.onShootFail();
                    }
                }
            })
            .onComplete(() => {
                this.isFlying = false;
                console.log("flyComplete");
                if (this.turntable.isShootSuccess()) {
                    this.onShootSuccess();
                } else {
                    this.onShootFail();
                }
            })
            .start();
    }
    /**
     * 弓箭射击失败回调
     */
    onShootFail () {
        console.log("onShootFail");
        if (this.state === 1) return;
        this.setArrowCount(this.arrow_count - 1);
        this.bow.reset();
        this.bow.addArrow();
        this.turntable.setNormalAngel(false);
        this.turntable.setFailAngel(true);
        this.gameOver();
    }
    /**
     * 弓箭射击成功回调
     */
    onShootSuccess () {
        console.log("onShootSuccess");
        if (this.state === 1) return;
        this.setArrowCount(this.arrow_count - 1);
        this.score += this.config.arrow_score;
        this.bow.reset();
        this.turntable.setNormalAngel(false);
        this.emit("changeSuccessAngel", true);
        this.emit("changeHeart", true);
        this.turntable.addArrow();
        this.turntable.addSpeed();
        if (this.arrow_count > 0) {
            this.bow.addArrow();
        }
        this.delayShowNormalAngel(() => {
            if (this.arrow_count === 0) {
                this.gameOver();
            }
        });
    }
    /**
     * 延迟一段时间显示普通状态下的天使
     * @param {*} callback 
     */
    delayShowNormalAngel (callback) {
        if (this.angelTimer) {
            clearTimeout(this.angelTimer);
            this.angelTimer = null;
        }
        this.angelTimer = setTimeout(() => {
            this.emit("changeSuccessAngel", false);
            this.emit("changeHeart", false);
            this.turntable.setFailAngel(false);
            this.turntable.setNormalAngel(true);
            this.angelTimer = null;
            callback && callback();
        }, 1400);
    }
    /**
     * 每一帧执行的函数
     */
    onUpdate () {
        TWEEN.update();
    }
    /**
     * 游戏停止回调，游戏结束事调用
     */
    stop () {
        if (this.angelTimer) {
            clearTimeout(this.angelTimer);
            this.angelTimer = null;
        }
        if (this.ticker) {
            this.ticker.stop();
        }
        if (this.countdown) {
            this.countdown.stop();
        }
        if (this.turntable) {
            this.turntable.stop();
        }
        TWEEN.removeAll();
    }
    /**
     * 游戏销毁，清理资源
     */
    destroy () {
        console.log('destory');
    }
    /**
     * 游戏准备就绪回调
     */
    gameReady () {
        this.bow.addArrow();
        this.countdown.start();
        this.turntable.startRotate();
    }
    /**
     * 游戏结束回调
     */
    gameOver () {
        this.state = 1;
        this.nextTick(() => {
            this.stop();
            if (
                this.score ===
                this.config.arrow_count * this.config.arrow_score
            ) {
                this.emit("gameover", { isSuccess: true, score: this.score });
            } else {
                this.emit("gameover", { isSuccess: false, score: this.score });
            }
        });
    }
}
export default Game;
