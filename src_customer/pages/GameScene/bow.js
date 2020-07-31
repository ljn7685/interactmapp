import { Container, Sprite, Graphics } from "@tbminiapp/pixi-miniprogram-engine";

const arrow_height = 256;
const arrow_pull_pos = 32;
const arrow_head_height = 38;
const line_startY = 77;
const line_startX = 39;
const halfWidth = 142;
const maxDistance =
  arrow_height - arrow_pull_pos - line_startY - arrow_head_height;
/**
 * 弓箭
 */
class Bow extends Container {
  constructor(properties) {
    super();
    this.assets = properties.assets;
    this.initLine();
    this.addImages();
  }
  assets = null;
  pullDistance = 0;
  context = null;
  arrow = null;
  addImages() {
    this.bow_bg = new Sprite(this.assets.get("bow"));
    this.addChild(this.bow_bg);
    this.width = this.bow_bg.width;
  }
  /**
   * 初始化弓箭线
   */
  initLine() {
    let context = (this.context = new Graphics());
    context.x = 0;
    context.y = 0;
    this.addChild(context);
    this.drawLine();
  }
  /**
   * 画弓箭的线
   */
  drawLine() {
    let context = this.context;
    context.clear();
    context.lineStyle(2, 0xaedeff);
    context.beginFill();
    context.moveTo(line_startX, line_startY); //设置起点状态
    context.lineTo(line_startX + halfWidth, line_startY + this.pullDistance); //设置末端状态
    context.endFill(); //进行绘制
    context.beginFill();
    context.moveTo(line_startX + halfWidth, line_startY + this.pullDistance); //设置起点状态
    context.lineTo(line_startX + halfWidth + halfWidth, line_startY); //设置末端状态
    context.endFill(); //进行绘制
  }
  /**
   * 添加箭头
   */
  addArrow() {
    this.arrow = new Sprite(this.assets.get("arrow"));
    this.addChild(this.arrow);
    this.pullArrow();
  }
  /**
   * 更新箭头拉动时的位置
   */
  pullArrow() {
    let arrow = this.arrow;
    arrow.y = line_startY - (arrow_height - arrow_pull_pos) + this.pullDistance;
    arrow.pivot.x = arrow.width / 2;
    arrow.x = this.bow_bg.width >> 1;
  }
  /**
   * 获取箭头在场景中的位置Y
   */
  getArrowY() {
    return this.y + this.arrow.y * this.scale.y;
  }
  removeArrow() {
    let arrow = this.arrow;
    if (arrow) {
      this.removeChild(arrow);
      this.arrow = null;
      return arrow;
    }
  }
  reset() {
    this.setPullDistance(0);
    this.removeArrow();
  }
  /**
   * 设置拉动距离
   * @param {number} distance 拉动距离
   */
  setPullDistance(distance) {
    if (distance >= 0 && distance <= maxDistance) {
      this.pullDistance = distance;
      this.drawLine();
      if (this.arrow) {
        this.pullArrow();
      }
    }
  }
  /**
   * 获取箭头飞行的终点位置
   * @param {number} distance 飞行距离 
   */
  getFlyY(distance) {
    return this.arrow.y - distance / this.scale.y;
  }
}
export default Bow;
