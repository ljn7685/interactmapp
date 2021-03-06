import TWEEN from "@tweenjs/tween.js";

import { Container, Sprite } from "@tbminiapp/pixi-miniprogram-engine";

const arrow_scale = 0.746;
const arrow_head_height = 38 * arrow_scale;
const center_x = 335;
const center_y = 327;
const radius = 209;
const default_arrows = [
    { arrow: null, rotation: 0 },
    { arrow: null, rotation: 120 },
    { arrow: null, rotation: 240 },
];
/**
 * 转盘
 */
class TurnTable extends Container {
    constructor (properties) {
        super();
        this.assets = properties.assets;
        this.game = properties.game;
        this.addImages();
        this.initArrows();
    }
    arrows = null;
    table = null;
    speed = 72;
    arrow_height = 0;
    /**
     * 获得弓箭插在转盘后的缩放率
     */
    get arrow_scale () {
        return arrow_scale;
    }
    /**
     * 设置成功天使的显示
     * @param {boolean} visible 是否可见
     */
    setSuccessAngel (visible) {
        this.success_angel.visible = visible;
    }
    /**
     * 设置失败天使的显示
     * @param {boolean} visible 是否可见
     */
    setFailAngel (visible) {
        this.fail_angel.visible = visible;
    }
    /**
     * 设置正常天使的显示
     * @param {boolean} visible 是否可见
     */
    setNormalAngel (visible) {
        this.normal_angel.visible = visible;
    }
    /**
     * 初始化转盘上默认的箭头
     */
    initArrows () {
        this.arrows = [];
        for (let arrowItem of default_arrows) {
            this.addArrow(arrowItem.rotation);
        }
    }
    /**
     * 移除所有箭头
     */
    removeAllArrow () {
        for (let arrowItem of this.arrows) {
            if (arrowItem.arrow) {
                this.conatiner.removeChild(arrowItem.arrow);
            }
        }
        this.arrows = [];
    }
    /**
     * 重置
     */
    reset () {
        this.speed = 72;
        this.startRotate();
        this.setFailAngel(false);
        this.setNormalAngel(true);
        this.removeAllArrow();
        this.initArrows();
    }
    /**
     * 停止所有动画
     */
    stop () {
        if (this.tween) {
            this.tween.stop();
        }
    }
    /**
     * 是否射击成功
     */
    isShootSuccess () {
        let rotation = (this.conatiner.rotation / (2 * Math.PI)) * 360;
        return this.arrows.every((item) => {
            return Math.abs(item.rotation - rotation) > 6;
        });
    }
    /**
     * 是否碰上其他箭头
     * @param {*} arrow 
     */
    isHitArrow () {
        let rotation = (this.conatiner.rotation / (2 * Math.PI)) * 360;
        return this.arrows.some((item) => {
            // return this.game.bump.hit(item.arrow, arrow, false, false, true);
            return Math.abs(item.arrow.rotation - rotation) <= 6;
        });
    }
    /**
     * 获得转盘射击边缘
     */
    getHitBottom () {
        return (
            this.y +
            (this.table.y + this.table.height - arrow_head_height) *
                this.scale.y
        );
    }
    /**
     * 获得转盘底部位置
     */
    getBottom () {
        return (
            this.y +
            (this.table.y +
                this.table.height -
                arrow_head_height +
                this.arrow_height * arrow_scale) *
                this.scale.y
        );
    }
    /**
     * 添加箭头
     * @param {number} rotation 角度
     */
    addArrow (rotation) {
        if (rotation === undefined) {
            rotation = (this.conatiner.rotation / (2 * Math.PI)) * 360;
        }
        let arrow = new Sprite(this.assets.get("arrow"));
        this.conatiner.addChild(arrow);
        this.arrow_height = arrow.height;
        arrow.scale.x = arrow.scale.y = arrow_scale;
        arrow.rotation = -((2 * Math.PI) / 360) * rotation;
        arrow.pivot.x = arrow.width / 2;
        arrow.y =
            center_y +
            Math.cos(((2 * Math.PI) / 360) * rotation) *
                (radius - arrow_head_height);
        arrow.x =
            center_x +
            Math.sin(((2 * Math.PI) / 360) * rotation) *
                (radius - arrow_head_height);
        this.arrows.push({ arrow, rotation });
        return arrow;
    }
    /**
     * 加快转盘旋转速度
     */
    addSpeed () {
        this.speed *= 1.06;
        if (this.tween) {
            TWEEN.remove(this.tween);
        }
        this.game.nextTick(() => {
            this.startRotate();
        });
    }
    /**
     * 添加图片
     */
    addImages () {
        let container = (this.conatiner = new Container());
        this.addChild(container);
        this.conatiner.x = this.conatiner.pivot.x = center_x;
        this.conatiner.y = this.conatiner.pivot.y = center_y;
        const line_img = this.assets.get("turntable_line");
        const line = new Sprite(line_img);
        this.width = line.width;
        this.height = line.height;
        container.addChild(line);
        const table_img = this.assets.get("turntable");
        let table = (this.table = new Sprite(table_img));
        container.addChild(table);
        table.x = 126;
        table.y = 118;
        let angel = (this.normal_angel = new Sprite(
            this.assets.get("start_player")
        ));
        this.addChild(angel);
        angel.x = 193;
        angel.y = 169;

        let fail_angel = (this.fail_angel = new Sprite(
            this.assets.get("fail_angel")
        ));
        this.addChild(fail_angel);
        fail_angel.x = 193;
        fail_angel.y = 169;
        fail_angel.visible = false;
    }
    /**
     * 开始旋转
     */
    startRotate () {
        if (this.conatiner.rotation === 2 * Math.PI) {
            this.conatiner.rotation = 0;
        }
        const duration =
            ((360 - (this.conatiner.rotation / Math.PI) * 180) / this.speed) *
            1000;
        this.tween = new TWEEN.Tween(this.conatiner)
            .to(
                { rotation: 2 * Math.PI },
                duration
            )
            .onComplete(() => {
                this.startRotate();
            })
            .start();
    }
    assets = null;
}
export default TurnTable;
