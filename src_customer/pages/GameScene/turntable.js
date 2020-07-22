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

class TurnTable extends Container {
    constructor(properties) {
        super();
        this.assets = properties.assets;
        this.game = properties.game;
        this.addImages();
        this.initArrows();
        this.startRotate();
    }
    arrows = null;
    table = null;
    speed = 72;
    get arrow_scale() {
        return arrow_scale;
    }
    setSuccessAngel(visible) {
        this.success_angel.visible = visible;
    }
    setFailAngel(visible) {
        this.fail_angel.visible = visible;
    }
    setNormalAngel(visible) {
        this.normal_angel.visible = visible;
    }
    initArrows() {
        this.arrows = [];
        for (let arrowItem of default_arrows) {
            this.addArrow(arrowItem.rotation);
        }
    }
    removeAllArrow() {
        for (let arrowItem of this.arrows) {
            if (arrowItem.arrow) {
                this.conatiner.removeChild(arrowItem.arrow);
            }
        }
        this.arrows = [];
    }
    reset() {
        this.speed = 72;
        this.startRotate();
        this.setFailAngel(false);
        this.setNormalAngel(true);
        this.removeAllArrow();
        this.initArrows();
    }
    stop() {
        if (this.tween) {
            this.tween.stop();
        }
    }
    isShootSuccess() {
        let rotation = (this.conatiner.rotation / (2 * Math.PI)) * 360;
        return this.arrows.every((item) => {
            return Math.abs(item.rotation - rotation) > 6;
        });
    }
    isHitArrow(arrow) {
        return this.arrows.some((item) => {
            // return this.game.bump.hit(item.arrow, arrow, false, false, true);
            return Math.abs(item.arrow.rotation + this.conatiner.rotation) <= 6;
        });
    }
    getHitBottom() {
        return (
            this.y +
            (this.table.y + this.table.height - arrow_head_height) *
                this.scale.y
        );
    }
    getBottom() {
        return this.y + this.height * this.scale.y;
    }
    addArrow(rotation) {
        if (rotation === undefined) {
            rotation = (this.conatiner.rotation / (2 * Math.PI)) * 360;
        }
        let arrow = new Sprite(this.assets.get("arrow"));
        this.conatiner.addChild(arrow);
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
    addSpeed() {
        this.speed *= 1.06;
        if (this.tween) {
            TWEEN.remove(this.tween);
        }
        console.log(this.speed);
        this.game.nextTick(() => {
            this.startRotate();
        });
    }
    addImages() {
        let container = (this.conatiner = new Container());
        this.addChild(container);
        this.conatiner.x = this.conatiner.pivot.x = center_x;
        this.conatiner.y = this.conatiner.pivot.y = center_y;
        const line_img = this.assets.get("turntable_line");
        this.width = line_img.width;
        this.height = line_img.height;
        container.addChild(new Sprite(line_img));
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
    startRotate() {
        if (this.conatiner.rotation === 2 * Math.PI) {
            this.conatiner.rotation = 0;
        }
        const duration =
            ((360 - (this.conatiner.rotation / Math.PI) * 180) / this.speed) *
            1000;
        this.tween = new TWEEN.Tween(this.conatiner)
            .to(
                {
                    rotation: 2 * Math.PI,
                },
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
